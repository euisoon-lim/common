/**
 * 비교 엔진 - 파싱된 조건으로 DB 검색 후 비교 결과 생성
 */

/**
 * Supabase에서 비교 데이터 검색
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {import('./question-parser.js').ParsedConditions} conditions
 * @returns {Promise<Object>} 비교 결과
 */
export async function searchAndCompare(supabase, conditions) {
    // 1. 최신 월차 조회
    const yearMonth = await getLatestYearMonth(supabase, conditions.productCategory);
    if (!yearMonth) {
        return {
            success: false,
            error: `"${conditions.productCategory}" 상품군의 데이터가 없습니다.`,
            data: null
        };
    }

    // 2. 조건 기반 쿼리 구성
    let query = supabase
        .from('comparison_rows')
        .select('*')
        .eq('year_month', yearMonth)
        .eq('product_category', conditions.productCategory);

    // 섹션 필터
    if (conditions.sections.length > 0) {
        query = query.in('section_name', conditions.sections);
    }

    // 보험사 필터
    if (conditions.insurers.length > 0) {
        query = query.in('insurer', conditions.insurers);
    }

    // 성별 필터
    if (conditions.gender) {
        query = query.or(`gender.eq.${conditions.gender},gender.eq.공통,gender.is.null`);
    }

    // 나이 필터
    if (conditions.age) {
        query = query.or(`age.eq.${conditions.age},age.is.null`);
    }

    // 보험형태 필터
    if (conditions.insuranceType) {
        query = query.or(`insurance_type.eq.${conditions.insuranceType},insurance_type.is.null`);
    }

    // 납입기간 필터
    if (conditions.paymentPeriod) {
        query = query.or(`payment_period.eq.${conditions.paymentPeriod},payment_period.is.null`);
    }

    // 정렬
    query = query.order('section_name').order('insurer').order('row_order');

    const { data: rows, error } = await query;

    if (error) {
        return { success: false, error: `검색 오류: ${error.message}`, data: null };
    }

    if (!rows || rows.length === 0) {
        return {
            success: false,
            error: '조건에 맞는 데이터가 없습니다. 조건을 변경해 보세요.',
            conditions,
            data: null
        };
    }

    // 3. 결과 구조화
    const structured = structureResults(rows, conditions);

    // 4. 분석 (최저/최고/순위 등)
    const analysis = analyzeResults(structured, conditions);

    return {
        success: true,
        yearMonth,
        conditions,
        data: structured,
        analysis,
        totalRows: rows.length,
        sources: extractSources(rows)
    };
}

/**
 * 최신 월차 조회
 */
async function getLatestYearMonth(supabase, category) {
    const { data } = await supabase
        .from('documents')
        .select('year_month')
        .eq('product_category', category)
        .eq('status', 'active')
        .order('year_month', { ascending: false })
        .limit(1)
        .single();

    return data?.year_month || null;
}

/**
 * 검색 결과를 섹션별 → 보험사별 구조로 변환
 *
 * 출력 구조:
 * {
 *   "암진단비": {
 *     "삼성화재": { productName: "뉴 암보험", items: [{itemName, value, numeric}...] },
 *     "DB손해보험": { ... }
 *   },
 *   "보험료": { ... }
 * }
 */
function structureResults(rows, conditions) {
    const structured = {};

    for (const row of rows) {
        const section = row.section_name;
        const insurer = row.insurer;

        if (!structured[section]) structured[section] = {};
        if (!structured[section][insurer]) {
            structured[section][insurer] = {
                productName: row.product_name,
                insuranceType: row.insurance_type,
                paymentPeriod: row.payment_period,
                coveragePeriod: row.coverage_period,
                items: []
            };
        }

        structured[section][insurer].items.push({
            itemName: row.item_name,
            value: row.item_value,
            numeric: row.item_value_numeric,
            unit: row.item_unit,
            footnote: row.footnote
        });
    }

    return structured;
}

/**
 * 결과 분석 - 최저/최고/순위/차이점
 */
function analyzeResults(structured, conditions) {
    const analysis = {
        sections: {},
        summary: [],
        recommendations: [],
        warnings: []
    };

    for (const [sectionName, insurerData] of Object.entries(structured)) {
        const sectionAnalysis = analyzeSectionResults(sectionName, insurerData);
        analysis.sections[sectionName] = sectionAnalysis;

        // 주요 발견사항을 요약에 추가
        if (sectionAnalysis.best) {
            analysis.summary.push(
                `${sectionName}: ${sectionAnalysis.best.insurer}이(가) 가장 유리 (${sectionAnalysis.best.reason})`
            );
        }
    }

    // 종합 추천 생성
    analysis.recommendations = generateRecommendations(analysis.sections, conditions);

    // 주의사항 생성
    analysis.warnings = generateWarnings(structured, conditions);

    return analysis;
}

/**
 * 섹션별 분석
 */
