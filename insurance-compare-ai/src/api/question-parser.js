/**
 * 질문 해석 파서 - 자연어 질문에서 검색 조건을 추출
 *
 * 룰베이스 + LLM 혼합 방식:
 * 1차: 정규식/키워드 매칭으로 빠르게 추출
 * 2차: 추출 실패 또는 모호한 경우 Claude API로 보정
 *
 * 사용 예:
 *   parseQuestion("40세 남성 암진단비 보험사별 비교해줘")
 *   → { gender: "남", age: 40, sections: ["암진단비"], ... }
 */

/**
 * @typedef {Object} ParsedConditions
 * @property {string|null} productCategory - 상품군
 * @property {string|null} subCategory - 세부분류
 * @property {string|null} gender - 성별
 * @property {number|null} age - 나이
 * @property {string|null} insuranceType - 보험형태
 * @property {string[]} insurers - 보험사 목록
 * @property {string[]} sections - 비교항목 목록
 * @property {string|null} paymentPeriod - 납입기간
 * @property {string|null} coveragePeriod - 보장기간
 * @property {string|null} sortBy - 정렬 기준
 * @property {string[]} missing - 누락된 필수 조건
 * @property {number} confidence - 파싱 신뢰도 (0~1)
 */

/**
 * 질문 파싱 메인 함수
 * @param {string} question - 사용자 질문
 * @returns {ParsedConditions}
 */
export function parseQuestion(question) {
    const q = question.trim();

    const result = {
        productCategory: null,
        subCategory: null,
        gender: null,
        age: null,
        insuranceType: null,
        insurers: [],
        sections: [],
        paymentPeriod: null,
        coveragePeriod: null,
        sortBy: null,
        missing: [],
        confidence: 0,
        rawQuestion: q
    };

    // 1. 상품군 추출
    result.productCategory = extractProductCategory(q);

    // 2. 성별 추출
    result.gender = extractGender(q);

    // 3. 나이 추출
    result.age = extractAge(q);

    // 4. 보험형태 추출
    result.insuranceType = extractInsuranceType(q);

    // 5. 보험사 추출
    result.insurers = extractInsurers(q);

    // 6. 비교항목(섹션) 추출
    result.sections = extractSections(q);

    // 7. 납입/보장기간 추출
    result.paymentPeriod = extractPaymentPeriod(q);
    result.coveragePeriod = extractCoveragePeriod(q);

    // 8. 정렬 기준 추출
    result.sortBy = extractSortBy(q);

    // 9. 누락 조건 검사 & 기본값 보정
    applyDefaults(result);
    checkMissing(result);

    // 10. 신뢰도 계산
    result.confidence = calculateConfidence(result);

    return result;
}

// ============================================================
// 개별 추출 함수
// ============================================================

function extractProductCategory(q) {
    const patterns = [
        { re: /장기\s*종합|장종/, cat: '장기종합보험' },
        { re: /종신/, cat: '종신보험' },
        { re: /연금/, cat: '연금보험' },
        { re: /실손/, cat: '실손보험' },
        { re: /자동차/, cat: '자동차보험' },
        { re: /암\s*보험|암\s*진단|유사암|항암/, cat: '장기종합보험' }, // 암 관련 → 장기종합
        { re: /수술비|입원비|통원비/, cat: '장기종합보험' },
    ];
    for (const { re, cat } of patterns) {
        if (re.test(q)) return cat;
    }
    return null;
}

function extractGender(q) {
    if (/남성|남자|남\s*\d+\s*세/.test(q)) return '남';
    if (/여성|여자|여\s*\d+\s*세/.test(q)) return '여';
    return null;
}

function extractAge(q) {
    // "40세", "만 35세", "나이 50" 등
    const match = q.match(/(?:만\s*)?(\d{1,3})\s*세/);
    if (match) return parseInt(match[1]);
    // "나이 40", "연령 50"
    const match2 = q.match(/(?:나이|연령)\s*(\d{1,3})/);
    if (match2) return parseInt(match2[1]);
    return null;
}

function extractInsuranceType(q) {
    if (/무해약\s*환?급?형?/.test(q)) return '무해약형';
    if (/건강\s*고지/.test(q)) return '건강고지';
    if (/간편\s*가입/.test(q)) return '간편가입';
    if (/일반형/.test(q)) return '일반형';
    if (/표준형/.test(q)) return '표준형';
    return null;
}

