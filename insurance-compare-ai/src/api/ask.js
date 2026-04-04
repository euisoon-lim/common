/**
 * /api/ask - 질문 처리 메인 엔드포인트
 *
 * Supabase Edge Function으로 배포하거나,
 * 프론트엔드에서 직접 Supabase JS SDK로 호출 가능
 *
 * 이 파일은 Edge Function용 구조이지만,
 * MVP에서는 프론트엔드에서 Supabase SDK로 직접 쿼리하는 방식도 지원
 */

import { createClient } from '@supabase/supabase-js';
import { parseQuestion, enhanceWithLLM } from './question-parser.js';
import { searchAndCompare } from './comparison-engine.js';
import { formatResponse, formatMissingConditionsMessage } from './response-formatter.js';

/**
 * Edge Function 핸들러
 */
export async function handleAsk(req) {
    const startTime = Date.now();

    try {
        const { question, filters } = await req.json();

        if (!question || question.trim().length < 2) {
            return jsonResponse(400, { error: '질문을 입력해주세요.' });
        }

        // 1. 질문 파싱
        let conditions = parseQuestion(question);

        // 필터 칩에서 선택한 조건 병합
        if (filters) {
            if (filters.gender) conditions.gender = filters.gender;
            if (filters.age) conditions.age = filters.age;
            if (filters.insuranceType) conditions.insuranceType = filters.insuranceType;
            if (filters.insurers) conditions.insurers = filters.insurers;
        }

        // 2. 신뢰도 낮으면 LLM 보정
        const apiKey = Deno?.env?.get?.('ANTHROPIC_API_KEY') || process.env.ANTHROPIC_API_KEY;
        if (conditions.confidence < 0.6 && apiKey) {
            conditions = await enhanceWithLLM(question, conditions, apiKey);
        }

        // 3. 필수 조건 부족 시 추가 정보 요청
        if (!conditions.productCategory) {
            const clarification = formatMissingConditionsMessage(conditions);
            return jsonResponse(200, {
                type: 'clarification',
                interpretation: {
                    summary: '질문을 이해했지만, 추가 정보가 필요합니다.',
                    details: [],
                    missing: conditions.missing
                },
                ...clarification
            });
        }

        // 4. DB 검색 & 비교
        const supabase = createClient(
            Deno?.env?.get?.('SUPABASE_URL') || process.env.SUPABASE_URL,
            Deno?.env?.get?.('SUPABASE_ANON_KEY') || process.env.SUPABASE_ANON_KEY
        );

        const compareResult = await searchAndCompare(supabase, conditions);

        // 5. 응답 포맷팅
        const response = formatResponse(compareResult);

        // 6. 질의 로그 저장 (비동기, 실패해도 무시)
        logQuery(supabase, {
            rawQuestion: question,
            parsedConditions: conditions,
            resultCount: compareResult.totalRows || 0,
            responseTimeMs: Date.now() - startTime
        }).catch(() => {});

        return jsonResponse(200, response);

    } catch (error) {
        console.error('질문 처리 오류:', error);
        return jsonResponse(500, { error: '처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
    }
}

/**
 * 프론트엔드에서 직접 사용할 수 있는 클라이언트 사이드 버전
 * (Supabase SDK 직접 호출)
 */
export async function askQuestion(supabase, question, filters = {}) {
    const startTime = Date.now();

    // 1. 질문 파싱
    let conditions = parseQuestion(question);

    // 필터 병합
    if (filters.gender) conditions.gender = filters.gender;
    if (filters.age) conditions.age = filters.age;
    if (filters.insuranceType) conditions.insuranceType = filters.insuranceType;
    if (filters.insurers) conditions.insurers = filters.insurers;

    // 2. 필수 조건 부족 시
    if (!conditions.productCategory) {
        return {
            type: 'clarification',
            ...formatMissingConditionsMessage(conditions)
        };
    }

    // 3. 검색 & 비교
    const compareResult = await searchAndCompare(supabase, conditions);

    // 4. 포맷팅
    const response = formatResponse(compareResult);
    response.meta.responseTimeMs = Date.now() - startTime;

    return response;
}

/**
 * 질의 로그 저장
 */
async function logQuery(supabase, logData) {
    await supabase.from('query_logs').insert({
        raw_question: logData.rawQuestion,
        parsed_conditions: logData.parsedConditions,
        result_count: logData.resultCount,
        response_time_ms: logData.responseTimeMs,
        session_id: logData.sessionId || null
    });
}

function jsonResponse(status, body) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}
