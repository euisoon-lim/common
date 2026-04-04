#!/usr/bin/env node
/**
 * PDF 파이프라인 CLI 실행기
 *
 * 사용법:
 *   node run-pipeline.js <pdf-file-path> [product-category]
 *
 * 환경변수:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { runPipeline } from './uploader.js';

async function main() {
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.error('사용법: node run-pipeline.js <pdf-file-path> [product-category]');
        process.exit(1);
    }

    const pdfPath = resolve(args[0]);
    const category = args[1] || '장기종합보험';

    console.log(`PDF 파일: ${pdfPath}`);
    console.log(`상품군: ${category}`);
    console.log('---');

    try {
        const pdfBuffer = readFileSync(pdfPath);
        const fileName = pdfPath.split('/').pop();

        const result = await runPipeline(pdfBuffer, fileName);

        console.log('---');
        console.log(`결과: ${result.insertedCount}건 삽입 완료`);
        console.log(`문서 ID: ${result.documentId}`);

    } catch (error) {
        console.error('파이프라인 실행 중 오류 발생:', error.message);
        if (error.stack) console.error(error.stack);
        process.exit(1);
    }
}

main();
