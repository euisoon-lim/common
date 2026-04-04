/**
 * PDF 파서 - 보험상품 비교 PDF를 텍스트로 추출하고 페이지별로 분리
 *
 * 사용법:
 *   import { parsePDF } from './parser.js';
 *   const result = await parsePDF(pdfBuffer);
 *
 * 의존성: pdf-parse (npm install pdf-parse)
 */

/**
 * PDF 버퍼를 페이지별 텍스트 배열로 변환
 * @param {Buffer|ArrayBuffer} pdfBuffer - PDF 파일 버퍼
 * @returns {Promise<{metadata: Object, pages: Array<{pageNum: number, text: string}>}>}
 */
export async function parsePDF(pdfBuffer) {
    // Supabase Edge Function(Deno) 환경에서는 pdf-parse 대신
    // pdfjs-dist 또는 외부 API 활용 가능
    // 여기서는 Node.js 환경 기준 구현
    const pdfParse = (await import('pdf-parse')).default;

    const data = await pdfParse(pdfBuffer, {
        // 페이지별 텍스트를 분리하기 위한 커스텀 렌더
        pagerender: renderPage
    });

    // 페이지별 텍스트 분리
    const pages = data.text
        .split('<<<PAGE_BREAK>>>')
        .filter(t => t.trim())
        .map((text, idx) => ({
            pageNum: idx + 1,
            text: text.trim()
        }));

    // 문서 메타데이터 추출
    const metadata = extractDocumentMetadata(pages);

    return { metadata, pages };
}

/**
 * pdf-parse용 커스텀 페이지 렌더러
 * 각 페이지 텍스트 사이에 구분자 삽입
 */
function renderPage(pageData) {
    return pageData.getTextContent().then(textContent => {
        let lastY = null;
        let text = '';

        for (const item of textContent.items) {
            if (lastY !== null && Math.abs(lastY - item.transform[5]) > 5) {
                text += '\n';
            }
            text += item.str;
            lastY = item.transform[5];
        }

        return text + '\n<<<PAGE_BREAK>>>';
    });
}

/**
 * 문서 메타데이터 추출
 * 첫 몇 페이지에서 문서명, 기준일, U/W기준일 등을 추출
 */
function extractDocumentMetadata(pages) {
    const headerText = pages.slice(0, 3).map(p => p.text).join('\n');

    const metadata = {
        title: null,
        yearMonth: null,
        baseDate: null,
        uwBaseDate: null,
        productCategory: null,
        notes: []
    };

    // 문서 제목 추출 (첫 줄 또는 큰 텍스트)
    const titleMatch = headerText.match(/^(.+(?:비교|비교표|비교자료).*?)$/m);
    if (titleMatch) metadata.title = titleMatch[1].trim();

    // 기준 월차 추출 (2026년 3월, 2026.03 등)
    const monthMatch = headerText.match(/(\d{4})[년.\-\/]?\s*(\d{1,2})[월]?/);
    if (monthMatch) {
        metadata.yearMonth = `${monthMatch[1]}-${monthMatch[2].padStart(2, '0')}`;
    }

    // 작성기준일
    const baseDateMatch = headerText.match(/(?:작성|기준|적용)\s*(?:기준)?일?\s*[:\s]*(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/);
    if (baseDateMatch) {
        metadata.baseDate = `${baseDateMatch[1]}-${baseDateMatch[2].padStart(2, '0')}-${baseDateMatch[3].padStart(2, '0')}`;
    }

    // U/W 기준일
    const uwMatch = headerText.match(/[UuＵ]\s*\/?\s*[WwＷ]\s*(?:기준일?)?\s*[:\s]*(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/);
    if (uwMatch) {
        metadata.uwBaseDate = `${uwMatch[1]}-${uwMatch[2].padStart(2, '0')}-${uwMatch[3].padStart(2, '0')}`;
    }

    // 상품군 추출
    const categoryPatterns = [
        { pattern: /장기\s*종합\s*보험/, category: '장기종합보험' },
        { pattern: /종신\s*보험/, category: '종신보험' },
        { pattern: /연금\s*보험/, category: '연금보험' },
        { pattern: /자동차\s*보험/, category: '자동차보험' },
        { pattern: /실손\s*보험/, category: '실손보험' },
    ];
    for (const { pattern, category } of categoryPatterns) {
        if (pattern.test(headerText)) {
            metadata.productCategory = category;
            break;
        }
    }

    // 유의사항 추출
    const notesMatches = headerText.matchAll(/(?:유의|주의|참고)\s*(?:사항)?[:\s]*(.+)/g);
    for (const match of notesMatches) {
        metadata.notes.push(match[1].trim());
    }

    return metadata;
}

/**
 * 페이지 텍스트에서 섹션을 분리
 * 보험 비교 PDF의 일반적인 섹션 구조를 기준으로 분리
 * @param {Array} pages - parsePDF 결과의 pages 배열
 * @returns {Array<{sectionName: string, pageNum: number, content: string}>}
 */
export function extractSections(pages) {
    const sections = [];

    // 섹션 시작 패턴들
    const sectionPatterns = [
        /^[IVX\d]+[\.\)]\s*(.+(?:진단비|치료비|수술비|입원비|통원비|보험료|납입면제|가입나이|환급률).*)/m,
        /^(?:■|▶|●|◆|【|〔|\[)\s*(.+)/m,
        /^(\d+\.\s*.+(?:비교|현황|분석))/m,
    ];

    for (const page of pages) {
        for (const pattern of sectionPatterns) {
            const matches = page.text.matchAll(new RegExp(pattern.source, 'gm'));
            for (const match of matches) {
                sections.push({
                    sectionName: match[1].trim(),
                    pageNum: page.pageNum,
                    content: extractSectionContent(page.text, match.index)
                });
            }
        }
    }

    return sections;
}

/**
 * 섹션 시작점부터 다음 섹션까지의 내용 추출
 */
function extractSectionContent(fullText, startIdx) {
    const remaining = fullText.substring(startIdx);
    // 다음 섹션 시작점 찾기 (같은 패턴)
    const nextSection = remaining.substring(1).search(/^[IVX\d]+[\.\)]\s|^(?:■|▶|●|◆|【|〔|\[)/m);
    if (nextSection > 0) {
        return remaining.substring(0, nextSection + 1).trim();
    }
    return remaining.trim();
}
