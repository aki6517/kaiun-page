-- 鑑定ファネル マイグレーション2（2026-09-03 Codex計画レビューの指摘反映）
-- Supabase「KaiunCalendar」SQL Editorで1回実行

-- 列の追加（配信リトライ管理・失敗通知の冪等化・生成の版管理）
alter table public.kantei_requests
  add column if not exists delivery_attempts integer not null default 0,
  add column if not exists failure_notified_at timestamptz,
  add column if not exists prompt_version text,
  add column if not exists model text,
  add column if not exists generated_at timestamptz;

-- statusの値を制約で固定
alter table public.kantei_requests
  drop constraint if exists kantei_requests_status_check;
alter table public.kantei_requests
  add constraint kantei_requests_status_check
  check (status in ('pending','generated','failed'));

-- 検索用index
create index if not exists kantei_requests_email_created_idx
  on public.kantei_requests (email, created_at);
create index if not exists kantei_requests_iphash_created_idx
  on public.kantei_requests (ip_hash, created_at);

-- 原子的な受付関数（レート制限＋重複判定＋INSERTを1トランザクションで）
-- ※tokenはサーバー内でのみ使い、ブラウザには返さない
create or replace function public.kantei_submit(
  p_name text,
  p_birth_date date,
  p_email text,
  p_ip_hash text
) returns table (outcome text, token uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_recent_ip integer;
  v_existing uuid;
  v_new uuid;
begin
  -- 同時リクエストを直列化（同一メール・同一IPハッシュ）
  perform pg_advisory_xact_lock(hashtext('kantei_email:' || p_email));
  perform pg_advisory_xact_lock(hashtext('kantei_ip:' || p_ip_hash));

  -- 同一IPハッシュ: 直近1時間に3件既にあれば拒否
  select count(*) into v_recent_ip from kantei_requests
    where ip_hash = p_ip_hash and created_at > now() - interval '1 hour';
  if v_recent_ip >= 3 then
    return query select 'rate_limited'::text, null::uuid;
    return;
  end if;

  -- 同一メール: 直近24時間の申込みがあれば新規作成しない（既存tokenを返す）
  -- ただしfailed行は除外する（生成失敗後の再申込みで新しいpending行を作れるように）
  select id into v_existing from kantei_requests
    where email = p_email and created_at > now() - interval '24 hours'
      and status <> 'failed'
    order by created_at desc limit 1;
  if v_existing is not null then
    return query select 'duplicate'::text, v_existing;
    return;
  end if;

  insert into kantei_requests (name, birth_date, email, ip_hash)
    values (p_name, p_birth_date, p_email, p_ip_hash)
    returning id into v_new;
  return query select 'created'::text, v_new;
end;
$$;

-- anon等からは呼べないようにする（service_roleのみ）
revoke all on function public.kantei_submit(text, date, text, text) from public, anon, authenticated;