/**
 * 보험사 추출 - 알려진 보험사명 및 약칭 매칭
 */
const INSURER_PATTERNS = [
    { re: /삼성화재|삼성\s*화재|삼화/, name: '삼성화재' },
    { re: /DB\s*손해|DB\s*손보|동부/, name: 'DB손해보험' },
    { re: /KB\s*손해|KB\s*손보/, name: 'KB손해보험' },
    { re: /현대\s*해상|현해/, name: '현대해상' },
    { re: /메리츠\s*화재|메리츠\s*손보|메리츠/, name: '메리츠화재' },
    { re: /한화\s*손해|한화\s*손보/, name: '한화손해보험' },
    { re: /롯데\s*손해|롯데\s*손보/, name: '롯데손해보험' },
    { re: /흥국\s*화재|흥국/, name: '흥국화재' },
    { re: /삼성\s*생명|삼생/, name: '삼성생명' },
    { re: /한화\s*생명|한생/, name: '한화생명' },
    { re: /교보\s*생명|교보/, name: '교보생명' },
    { re: /신한\s*라이프|신한\s*생명/, name: '신한라이프' },
    { re: /NH\s*농협|농협\s*생명/, name: 'NH농협생명' },
];

function extractInsurers(q) {
    const found = [];
    for (const { re, name } of INSURER_PATTERNS) {
        if (re.test(q)) found.push(name);
    }
    return [...new Set(found)]; // 중복 제거
}

/**
 * 비교항목(섹션) 추출
 */
const SECTION_PATTERNS = [
    { re: /암\s*진단\s*비|암\s*진단\s*금/, name: '암진단비' },
    { re: /유사암|소액암|갑상선|기타\s*피부/, name: '유사암진단비' },
    { re: /항암|항암\s*치료|방사선|표적\s*항암|면역\s*항암/, name: '항암치료비' },
    { re: /수술\s*비/, name: '수술비' },
    { re: /입원\s*비|입원\s*일당/, name: '입원비' },
    { re: /납입\s*면제|납면|P\s*면제/, name: '납입면제' },
    { re: /보험료|월\s*보험료/, name: '보험료' },
    { re: /가입\s*나이|가입\s*연령|가입\s*가능/, name: '가입나이' },
    { re: /환급\s*률|해약\s*환급/, name: '환급률' },
];

function extractSections(q) {
    const found = [];
    for (const { re, name } of SECTION_PATTERNS) {
        if (re.test(q)) found.push(name);
    }

    // 비교항목이 없으면 질문 의도로 추정
    if (found.length === 0) {
        if (/비교|어디가|어떤|추천|좋/.test(q)) {
            // 전체 비교 의도
            return [];
        }
    }

    return [...new Set(found)];
}

function extractPaymentPeriod(q) {
    const match = q.match(/(\d+)\s*년\s*납/);
    if (match) return `${match[1]}년납`;
    if (/전기납/.test(q)) return '전기납';
    return null;
}

function extractCoveragePeriod(q) {
    const match = q.match(/(\d+)\s*세\s*만기/);
    if (match) return `${match[1]}세만기`;
    if (/종신/.test(q)) return '종신';
    return null;
}

function extractSortBy(q) {
    if (/저렴|싼|낮은\s*보험료|보험료\s*낮/.test(q)) return 'premium_asc';
    if (/비싼|높은\s*보험료/.test(q)) return 'premium_desc';
    if (/많이|높은\s*보장|보장\s*높/.test(q)) return 'coverage_desc';
    if (/환급.*높|환급.*많/.test(q)) return 'refund_desc';
    return null;
}

// ============================================================
// 보정 & 검증
// ============================================================

/**
 * 기본값 적용 - 누락된 조건에 대한 합리적 기본값
 */
function applyDefaults(result) {
    // 상품군 기본값: 장기종합보험 (MVP)
    if (!result.productCategory && result.sections.length > 0) {
        result.productCategory = '장기종합보험';
    }

    // 보장기간 기본값
    if (!result.coveragePeriod && result.productCategory === '장기종합보험') {
        result.coveragePeriod = '100세만기';
    }
}

