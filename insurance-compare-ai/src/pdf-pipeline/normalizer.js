/**
 * 데이터 정규화 - 추출된 raw 데이터를 DB 삽입 가능한 형태로 정규화
 */

import { normalizeInsurerName } from './table-extractor.js';

/**
 * 추출된 비교 데이터 배열을 정규화
 * @param {Array} rows - extractTable 결과
 * @param {Object} documentMeta - 문서 메타데이터
 * @returns {Array} 정규화된 comparison_rows
 */
export function normalizeRows(rows, documentMeta) {
    return rows
        .map(row => normalizeRow(row, documentMeta))
        .filter(row => row !== null); // 유효하지 않은 행 제거
}

function normalizeRow(row, meta) {
    // 필수 필드 검증
    if (!row.insurer || !row.item_name) return null;

    return {
        ...row,
        // 보험사명 정규화
        insurer: normalizeInsurerName(row.insurer),

        // 섹션명 정규화
        section_name: normalizeSectionName(row.section_name),

        // 보험형태 정규화
        insurance_type: normalizeInsuranceType(row.insurance_type),

        // 성별 정규화
        gender: normalizeGender(row.gender),

        // 값 정리
        item_value: cleanValue(row.item_value),
        item_value_numeric: row.item_value_numeric,

        // 문서 연결
        year_month: meta.yearMonth || row.year_month,
    };
}

/**
 * 섹션명 정규화 - 동의어를 통합 명칭으로 변환
 */
const SECTION_ALIASES = {
    // 암진단비 계열
    '암진단비': '암진단비',
    '암진단금': '암진단비',
    '암 진단비': '암진단비',
    '암 진단금': '암진단비',

    // 유사암 계열
    '유사암진단비': '유사암진단비',
    '유사암': '유사암진단비',
    '소액암': '유사암진단비',
    '기타피부암': '유사암진단비',
    '갑상선암': '유사암진단비',

    // 항암치료 계열
    '항암치료비': '항암치료비',
    '항암방사선': '항암치료비',
    '항암약물': '항암치료비',
    '표적항암': '항암치료비',
    '면역항암': '항암치료비',

    // 수술비 계열
    '수술비': '수술비',
    '수술급여': '수술비',
    '수술보험금': '수술비',

    // 납입면제 계열
    '납입면제': '납입면제',
    '납면': '납입면제',
    'P면제': '납입면제',

    // 보험료 계열
    '보험료': '보험료',
    '월보험료': '보험료',
    '월납보험료': '보험료',

    // 가입나이 계열
    '가입나이': '가입나이',
    '가입연령': '가입나이',
    '가입가능나이': '가입나이',
};

function normalizeSectionName(name) {
    if (!name) return name;
    const trimmed = name.trim();
    return SECTION_ALIASES[trimmed] || trimmed;
}

/**
 * 보험형태 정규화
 */
function normalizeInsuranceType(type) {
    if (!type) return null;
    const trimmed = type.trim();

    if (/무해약/.test(trimmed)) return '무해약형';
    if (/건강\s*고지/.test(trimmed)) return '건강고지';
    if (/간편/.test(trimmed)) return '간편가입';
    if (/일반/.test(trimmed)) return '일반형';
    if (/표준/.test(trimmed)) return '표준형';

    return trimmed;
}

/**
 * 성별 정규화
 */
function normalizeGender(gender) {
    if (!gender) return null;
    if (/남/.test(gender)) return '남';
    if (/여/.test(gender)) return '여';
    if (/공통|무관/.test(gender)) return '공통';
    return gender;
}

/**
 * 값 텍스트 정리
 */
function cleanValue(value) {
    if (!value) return null;
    return value
        .replace(/\s+/g, ' ')
        .replace(/，/g, ',')
        .trim();
}

export { SECTION_ALIASES, normalizeSectionName };