function analyzeSectionResults(sectionName, insurerData) {
    const result = {
        best: null,
        worst: null,
        ranking: [],
        differences: []
    };

    const entries = Object.entries(insurerData);
    if (entries.length < 2) return result;

    // 보험료 섹션: 낮을수록 좋음
    if (/보험료/.test(sectionName)) {
        const premiums = entries
            .map(([insurer, data]) => {
                const premium = data.items.find(i => /월보험료|보험료/.test(i.itemName));
                return { insurer, value: premium?.numeric || Infinity, display: premium?.value };
            })
            .filter(p => p.value !== Infinity)
            .sort((a, b) => a.value - b.value);

        if (premiums.length > 0) {
            result.best = { insurer: premiums[0].insurer, reason: `최저 보험료 ${premiums[0].display}` };
            result.worst = { insurer: premiums[premiums.length - 1].insurer, reason: `최고 보험료 ${premiums[premiums.length - 1].display}` };
            result.ranking = premiums.map((p, i) => ({ rank: i + 1, insurer: p.insurer, value: p.display }));

            if (premiums.length >= 2) {
                const diff = premiums[premiums.length - 1].value - premiums[0].value;
                result.differences.push(`보험료 차이: 최대 ${diff.toLocaleString()}원`);
            }
        }
    }
    // 진단비/치료비 등: 높을수록 좋음
    else if (/진단비|치료비|수술비/.test(sectionName)) {
        const allItems = {};
        for (const [insurer, data] of entries) {
            for (const item of data.items) {
                if (!allItems[item.itemName]) allItems[item.itemName] = [];
                allItems[item.itemName].push({ insurer, value: item.numeric, display: item.value });
            }
        }

        // 첫 번째 주요 항목 기준 순위
        const mainItemEntries = Object.entries(allItems);
        if (mainItemEntries.length > 0) {
            const [mainItemName, mainValues] = mainItemEntries[0];
            const sorted = mainValues.filter(v => v.value != null).sort((a, b) => b.value - a.value);
            if (sorted.length > 0) {
                result.best = { insurer: sorted[0].insurer, reason: `${mainItemName} ${sorted[0].display}` };
                result.ranking = sorted.map((v, i) => ({ rank: i + 1, insurer: v.insurer, value: v.display }));
            }
        }

        // 항목별 차이점
        for (const [itemName, values] of Object.entries(allItems)) {
            const uniqueValues = [...new Set(values.map(v => v.display))];
            if (uniqueValues.length > 1) {
                result.differences.push(`${itemName}: ${values.map(v => `${v.insurer} ${v.display}`).join(' / ')}`);
            }
        }
    }
    // 납입면제: O/X 비교
    else if (/납입면제/.test(sectionName)) {
        const allItems = {};
        for (const [insurer, data] of entries) {
            for (const item of data.items) {
                if (!allItems[item.itemName]) allItems[item.itemName] = [];
                allItems[item.itemName].push({ insurer, value: item.value });
            }
        }

        for (const [itemName, values] of Object.entries(allItems)) {
            const available = values.filter(v => v.value === 'O' || v.value === '○');
            const unavailable = values.filter(v => v.value === 'X' || v.value === '×');
            if (available.length > 0 && unavailable.length > 0) {
                result.differences.push(
                    `${itemName}: ${available.map(v => v.insurer).join(', ')}만 가능`
                );
            }
        }

        // 가장 많은 O를 가진 보험사
        const oCount = entries.map(([insurer, data]) => ({
            insurer,
            count: data.items.filter(i => i.value === 'O' || i.value === '○').length
        })).sort((a, b) => b.count - a.count);

        if (oCount.length > 0 && oCount[0].count > 0) {
            result.best = { insurer: oCount[0].insurer, reason: `납입면제 범위 가장 넓음` };
        }
    }

    return result;
}

/**
 * 종합 추천 생성
 */
function generateRecommendations(sectionAnalyses, conditions) {
    const recs = [];
    const bestCounts = {};

    for (const [section, analysis] of Object.entries(sectionAnalyses)) {
        if (analysis.best) {
            const ins = analysis.best.insurer;
            bestCounts[ins] = (bestCounts[ins] || 0) + 1;
        }
    }

    // 가장 많은 항목에서 1위인 보험사
    const sorted = Object.entries(bestCounts).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0) {
        recs.push(`종합적으로 ${sorted[0][0]}이(가) ${sorted[0][1]}개 항목에서 가장 유리합니다.`);
    }

    // 보험료 vs 보장 트레이드오프
    const premiumBest = sectionAnalyses['보험료']?.best?.insurer;
    const coverageBest = Object.entries(sectionAnalyses)
        .find(([k, v]) => /진단비/.test(k) && v.best)?.[1]?.best?.insurer;

    if (premiumBest && coverageBest && premiumBest !== coverageBest) {
        recs.push(`보험료는 ${premiumBest}이(가) 유리하지만, 보장은 ${coverageBest}이(가) 더 넓습니다.`);
    }

    return recs;
}

/**
 * 주의사항 생성
 */
function generateWarnings(structured, conditions) {
    const warnings = [];

    // 데이터가 적은 섹션 경고
    for (const [section, insurerData] of Object.entries(structured)) {
        const count = Object.keys(insurerData).length;
        if (count < 3) {
            warnings.push(`${section}: ${count}개 보험사 데이터만 있습니다. 전체 비교가 아닐 수 있습니다.`);
        }
    }

    // 조건이 부족한 경우
    if (conditions.missing.length > 0) {
        warnings.push(`다음 조건이 지정되지 않아 기본값 또는 전체 데이터로 검색했습니다: ${conditions.missing.join(', ')}`);
    }

    return warnings;
}

/**
 * 출처 페이지 정보 추출
 */
function extractSources(rows) {
    const pages = new Set();
    for (const row of rows) {
        if (row.page_number) pages.add(row.page_number);
    }
    return [...pages].sort((a, b) => a - b);
}

export { structureResults, analyzeResults };
