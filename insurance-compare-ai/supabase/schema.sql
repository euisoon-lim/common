-- ============================================================
-- 보험상품 비교 AI 어시스턴트 - Supabase 스키마
-- MVP: 장기종합보험 (암보험 비교) 중심
-- ============================================================

-- 1. 문서 메타데이터 테이블
-- 매월 업로드되는 PDF 문서의 기본 정보
CREATE TABLE IF NOT EXISTS documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_name TEXT NOT NULL,                    -- 원본 파일명 (예: "장기종합보험_비교_2026년3월.pdf")
    storage_path TEXT,                          -- Supabase Storage 경로
    product_category TEXT NOT NULL,             -- 상품군 (장기종합보험, 종신보험, 연금보험 등)
    year_month TEXT NOT NULL,                   -- 기준 월차 (예: "2026-03")
    base_date DATE,                             -- 작성기준일
    uw_base_date DATE,                          -- U/W 기준일
    total_pages INTEGER,                        -- 총 페이지 수
    notes TEXT,                                 -- 유의사항
    status TEXT DEFAULT 'active',               -- active / archived / processing
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(product_category, year_month)        -- 같은 상품군+월차 중복 방지
);

-- 2. 비교 데이터 핵심 테이블
-- PDF에서 추출한 보험사별 상품 비교 데이터
CREATE TABLE IF NOT EXISTS comparison_rows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,

    -- 분류 정보
    product_category TEXT NOT NULL,             -- 상품군 (장기종합보험)
    sub_category TEXT,                          -- 세부분류 (암보험, 실손보험 등)
    section_name TEXT NOT NULL,                 -- 섹션명 (예: "암진단비", "항암치료비", "납입면제")

    -- 보험사/상품 정보
    insurer TEXT NOT NULL,                      -- 보험사명 (삼성화재, DB손해보험 등)
    product_name TEXT,                          -- 상품명
    product_code TEXT,                          -- 상품코드

    -- 조건 정보
    gender TEXT,                                -- 성별 (남/여/공통)
    age INTEGER,                                -- 나이
    insurance_type TEXT,                        -- 보험형태 (일반형/무해약형/건강고지/간편가입 등)
    payment_period TEXT,                        -- 납입기간 (20년납, 전기납 등)
    coverage_period TEXT,                       -- 보장기간 (100세만기, 80세만기 등)

    -- 데이터 값
    item_name TEXT NOT NULL,                    -- 항목명 (예: "일반암 진단비", "유사암 진단비")
    item_value TEXT,                            -- 값 (텍스트) - "3,000만원", "O", "X" 등
    item_value_numeric NUMERIC,                 -- 숫자 값 (비교/정렬용) - 3000 (만원 단위)
    item_unit TEXT DEFAULT '만원',              -- 단위 (만원, 원, %, 세)

    -- 메타
    page_number INTEGER,                        -- PDF 페이지 번호
    row_order INTEGER,                          -- 같은 섹션 내 정렬 순서
    footnote TEXT,                              -- 주석/비고
    year_month TEXT NOT NULL,                   -- 기준 월차 (비정규화, 빠른 필터용)

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 보험사 마스터 테이블
CREATE TABLE IF NOT EXISTS insurers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,                  -- 정식 보험사명
    short_name TEXT,                            -- 약칭 (삼성, 한화, DB 등)
    aliases TEXT[],                             -- 동의어 배열 ["삼성화재", "삼성", "삼화"]
    insurer_type TEXT,                          -- 손보/생보
    logo_url TEXT,
    display_order INTEGER DEFAULT 0
);

-- 4. 섹션 마스터 테이블 (비교 항목 정의)
CREATE TABLE IF NOT EXISTS sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_category TEXT NOT NULL,
    section_name TEXT NOT NULL,                 -- 정식 섹션명
    aliases TEXT[],                             -- 동의어 ["암진단비", "암 진단금", "암진단금"]
    display_order INTEGER DEFAULT 0,
    description TEXT,

    UNIQUE(product_category, section_name)
);

