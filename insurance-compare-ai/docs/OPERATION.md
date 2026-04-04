# 보험상품 비교 AI - 운영 가이드

## 1. 초기 설정

### 1-1. Supabase 프로젝트 생성
1. https://supabase.com 에서 새 프로젝트 생성
2. Settings > API 에서 다음 값 확인:
   - `Project URL` (SUPABASE_URL)
   - `anon public` 키 (SUPABASE_ANON_KEY)
   - `service_role` 키 (SUPABASE_SERVICE_KEY) - **절대 프론트엔드에 노출하지 마세요**

### 1-2. 데이터베이스 초기화
```sql
-- Supabase SQL Editor에서 순서대로 실행
-- 1. 스키마 생성
-- supabase/schema.sql 내용 붙여넣기

-- 2. 샘플 데이터 (테스트용)
-- supabase/seed.sql 내용 붙여넣기
```

### 1-3. Storage 버킷 생성
1. Supabase 대시보드 > Storage
2. `insurance-docs` 버킷 생성 (Private)

### 1-4. 프론트엔드 설정
`insurance-ai-chat.html` 파일 상단의 설정값 수정:
```javascript
const IC_CONFIG = {
    SUPABASE_URL: 'https://your-project.supabase.co',
    SUPABASE_ANON_KEY: 'your-anon-key-here',
};
```

### 1-5. 아임웹 삽입
1. 아임웹 관리자 > 디자인 모드
2. 원하는 페이지에서 "위젯 추가" > "HTML"
3. `insurance-ai-chat.html` 전체 내용 붙여넣기
4. 저장 후 미리보기에서 확인

---

## 2. 월별 PDF 갱신 절차

### 방법 A: 스크립트 사용 (권장)

```bash
# 1. 환경변수 설정
export SUPABASE_URL='https://your-project.supabase.co'
export SUPABASE_SERVICE_KEY='your-service-role-key'

# 2. 갱신 실행
cd insurance-compare-ai
./scripts/monthly-update.sh ./새로운_PDF_파일.pdf 장기종합보험
```

### 방법 B: Supabase 대시보드에서 수동 입력

1. **documents 테이블 업데이트**
   - 기존 active 문서를 archived로 변경
   - 새 문서 행 삽입 (year_month, product_category 등)

2. **comparison_rows 테이블 업데이트**
   - 기존 월차 데이터 삭제 또는 유지
   - 새 월차 데이터 삽입

3. **확인**
   - 프론트엔드에서 질문 테스트
   - 데이터 월차 표시 확인

### 방법 C: CSV 임포트

1. PDF에서 Excel/CSV로 수동 변환
2. CSV 컬럼을 comparison_rows 구조에 맞춤:
```csv
product_category,section_name,insurer,product_name,gender,age,insurance_type,payment_period,coverage_period,item_name,item_value,item_value_numeric,item_unit,page_number,year_month
장기종합보험,암진단비,삼성화재,뉴 암보험,남,40,일반형,20년납,100세만기,일반암 진단비,"3,000만원",3000,만원,5,2026-04
```
3. Supabase Table Editor > Import CSV

---

## 3. 갱신 체크리스트

매월 PDF 갱신 시 확인사항:

- [ ] PDF 파일명에 월차 정보 포함 확인
- [ ] documents 테이블에 새 월차 데이터 정상 삽입 확인
- [ ] 이전 월차 documents status가 'archived'로 변경 확인
- [ ] comparison_rows에 새 데이터 삽입 확인
- [ ] 프론트엔드에서 데이터 월차 표시 최신화 확인
- [ ] 주요 질문 3개 이상 테스트
- [ ] 비교표 데이터 정확성 확인 (PDF 원본과 대조)

---

## 4. 트러블슈팅

### 데이터가 안 나올 때
1. `documents` 테이블에서 해당 상품군의 active 문서 확인
2. `comparison_rows` 테이블에서 year_month 필터로 데이터 존재 확인
3. 브라우저 콘솔(F12)에서 Supabase 요청 오류 확인
4. SUPABASE_ANON_KEY가 올바른지 확인

### 비교표가 비어있을 때
1. 검색 조건(성별, 나이, 보험형태)이 DB 데이터와 일치하는지 확인
2. gender 컬럼 값이 '남'/'여'/'공통' 중 하나인지 확인
3. age 컬럼에 해당 나이 데이터가 있는지 확인

### 프론트엔드가 안 보일 때
1. 아임웹 HTML 위젯에 코드가 정상 삽입되었는지 확인
2. Supabase URL/Key 설정 확인
3. 브라우저 콘솔에서 JS 오류 확인

---

## 5. 데이터 구조 참고

### comparison_rows 핵심 컬럼
| 컬럼 | 설명 | 예시 |
|------|------|------|
| product_category | 상품군 | 장기종합보험 |
| section_name | 비교 섹션 | 암진단비, 보험료, 납입면제 |
| insurer | 보험사 정식명 | 삼성화재, DB손해보험 |
| gender | 성별 | 남, 여, 공통 |
| age | 나이 | 40 |
| insurance_type | 보험형태 | 일반형, 무해약형 |
| item_name | 세부항목 | 일반암 진단비, 월보험료 |
| item_value | 값(텍스트) | 3,000만원, O, X |
| item_value_numeric | 값(숫자) | 3000, 1, 0 |
| page_number | PDF 페이지 | 5 |
| year_month | 기준 월차 | 2026-03 |

### 보험사 정식명 목록
- 손보: 삼성화재, DB손해보험, KB손해보험, 현대해상, 메리츠화재, 한화손해보험, 롯데손해보험, 흥국화재
- 생보: 삼성생명, 한화생명, 교보생명, 신한라이프, NH농협생명
