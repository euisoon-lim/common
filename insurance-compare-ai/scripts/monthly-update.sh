#!/bin/bash
# ============================================================
# 보험상품 비교 AI - 월별 PDF 갱신 스크립트
#
# 사용법:
#   ./monthly-update.sh <PDF_FILE_PATH> [PRODUCT_CATEGORY]
#
# 예시:
#   ./monthly-update.sh ./장기종합보험_비교_2026년04월.pdf 장기종합보험
#
# 환경변수 필요:
#   SUPABASE_URL
#   SUPABASE_SERVICE_KEY
# ============================================================

set -euo pipefail

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 인자 검사
if [ $# -lt 1 ]; then
    echo "사용법: $0 <PDF_FILE_PATH> [PRODUCT_CATEGORY]"
    echo ""
    echo "예시:"
    echo "  $0 ./장기종합보험_비교_2026년04월.pdf"
    echo "  $0 ./종신보험_비교_2026년04월.pdf 종신보험"
    exit 1
fi

PDF_FILE="$1"
CATEGORY="${2:-장기종합보험}"

# 파일 존재 확인
if [ ! -f "$PDF_FILE" ]; then
    log_error "파일을 찾을 수 없습니다: $PDF_FILE"
    exit 1
fi

# 환경변수 확인
if [ -z "${SUPABASE_URL:-}" ] || [ -z "${SUPABASE_SERVICE_KEY:-}" ]; then
    log_error "SUPABASE_URL, SUPABASE_SERVICE_KEY 환경변수를 설정하세요."
    echo ""
    echo "export SUPABASE_URL='https://your-project.supabase.co'"
    echo "export SUPABASE_SERVICE_KEY='your-service-role-key'"
    exit 1
fi

FILE_NAME=$(basename "$PDF_FILE")
log_info "PDF 갱신 시작: $FILE_NAME (상품군: $CATEGORY)"

# Node.js 스크립트 경로
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Node.js 실행
log_info "파이프라인 실행 중..."
node --experimental-modules "$PROJECT_DIR/src/pdf-pipeline/run-pipeline.js" "$PDF_FILE" "$CATEGORY"

RESULT=$?
if [ $RESULT -eq 0 ]; then
    log_info "갱신 완료!"
    log_info ""
    log_info "확인 방법:"
    log_info "  1. Supabase 대시보드에서 comparison_rows 테이블 확인"
    log_info "  2. documents 테이블에서 최신 문서 상태 확인"
    log_info "  3. 프론트엔드에서 질문 테스트"
else
    log_error "파이프라인 실행 실패 (exit code: $RESULT)"
    exit $RESULT
fi
