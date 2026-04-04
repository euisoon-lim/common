/**
 * 답변 포맷터 - 비교 결과를 구조화된 답변으로 변환
 *
 * 출력 포맷:
 * 1. 질문 해석 결과
 * 2. 한줄 결론
 * 3. 비교표 (HTML)
 * 4. 추천 포인트 / 차이점
 * 5. 주의사항
 * 6. 출처 페이지
 */

/**
 * 비교 결과를 프론트엔드용 응답 객체로 변환
 * @param {Object} compareResult - searchAndCompare 결과
 * @returns {Object} 프론트엔드 렌더링용 응답
 */
export function formatResponse(compareResult) {
    if (!compareResult.success) {
        return formatErrorResponse(compareResult);
    }

    const { conditions, data, analysis, yearMonth, sources } = compareResult;

    return {
        success: true,

        // 1. 질문 해석 결과
        interpretation: formatInterpretation(conditions),

        // 2. 한줄 결론
        conclusion: formatConclusion(analysis),

        // 3. 비교표 (섹션별)
        tables: formatComparisonTables(data),

        // 4. 추천 포인트 / 차이점
        highlights: formatHighlights(analysis),

        // 5. 주의사항
        warnings: analysis.warnings || [],

        // 6. 출처
        sources: {
            yearMonth,
            pages: sources,
            note: `${yearMonth} 기준 데이터입니다. 실제 가입 시 조건이 다를 수 있습니다.`
        },

        // 메타
        meta: {
            totalRows: compareResult.totalRows,
            confidence: conditions.confidence,
            timestamp: new Date().toISOString()
        }
    };
}

/**
 * 질문 해석 결과 포맷
 */
function formatInterpretation(conditions) {
    const parts = [];

    if (conditions.productCategory) parts.push(`상품군: ${conditions.productCategory}`);
    if (conditions.gender) parts.push(`성별: ${conditions.gender === '남' ? '남성' : '여성'}`);
    if (conditions.age) parts.push(`나이: ${conditions.age}세`);
    if (conditions.insuranceType) parts.push(`보험형태: ${conditions.insuranceType}`);
    if (conditions.paymentPeriod) parts.push(`납입기간: ${conditions.paymentPeriod}`);
    if (conditions.coveragePeriod) parts.push(`보장기간: ${conditions.coveragePeriod}`);
    if (conditions.insurers.length > 0) parts.push(`보험사: ${conditions.insurers.join(', ')}`);
    if (conditions.sections.length > 0) parts.push(`비교항목: ${conditions.sections.join(', ')}`);

    return {
        summary: parts.join(' / '),
        details: parts,
        missing: conditions.missing
    };
}

/**
 * 한줄 결론 생성
 */
function formatConclusion(analysis) {
    if (analysis.recommendations.length > 0) {
        return analysis.recommendations[0];
    }
    if (analysis.summary.length > 0) {
        return analysis.summary[0];
    }
    return '조건에 맞는 데이터를 찾았습니다. 아래 비교표를 확인하세요.';
}

/**
 * 섹션별 비교표 데이터 생성
 * 프론트엔드에서 HTML 테이블로 렌더링
 */
function formatComparisonTables(data) {
    const tables = [];

    for (const [sectionName, insurerData] of Object.entries(data)) {
        const insurers = Object.keys(insurerData);
        if (insurers.length === 0) continue;

        // 모든 항목명 수집 (순서 유지)
        const allItemNames = [];
        for (const insData of Object.values(insurerData)) {
            for (const item of insData.items) {
                if (!allItemNames.includes(item.itemName)) {
                    allItemNames.push(item.itemName);
                }
            }
        }

        // 테이블 데이터 구성
        const rows = allItemNames.map(itemName => {
            const row = { itemName };
            for (const insurer of insurers) {
                const item = insurerData[insurer].items.find(i => i.itemName === itemName);
                row[insurer] = item ? item.value : '-';
            }
            return row;
        });

        // 상품명 행 추가 (맨 위)
        const productRow = { itemName: '상품명' };
        for (const insurer of insurers) {
            productRow[insurer] = insurerData[insurer].productName || '-';
        }

        tables.push({
            sectionName,
            insurers,
            productRow,
            rows,
            // 프론트에서 하이라이트할 셀 정보
            highlights: findCellHighlights(sectionName, rows, insurers)
        });
    }

    return tables;
}

/**
 * 셀 하이라이트 정보 생성 (최고/최저 값 표시)
 */
