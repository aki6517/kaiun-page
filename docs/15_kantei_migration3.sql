-- 2026-09-04 migration3: 成果物準備・有料PDF送信の時刻
-- Supabase「KaiunCalendar」SQL Editorで1回実行

alter table public.kantei_requests
  add column if not exists artifact_ready_at timestamptz,
  add column if not exists paid_pdf_sent_at timestamptz;