/**
 * 필수 조건 누락 검사
 */
function checkMissing(result) {
    result.missing = [];

    // 상품군은 필수
    if (!result.productCategory) {
        result.missing.push('상품군 (예: 암보험, 종신보험)');
    }

    // 비교 질문인데 성별/나이가 없으면 알림
    if (!result.gender) {
        result.missing.push('성별 (남/여)');
    }
    if (!result.age) {
        result.missing.push('나이 (예: 40세)');
    }
}

/**
 * 파싱 신뢰도 계산
 */
function calculateConfidence(result) {
    let score = 0;
    const weights = {
        productCategory: 0.25,
        gender: 0.15,
        age: 0.15,
        sections: 0.2,
        insuranceType: 0.1,
        insurers: 0.05,
        paymentPeriod: 0.05,
        coveragePeriod: 0.05,
    };

    if (result.productCategory) score += weights.productCategory;
    if (result.gender) score += weights.gender;
    if (result.age) score += weights.age;
    if (result.sections.length > 0) score += weights.sections;
    if (result.insuranceType) score += weights.insuranceType;
    if (result.insurers.length > 0) score += weights.insurers;
    if (result.paymentPeriod) score += weights.paymentPeriod;
    if (result.coveragePeriod) score += weights.coveragePeriod;

    return Math.round(score * 100) / 100;
}

/**
 * Claude API를 활용한 2차 파싱 (신뢰도가 낮을 때 사용)
 * @param {string} question - 원본 질문
 * @param {ParsedConditions} ruleBased - 1차 룰베이스 결과
 * @param {string} apiKey - Claude API 키
 * @returns {Promise<ParsedConditions>}
 */
export async function enhanceWithLLM(question, ruleBased, apiKey) {
    if (ruleBased.confidence >= 0.6) return ruleBased; // 충분히 정확하면 패스

    const systemPrompt = `당신은 보험 상품 비교 질문을 분석하는 전문가입니다.
사용자의 질문에서 다음 조건을 JSON으로 추출하세요:
- productCategory: 상품군 (장기종합보험/종신보험/연금보험/실손보험)
- gender: 성별 (남/여/null)
- age: 나이 (숫자/null)
- insuranceType: 보험형태 (일반형/무해약형/건강고지/간편가입/null)
- insurers: 보험사 배열
- sections: 비교항목 배열 (암진단비/유사암진단비/항암치료비/수술비/납입면제/보험료/가입나이)
- paymentPeriod: 납입기간 (예: 20년납/null)
- coveragePeriod: 보장기간 (예: 100세만기/null)
확실하지 않은 값은 null로 두세요. 추정하지 마세요.`;

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 500,
                system: systemPrompt,
                messages: [{ role: 'user', content: question }]
            })
        });

        const data = await response.json();
        const text = data.content?.[0]?.text || '';

        // JSON 추출
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const llmResult = JSON.parse(jsonMatch[0]);
            return mergeResults(ruleBased, llmResult);
        }
    } catch (e) {
        console.warn('LLM 보정 실패, 룰베이스 결과 사용:', e.message);
    }

    return ruleBased;
}

/**
 * 룰베이스 결과와 LLM 결과 병합 (룰베이스 우선)
 */
function mergeResults(ruleBased, llmResult) {
    const merged = { ...ruleBased };

    // LLM 결과로 누락된 필드만 보정
    if (!merged.productCategory && llmResult.productCategory) {
        merged.productCategory = llmResult.productCategory;
    }
    if (!merged.gender && llmResult.gender) {
        merged.gender = llmResult.gender;
    }
    if (!merged.age && llmResult.age) {
        merged.age = llmResult.age;
    }
    if (!merged.insuranceType && llmResult.insuranceType) {
        merged.insuranceType = llmResult.insuranceType;
    }
    if (merged.insurers.length === 0 && llmResult.insurers?.length > 0) {
        merged.insurers = llmResult.insurers;
    }
    if (merged.sections.length === 0 && llmResult.sections?.length > 0) {
        merged.sections = llmResult.sections;
    }

    // 재검증
    checkMissing(merged);
    merged.confidence = Math.min(calculateConfidence(merged) + 0.1, 1.0);

    return merged;
}

export { INSURER_PATTERNS, SECTION_PATTERNS };