function findCellHighlights(sectionName, rows, insurers) {
    const highlights = {};

    for (const row of rows) {
        const numericValues = {};
        for (const insurer of insurers) {
            const val = parseFloat(String(row[insurer]).replace(/[,\s원만%]/g, ''));
            if (!isNaN(val)) numericValues[insurer] = val;
        }

        const entries = Object.entries(numericValues);
        if (entries.length < 2) continue;

        // 보험료: 낮을수록 좋음 (green) / 높으면 주의 (orange)
        if (/보험료/.test(sectionName)) {
            const sorted = entries.sort((a, b) => a[1] - b[1]);
            highlights[`${row.itemName}_${sorted[0][0]}`] = 'best';
            highlights[`${row.itemName}_${sorted[sorted.length - 1][0]}`] = 'worst';
        }
        // 진단비/치료비: 높을수록 좋음
        else if (/진단비|치료비|수술비/.test(sectionName) || /진단비|치료비|수술비/.test(row.itemName)) {
            const sorted = entries.sort((a, b) => b[1] - a[1]);
            highlights[`${row.itemName}_${sorted[0][0]}`] = 'best';
        }
    }

    // O/X 비교: O가 좋음
    for (const row of rows) {
        for (const insurer of insurers) {
            if (row[insurer] === 'O' || row[insurer] === '○') {
                highlights[`${row.itemName}_${insurer}`] = 'best';
            } else if (row[insurer] === 'X' || row[insurer] === '×') {
                highlights[`${row.itemName}_${insurer}`] = 'worst';
            }
        }
    }

    return highlights;
}

/**
 * 추천 포인트 / 차이점 포맷
 */
function formatHighlights(analysis) {
    const highlights = [];

    // 섹션별 핵심 차이점
    for (const [section, sectionAnalysis] of Object.entries(analysis.sections)) {
        if (sectionAnalysis.differences.length > 0) {
            highlights.push({
                section,
                type: 'difference',
                items: sectionAnalysis.differences
            });
        }
        if (sectionAnalysis.best) {
            highlights.push({
                section,
                type: 'best',
                insurer: sectionAnalysis.best.insurer,
                reason: sectionAnalysis.best.reason
            });
        }
    }

    // 종합 추천
    for (const rec of analysis.recommendations) {
        highlights.push({ type: 'recommendation', text: rec });
    }

    return highlights;
}

/**
 * 에러/부족 조건 응답
 */
function formatErrorResponse(compareResult) {
    const response = {
        success: false,
        error: compareResult.error,
        interpretation: null,
        conclusion: null,
        tables: [],
        highlights: [],
        warnings: [],
        sources: null,
        meta: { timestamp: new Date().toISOString() }
    };

    // 조건이 있지만 결과가 없는 경우 → 조건 해석 결과는 보여줌
    if (compareResult.conditions) {
        response.interpretation = formatInterpretation(compareResult.conditions);

        // 누락 조건이 있으면 안내
        if (compareResult.conditions.missing.length > 0) {
            response.suggestion = `다음 조건을 추가해 주세요: ${compareResult.conditions.missing.join(', ')}`;
        }
    }

    return response;
}

/**
 * 누락 조건 안내 메시지 생성
 */
export function formatMissingConditionsMessage(conditions) {
    if (conditions.missing.length === 0) return null;

    const suggestions = [];
    for (const field of conditions.missing) {
        if (field.includes('상품군')) {
            suggestions.push('어떤 보험을 비교하시나요? (예: 암보험, 종신보험)');
        }
        if (field.includes('성별')) {
            suggestions.push('피보험자 성별을 알려주세요 (남/여)');
        }
        if (field.includes('나이')) {
            suggestions.push('피보험자 나이를 알려주세요 (예: 40세)');
        }
    }

    return {
        type: 'clarification',
        message: '더 정확한 비교를 위해 추가 정보가 필요합니다.',
        suggestions,
        // 빠른 선택 칩
        chips: generateQuickChips(conditions)
    };
}

/**
 * 빠른 선택 칩 생성
 */
function generateQuickChips(conditions) {
    const chips = [];

    if (!conditions.gender) {
        chips.push({ label: '남성', field: 'gender', value: '남' });
        chips.push({ label: '여성', field: 'gender', value: '여' });
    }

    if (!conditions.age) {
        chips.push({ label: '30세', field: 'age', value: 30 });
        chips.push({ label: '40세', field: 'age', value: 40 });
        chips.push({ label: '50세', field: 'age', value: 50 });
    }

    if (!conditions.insuranceType) {
        chips.push({ label: '일반형', field: 'insuranceType', value: '일반형' });
        chips.push({ label: '무해약형', field: 'insuranceType', value: '무해약형' });
    }

    return chips;
}