-- 5. 질의 로그 테이블 (분석/개선용)
CREATE TABLE IF NOT EXISTS query_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    raw_question TEXT NOT NULL,                 -- 원본 질문
    parsed_conditions JSONB,                    -- 파싱된 조건
    result_count INTEGER,                       -- 결과 수
    response_time_ms INTEGER,                   -- 응답 시간
    user_feedback TEXT,                         -- 좋아요/싫어요
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 인덱스
-- ============================================================

-- comparison_rows 핵심 검색 인덱스
CREATE INDEX IF NOT EXISTS idx_comp_category ON comparison_rows(product_category);
CREATE INDEX IF NOT EXISTS idx_comp_section ON comparison_rows(section_name);
CREATE INDEX IF NOT EXISTS idx_comp_insurer ON comparison_rows(insurer);
CREATE INDEX IF NOT EXISTS idx_comp_year_month ON comparison_rows(year_month);
CREATE INDEX IF NOT EXISTS idx_comp_gender_age ON comparison_rows(gender, age);
CREATE INDEX IF NOT EXISTS idx_comp_insurance_type ON comparison_rows(insurance_type);
CREATE INDEX IF NOT EXISTS idx_comp_item ON comparison_rows(item_name);

-- 복합 인덱스 (가장 빈번한 쿼리 패턴)
CREATE INDEX IF NOT EXISTS idx_comp_main_search
    ON comparison_rows(year_month, product_category, section_name, insurer);

CREATE INDEX IF NOT EXISTS idx_comp_filter_search
    ON comparison_rows(year_month, product_category, section_name, gender, age, insurance_type);

-- documents 검색
CREATE INDEX IF NOT EXISTS idx_doc_category_month ON documents(product_category, year_month);

-- ============================================================
-- RLS (Row Level Security) - 읽기 전용 공개
-- ============================================================

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparison_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE query_logs ENABLE ROW LEVEL SECURITY;

-- 읽기: 모든 사용자 허용
CREATE POLICY "documents_read" ON documents FOR SELECT USING (true);
CREATE POLICY "comparison_rows_read" ON comparison_rows FOR SELECT USING (true);
CREATE POLICY "insurers_read" ON insurers FOR SELECT USING (true);
CREATE POLICY "sections_read" ON sections FOR SELECT USING (true);

-- 쓰기: service_role만 허용 (Edge Function에서 사용)
CREATE POLICY "documents_write" ON documents FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "comparison_rows_write" ON comparison_rows FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "insurers_write" ON insurers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "sections_write" ON sections FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "query_logs_insert" ON query_logs FOR INSERT WITH CHECK (true);

-- ============================================================
-- 유틸리티 함수
-- ============================================================

-- 최신 월차 데이터 조회 함수
CREATE OR REPLACE FUNCTION get_latest_year_month(p_category TEXT)
RETURNS TEXT AS $$
    SELECT year_month
    FROM documents
    WHERE product_category = p_category AND status = 'active'
    ORDER BY year_month DESC
    LIMIT 1;
$$ LANGUAGE SQL STABLE;

-- 비교 데이터 검색 함수 (조건 기반)
CREATE OR REPLACE FUNCTION search_comparison(
    p_year_month TEXT DEFAULT NULL,
    p_category TEXT DEFAULT NULL,
    p_section TEXT DEFAULT NULL,
    p_insurer TEXT DEFAULT NULL,
    p_gender TEXT DEFAULT NULL,
    p_age INTEGER DEFAULT NULL,
    p_insurance_type TEXT DEFAULT NULL,
    p_item_name TEXT DEFAULT NULL
)
RETURNS SETOF comparison_rows AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM comparison_rows cr
    WHERE (p_year_month IS NULL OR cr.year_month = p_year_month)
      AND (p_category IS NULL OR cr.product_category = p_category)
      AND (p_section IS NULL OR cr.section_name = p_section)
      AND (p_insurer IS NULL OR cr.insurer = p_insurer)
      AND (p_gender IS NULL OR cr.gender = p_gender OR cr.gender = '공통')
      AND (p_age IS NULL OR cr.age = p_age)
      AND (p_insurance_type IS NULL OR cr.insurance_type = p_insurance_type)
      AND (p_item_name IS NULL OR cr.item_name ILIKE '%' || p_item_name || '%')
    ORDER BY cr.section_name, cr.insurer, cr.row_order;
END;
$$ LANGUAGE plpgsql STABLE;
