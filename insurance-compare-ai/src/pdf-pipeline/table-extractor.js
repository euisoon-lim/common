/**
 * 표 구조 추출기 - PDF 텍스트에서 표 데이터를 구조화
 *
 * 보험 비교 PDF의 표 형태:
 * - 헤더행: 보험사명이 열 제목
 * - 데이터행: 각 비교항목의 값
 * - 공통 조건: 성별, 나이, 보험형태 등
 */

/**
 * 텍스트 블록에서 표 데이터 추출
 * @param {string} text - 섹션 텍스트
 * @param {Object} context - 문맥 정보 {sectionName, pageNum, yearMonth}
 * @returns {Array<Object>} 구조화된 행 데이터
 */
export function extractTable(text, context) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return [];

    // 1단계: 표 조건 추출 (표 상단의 조건 텍스트)
    const conditions = extractConditions(text);

    // 2단계: 헤더행 찾기 (보험사명이 포함된 행)
    const headerInfo = findHeaderRow(lines);
    if (!headerInfo) {
        // 표 형태가 아닌 경우 키-값 쌍으로 시도
        return extractKeyValuePairs(lines, context, conditions);
    }

    // 3단계: 데이터행 파싱
    const rows = parseDataRows(lines, headerInfo);

    // 4단계: 구조화된 comparison_row 객체 생성
    return rows.map((row, idx) => ({
        product_category: context.productCategory || '장기종합보험',
        section_name: context.sectionName,
        insurer: row.insurer,
        product_name: row.productName || null,
        gender: conditions.gender || null,
        age: conditions.age || null,
        insurance_type: conditions.insuranceType || null,
        payment_period: conditions.paymentPeriod || null,
        coverage_period: conditions.coveragePeriod || null,
        item_name: row.itemName,
        item_value: row.value,
        item_value_numeric: parseNumericValue(row.value),
        item_unit: guessUnit(row.value, context.sectionName),
        page_number: context.pageNum,
        row_order: idx + 1,
        year_month: context.yearMonth,
        footnote: row.footnote || null
    }));
}

/**
 * 표 상단 조건 텍스트에서 조건 추출
 * 예: "40세 남성 / 20년납 / 100세만기 / 일반형"
 */
function extractConditions(text) {
    const conditions = {
        gender: null,
        age: null,
        insuranceType: null,
        paymentPeriod: null,
        coveragePeriod: null
    };

    // 성별
    if (/남성|남자/.test(text)) conditions.gender = '남';
    else if (/여성|여자/.test(text)) conditions.gender = '여';

    // 나이
    const ageMatch = text.match(/(\d{1,3})\s*세/);
    if (ageMatch) conditions.age = parseInt(ageMatch[1]);

    // 납입기간
    const paymentMatch = text.match(/(\d+)\s*년\s*납|전기납/);
    if (paymentMatch) {
        conditions.paymentPeriod = paymentMatch[0].replace(/\s/g, '');
    }

    // 보장기간
    const coverageMatch = text.match(/(\d+)\s*세\s*만기|종신/);
    if (coverageMatch) {
        conditions.coveragePeriod = coverageMatch[0].replace(/\s/g, '');
    }

    // 보험형태
    const typePatterns = [
        { pattern: /무해약\s*환급?형/, type: '무해약형' },
        { pattern: /건강\s*고지/, type: '건강고지' },
        { pattern: /간편\s*가입/, type: '간편가입' },
        { pattern: /일반형/, type: '일반형' },
        { pattern: /표준형/, type: '표준형' },
    ];
    for (const { pattern, type } of typePatterns) {
        if (pattern.test(text)) {
            conditions.insuranceType = type;
            break;
        }
    }

    return conditions;
}

/**
 * 보험사명이 포함된 헤더행 찾기
 */
const KNOWN_INSURERS = [
    '삼성화재', 'DB손해보험', 'KB손해보험', '현대해상', '메리츠화재',
    '한화손해보험', '롯데손해보험', '흥국화재', 'MG손해보험',
    '삼성생명', '한화생명', '교보생명', '신한라이프', 'NH농협생명',
    '삼성', 'DB', 'KB', '현대', '메리츠', '한화', '롯데', '흥국',
    '교보', '신한', '농협'
];

function findHeaderRow(lines) {
    for (let i = 0; i < Math.min(lines.length, 10); i++) {
        const line = lines[i];
        const foundInsurers = KNOWN_INSURERS.filter(ins => line.includes(ins));
        if (foundInsurers.length >= 2) {
            // 탭/공백/| 기준으로 컬럼 분리
            const columns = splitColumns(line);
            return {
                lineIndex: i,
                insurers: foundInsurers,
                columns: columns
            };
        }
    }
    return null;
}

/**
 * 열 분리 (탭, 연속 공백, | 등)
 */
