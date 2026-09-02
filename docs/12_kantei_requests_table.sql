-- 鑑定ファネル用テーブル（Supabase「KaiunCalendar」プロジェクト / SQL Editorで1回実行）
-- 2026-09-03 せお作成。キュー方式（Claude Codeワーカー）対応版

create table if not exists public.kantei_requests (
  id uuid primary key default gen_random_uuid(),  -- 結果ページのトークン兼用
  name text not null,
  birth_date date not null,
  email text not null,
  status text not null default 'pending',  -- pending / generated / failed
  result jsonb,                            -- {free: {...}, paid: {...}}
  paid boolean not null default false,
  paid_at timestamptz,
  payment_ref text,
  retry_count integer not null default 0,  -- ワーカーの生成リトライ回数
  sent_at timestamptz,                     -- 鑑定書メール送付済み時刻
  ip_hash text,
  created_at timestamptz not null default now()
);

-- RLSを有効化し、ポリシーは一切作らない＝anonキーでは全拒否。
-- アクセスはサーバー側のservice_roleキー経由のみ（個人情報保護）
alter table public.kantei_requests enable row level security;

-- ワーカーが「未処理の申込み」を取りに来る時用
create index if not exists kantei_requests_status_idx
  on public.kantei_requests (status, created_at);
