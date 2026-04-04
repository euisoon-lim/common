/**
 * DB 업로더 - 정규화된 데이터를 Supabase에 삽입
 *
 * 환경변수:
 *   SUPABASE_URL - Supabase 프로젝트 URL
 *   SUPABASE_SERVICE_KEY - service_role 키 (쓰기 권한)
 */

import { createClient } from '@supabase/supabase-js';

/**
 * Supabase 클라이언트 생성 (service_role 키 사용)
 */
function getSupabaseAdmin() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) throw new Error('SUPABASE_URL, SUPABASE_SERVICE_KEY 환경변수 필요');
    return createClient(url, key);
}

/**
 * 문서 메타데이터 upsert
 * @returns {string} document ID
 */
export async function upsertDocument(metadata) {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
        .from('documents')
        .upsert({
            file_name: metadata.title || '미확인 문서',
            product_category: metadata.productCategory,
            year_month: metadata.yearMonth,
            base_date: metadata.baseDate,
            uw_base_date: metadata.uwBaseDate,
            total_pages: metadata.totalPages,
            notes: metadata.notes?.join('; ') || null,
            status: 'active',
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'product_category,year_month'
        })
        .select('id')
        .single();

    if (error) throw new Error(`문서 upsert 실패: ${error.message}`);
    return data.id;
}

/**
 * 기존 월차 데이터 삭제 후 새 데이터 삽입
 * (월별 전체 교체 방식 - 부분 업데이트보다 안전)
 */
export async function replaceComparisonData(documentId, yearMonth, productCategory, rows) {
    const supabase = getSupabaseAdmin();

    // 1. 기존 데이터 삭제
    const { error: deleteError } = await supabase
        .from('comparison_rows')
        .delete()
        .eq('year_month', yearMonth)
        .eq('product_category', productCategory);

    if (deleteError) throw new Error(`기존 데이터 삭제 실패: ${deleteError.message}`);

    // 2. document_id 연결
    const rowsWithDocId = rows.map(row => ({
        ...row,
        document_id: documentId
    }));

    // 3. 배치 삽입 (500건씩)
    const BATCH_SIZE = 500;
    let insertedCount = 0;

    for (let i = 0; i < rowsWithDocId.length; i += BATCH_SIZE) {
        const batch = rowsWithDocId.slice(i, i + BATCH_SIZE);
        const { error: insertError } = await supabase
            .from('comparison_rows')
            .insert(batch);

        if (insertError) {
            throw new Error(`데이터 삽입 실패 (batch ${Math.floor(i / BATCH_SIZE)}): ${insertError.message}`);
        }
        insertedCount += batch.length;
    }

    // 4. 이전 월차 데이터 archived 처리
    await supabase
        .from('documents')
        .update({ status: 'archived' })
        .eq('product_category', productCategory)
        .neq('year_month', yearMonth)
        .eq('status', 'active');

    return { insertedCount, documentId };
}

/**
 * PDF 파일을 Supabase Storage에 업로드
 */
export async function uploadPDFToStorage(pdfBuffer, fileName) {
    const supabase = getSupabaseAdmin();

    const storagePath = `pdfs/${fileName}`;
    const { error } = await supabase.storage
        .from('insurance-docs')
        .upload(storagePath, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: true
        });

    if (error) throw new Error(`Storage 업로드 실패: ${error.message}`);
    return storagePath;
}

/**
 * 전체 파이프라인 실행
 * PDF 버퍼 → 파싱 → 추출 → 정규화 → DB 삽입
 */
export async function runPipeline(pdfBuffer, fileName) {
    const { parsePDF, extractSections } = await import('./parser.js');
    const { extractTable } = await import('./table-extractor.js');
    const { normalizeRows } = await import('./normalizer.js');

    console.log(`[파이프라인] 시작: ${fileName}`);

    // 1. PDF 파싱
    console.log('[1/5] PDF 파싱...');
    const { metadata, pages } = await parsePDF(pdfBuffer);
    console.log(`  - ${pages.length}페이지, 메타: ${JSON.stringify(metadata)}`);

    // 2. Storage 업로드
    console.log('[2/5] Storage 업로드...');
    const storagePath = await uploadPDFToStorage(pdfBuffer, fileName);

    // 3. 섹션 추출 & 표 구조화
    console.log('[3/5] 섹션/표 추출...');
    const sections = extractSections(pages);
    let allRows = [];
    for (const section of sections) {
        const tableRows = extractTable(section.content, {
            sectionName: section.sectionName,
            pageNum: section.pageNum,
            yearMonth: metadata.yearMonth,
            productCategory: metadata.productCategory
        });
        allRows.push(...tableRows);
    }
    console.log(`  - ${sections.length}개 섹션, ${allRows.length}개 행 추출`);

    // 4. 정규화
    console.log('[4/5] 데이터 정규화...');
    const normalizedRows = normalizeRows(allRows, metadata);
    console.log(`  - ${normalizedRows.length}개 행 정규화 완료`);

    // 5. DB 삽입
    console.log('[5/5] DB 삽입...');
    metadata.totalPages = pages.length;
    const docId = await upsertDocument({ ...metadata, storagePath });
    const result = await replaceComparisonData(
        docId,
        metadata.yearMonth,
        metadata.productCategory,
        normalizedRows
    );

    console.log(`[파이프라인] 완료: ${result.insertedCount}건 삽입`);
    return result;
}