function splitColumns(line) {
    // 탭 구분
    if (line.includes('\t')) return line.split('\t').map(s => s.trim()).filter(Boolean);
    // | 구분
    if (line.includes('|')) return line.split('|').map(s => s.trim()).filter(Boolean);
    // 연속 공백(2개 이상) 구분
    return line.split(/\s{2,}/).map(s => s.trim()).filter(Boolean);
}

/**
 * 데이터행 파싱
 */
function parseDataRows(lines, headerInfo) {
    const results = [];
    const { lineIndex, columns } = headerInfo;

    for (let i = lineIndex + 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        const cells = splitColumns(line);
        if (cells.length < 2) continue;

        // 첫 번째 셀은 항목명, 나머지는 보험사별 값
        const itemName = cells[0];

        // 각 보험사 컬럼에 값 매핑
        for (let j = 1; j < cells.length && j < columns.length; j++) {
            const insurer = columns[j];
            if (KNOWN_INSURERS.some(ins => insurer.includes(ins))) {
                results.push({
                    insurer: normalizeInsurerName(insurer),
                    itemName: itemName,
                    value: cells[j] || '-',
                    productName: null,
                    footnote: null
                });
            }
        }
    }

    return results;
}

/**
 * 표 형태가 아닌 경우 키-값 쌍 추출
 */
function extractKeyValuePairs(lines, context, conditions) {
    const results = [];

    for (const line of lines) {
        // "보험사: 값" 또는 "보험사 - 값" 형태
        for (const insurer of KNOWN_INSURERS) {
            const pattern = new RegExp(`${insurer}\\s*[:\\-–]\\s*(.+)`);
            const match = line.match(pattern);
            if (match) {
                results.push({
                    product_category: context.productCategory || '장기종합보험',
                    section_name: context.sectionName,
                    insurer: normalizeInsurerName(insurer),
                    gender: conditions.gender,
                    age: conditions.age,
                    insurance_type: conditions.insuranceType,
                    payment_period: conditions.paymentPeriod,
                    coverage_period: conditions.coveragePeriod,
                    item_name: context.sectionName,
                    item_value: match[1].trim(),
                    item_value_numeric: parseNumericValue(match[1].trim()),
                    item_unit: guessUnit(match[1].trim(), context.sectionName),
                    page_number: context.pageNum,
                    row_order: results.length + 1,
                    year_month: context.yearMonth
                });
            }
        }
    }

    return results;
}

/**
 * 보험사명 정규화
 */
function normalizeInsurerName(name) {
    const map = {
        '삼성': '삼성화재', '삼화': '삼성화재',
        'DB': 'DB손해보험', 'DB손보': 'DB손해보험', '동부': 'DB손해보험',
        'KB': 'KB손해보험', 'KB손보': 'KB손해보험',
        '현대': '현대해상', '현해': '현대해상',
        '메리츠': '메리츠화재', '메리츠손보': '메리츠화재',
        '한화': '한화손해보험', '한화손보': '한화손해보험',
        '롯데': '롯데손해보험', '롯데손보': '롯데손해보험',
        '흥국': '흥국화재',
        '삼생': '삼성생명',
        '한생': '한화생명',
        '교보': '교보생명',
        '신한': '신한라이프', '신한생명': '신한라이프',
        '농협': 'NH농협생명', '농협생명': 'NH농협생명',
    };
    const trimmed = name.trim();
    return map[trimmed] || trimmed;
}

/**
 * 텍스트 값에서 숫자 추출
 * "3,000만원" → 3000, "45,200원" → 45200, "O" → 1, "X" → 0
 */
function parseNumericValue(value) {
    if (!value || value === '-') return null;
    if (value === 'O' || value === '○') return 1;
    if (value === 'X' || value === '×' || value === '✕') return 0;

    // 숫자+단위 형태에서 숫자만 추출
    const numStr = value.replace(/[,\s]/g, '');
    const numMatch = numStr.match(/([\d.]+)/);
    if (numMatch) return parseFloat(numMatch[1]);

    return null;
}

/**
 * 값과 섹션명으로 단위 추측
 */
function guessUnit(value, sectionName) {
    if (!value) return null;
    if (/만\s*원/.test(value)) return '만원';
    if (/원/.test(value) && !/만/.test(value)) return '원';
    if (/%/.test(value)) return '%';
    if (/세/.test(value)) return '세';
    if (/[OX○×✕]/.test(value)) return '';

    // 섹션명 기반 추측
    if (/보험료/.test(sectionName)) return '원';
    if (/진단비|치료비|수술비/.test(sectionName)) return '만원';
    if (/나이|연령/.test(sectionName)) return '세';

    return null;
}

export { normalizeInsurerName, parseNumericValue, KNOWN_INSURERS };
