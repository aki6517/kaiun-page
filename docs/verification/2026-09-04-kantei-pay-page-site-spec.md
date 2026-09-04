# 実装指示書: 結果ページ廃止＋決済ページ `/kantei/pay` 骨格（サイト側・Stage A）

作成: せお 2026-09-04 ／ 実装: Codex gpt-5.6-terra high ／ 計画正本: ワーカーrepo `~/dev/luna-kantei-worker/docs/verification/2026-09-04-kantei-email-first-funnel-plan.md`（**§9の裁定が優先**。読むだけ・変更しない）

<task>
【何をするか】
このリポジトリ（Next.js 15 App Router / React 19 / Tailwind v4 / zod）で、鑑定ファネルを「結果ページ方式」から「メール完結＋決済ページ直行」へ切り替える。
1. 結果ページ `/kantei/result/[token]` と、それ専用のコードを削除する
2. 決済ページ `/kantei/pay?t=<token>`（Server Component・動的・noindex・祈祷書デザイン）と `/kantei/pay/thanks` を新設する。**Stage AではPayPalボタンを置かない**（「お支払いの受付は準備中です」表示）
3. tokenを外部計測に載せないガードを `/kantei/pay` へ付け替える（GTMガード・`<noscript>` iframe削除・`Referrer-Policy: no-referrer`）
4. 受付メールから結果ページの段落・ボタンを外し、文面をPDFお届けに変える
5. DBマイグレーション `docs/15_kantei_migration3.sql` を書く（西山くんがSupabase SQL Editorに貼る。**実行はしない**）

【対象ファイル】
- 削除: `app/kantei/result/[token]/page.tsx`（ディレクトリごと）
- 変更: `lib/kantei/db.ts`（`getResultForPage`・`resultRowSchema`・`KanteiResultForPage` を削除し `getPayPageState` を追加）
- 変更: `lib/kantei/email.ts`（`resultOrigin`・`isAllowedResultOrigin`・結果段落/ボタン削除。`createAcceptanceEmailHtml` の文面差し替え）
- 変更: `next.config.ts`（headers を `/kantei/pay` へ）、`app/layout.tsx`（GTMガード＋noscript削除）、`components/tracking-tag-injector.tsx`（ガードのパス）
- 新規: `app/kantei/pay/page.tsx`、`app/kantei/pay/thanks/page.tsx`、`docs/15_kantei_migration3.sql`
- 変更: `docs/10_kantei_funnel.md` に「9/4 方式転換」の1段落（結果ページ廃止・PDF添付・決済ページ）を追記

【読む範囲】
- 読んでよい: `app/kantei/**`、`lib/kantei/**`、`components/kantei/**`、`app/layout.tsx`、`components/tracking-tag-injector.tsx`、`next.config.ts`、`app/sitemap.ts`、`middleware.ts`、`docs/10〜14`、`docs/12_*.sql`・`docs/13_*.sql`（マイグレーションの書式）、`docs/verification/2026-09-03-*.md`
- 読まなくていい: `app/blog/**`、`public/lp-index.html`、`content/`、`scripts/`、`marketing-present/`、`node_modules`
- **ワーカーrepo `~/dev/luna-kantei-worker` は変更しない**（別タスクが並行して編集中。計画正本を読むのは可）

【完了条件】
- `npm run typecheck` が通る。`npm run lint` は**変更前にbaselineを取り**、変更前後で同じ失敗（Node 24.3.0で `@swc/helpers` 読込エラーが出ることが既知）なら追わずに報告する。新しいlintエラーを増やさない
- `/kantei/result/<token>` が404になる（ルート削除）
- `/kantei/pay?t=<uuid>` が下記の状態表どおりに描画される
- 受付メールに結果ページのリンクが無い
- git 操作: **ローカルブランチ `kantei-phase1` を `715a29a` から作って checkout し、そこで作業する**（今のローカルブランチ名 `redesign/app-tonmana` は紛らわしいので使わない）。commit・push はしない（せおがレビュー後に行う）
- この指示書の範囲だけ。ブログ・LP・特商法/プライポリの改訂は別タスク

【背景】
西山くん決定（2026-09-04）: 鑑定書ごとの結果URLを増やしたくない／メール内でティザー→CTA→決済画面に直行／決済画面も世界観を崩さない。
ワーカー側（別タスク）が、鑑定書メールにPDFを添付し、CTAを `${origin}/kantei/pay?t=<token>` に向ける。Stage BでこのページにPayPalボタンを差す。/kantei はまだ本番未公開（プレビュー `origin/kantei-phase1` のみ）なので、旧URLの転送や既存行の移行は不要。
デザイン正本は `docs/14_kantei_design_spec.md`（「夜明けの祈祷書」）。既存の `app/kantei/layout.tsx`・`components/kantei/ornaments.tsx`・`/kantei/thanks` の作りを踏襲する。
</task>

## 仕様

### P1. `getPayPageState(token)`（`lib/kantei/db.ts`）

- `select("status, paid, name, artifact_ready_at, paid_pdf_sent_at")`・`id = token`・`maybeSingle()`。既存の `getSupabaseClient` とタイムアウトを流用
- zod で厳密化（discriminatedUnion on `status`）:
  - `pending`／`failed`: `{ status, name }`
  - `generated`: `{ status, name, paid: boolean, artifact_ready_at: string|null, paid_pdf_sent_at: string|null }`
- 行なし → `null`。スキーマ不一致 → throw（ページは500でよい。tokenをエラーメッセージに含めない）
- 列 `artifact_ready_at` / `paid_pdf_sent_at` は docs/15 で追加される。未適用のDBで select が失敗する場合はそのまま throw（フォールバックで「決済可能」に倒さない）

### P2. `/kantei/pay` の状態表

| 条件 | 表示 |
|---|---|
| `t` が無い／配列／UUID形式でない／行なし | `notFound()` |
| `pending`、または `generated && artifact_ready_at == null` | 「鑑定書を作成中です。完成しましたらメールでお届けしますので、しばらくお待ちください。」 |
| `failed` | 「申し訳ありません。鑑定書をお作りすることができませんでした。お手数ですが sasha@kaiun-calendar.com までご連絡ください。」 |
| `generated && artifact_ready_at && !paid` | 決済ページ本体（P3） |
| `paid && paid_pdf_sent_at` | 「お支払いを確認しました。詳細鑑定書はメールでお届け済みです。届いていない場合は迷惑メールフォルダをご確認のうえ、ご連絡ください。」 |
| `paid && paid_pdf_sent_at == null` | 「お支払いを確認しました。詳細鑑定書のお届けを準備しています。もう少しだけお待ちください。」 |

- `searchParams` は Next.js 15 では **Promise**。`const { t } = await searchParams;` → `typeof t === "string"` かつ UUID正規表現に一致した時だけDBへ。配列・欠損は404
- `export const dynamic = "force-dynamic"`、`export const metadata = { robots: { index: false, follow: false } }`、`title` は「詳細鑑定書のお申し込み | 開運ルナカレンダー」
- **サイト内のどこにも `/kantei/pay` への `<Link>` を置かない**（メールからのhard navigation専用。GTMが読み込まれた別ページからSPA遷移させないため）

### P3. 決済ページ本体（祈祷書デザイン）

- `app/kantei/layout.tsx` 配下（Shippori Mincho継承）。`components/kantei/ornaments.tsx` の四隅の扇・二重線枠を再利用。トークンは docs/14（生成り `#FDFBF7`・金 `#B08A4F` 24px以上or太字19px以上・小金 `#8A6A3B`・墨 `#4A3F3B`・ローズ `#B7848C` は1画面1箇所＝月の錠前アイコンにだけ使う・外周 `#2D2428`）
- 構成（上から）:
  1. 見出し「まだ開かれていない頁を、あなたへ」
  2. 「<名前>様の詳細鑑定書」（名前は必ずエスケープ＝Reactの既定でOK・`dangerouslySetInnerHTML` を使わない）
  3. お渡しするもの（リスト）: 恋愛運／金運／仕事運／人間関係（それぞれ★つきの本文）／来年の運勢／あなたの月リズム／開運アイテム（開運カラー・パワーフード・ラッキースポット・開運行動）
  4. 「詳細鑑定書　¥2,000（税込）」
  5. お届け「お支払いのあと、メールでPDFをお届けします。通常はすぐに届きます。」
  6. 返金「デジタルコンテンツのため、お届け後の返金はできません。システムの不具合でお届けできなかった場合は全額返金します。」
  7. PayPalボタン枠: `process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID` が無い時は「お支払いの受付は準備中です。もう少しだけお待ちください。」を枠内に表示（Stage Bでここにボタンを差す。**枠のコンポーネント `components/kantei/pay-button-slot.tsx` を切っておく**）
  8. 「ご購入は任意です。無料の鑑定書だけでも、どうぞ大切にお使いください。」
  9. 小さく「特定商取引法に基づく表記」→ `/commercial-transactions`（通常のリンク。no-referrerなのでtokenは漏れない）
- 語彙は「頁を開く」「お渡しする」。煽り語（今だけ・残り・急いで・限定）禁止。**有料本文はこのページに存在しない**（`result` 列をselectしない設計で担保）
- `/kantei/pay/thanks`: 静的。「お支払いありがとうございます。詳細鑑定書をメールでお届けします。」＋迷惑メール案内。noindex。Stage Bのリターン先として作っておく

### P4. token非流出ガード

- `next.config.ts` headers: `source: "/kantei/pay"` に `Cache-Control: private, no-store`・`Referrer-Policy: no-referrer`・`X-Robots-Tag: noindex, nofollow`。`/kantei/result/:token` のエントリは削除
- `app/layout.tsx`: インラインGTMのガードを `location.pathname === '/kantei/pay'`（前方一致でなく完全一致）に変更。**`<noscript>` の GTM iframe は削除**（JSなし環境ではGA4も動かず価値がない一方、無条件に読み込まれてクエリ付きURLをRefererに乗せる）
- `components/tracking-tag-injector.tsx` L118 付近のガードも `/kantei/pay` に変更
- `app/sitemap.ts` は `/kantei` のみ掲載のまま（変更不要。確認して報告）

### P5. 受付メール（`lib/kantei/email.ts`）

- `resultOrigin()`・`isAllowedResultOrigin`・結果ページ段落＋ボタンを削除。`createAcceptanceEmailHtml(name, isDuplicate)` にシグネチャ変更（呼び出し元 `app/api/kantei/request/route.ts` も合わせる）
- 差し替え文（せお正本・改変しない）:
  > 鑑定書は24時間以内を目安に、このメールアドレス宛にPDFでお届けします。
  > メールが見当たらない場合は、迷惑メールフォルダもご確認ください。
- 「無料鑑定でお届けするもの」の箇条書きは残す。デザインは現行（祈祷書簡略版）のまま

### P6. `docs/15_kantei_migration3.sql`

```sql
-- 2026-09-04 migration3: 成果物準備・有料PDF送信の時刻
alter table public.kantei_requests
  add column if not exists artifact_ready_at timestamptz,
  add column if not exists paid_pdf_sent_at timestamptz;
```

docs/12・13の書式（コメント・冪等）に合わせる。RLS・権限は変えない。**実行しない**。

## 不変条件

1. 有料本文（`result.paid.*`）はこのサイトのどのページ・メールにも出ない（`result` を select しない）
2. tokenが載るのは `/kantei/pay?t=` のURLだけ。GTM/GA4/Clarity・Referer・サイト内リンクに載せない
3. `paid` だけで「お届け済み」にしない（`paid_pdf_sent_at` を見る）
4. 環境変数名は変えない。新規は `NEXT_PUBLIC_PAYPAL_CLIENT_ID` の**参照のみ**（値の設定は別工程）
5. 依存追加なし（`package.json` を触らない）
6. `/kantei` LP・`/kantei/thanks`・フォーム・APIの受付ロジック（重複判定・レートリミット・honeypot）は変えない

## 削るもの

- 結果ページとその専用コード（`getResultForPage`・`resultRowSchema`・`KanteiResultForPage`・`resultOrigin`・`isAllowedResultOrigin`・`/kantei/result/` ガード・`/kantei/result/:token` ヘッダ）
- GTM `<noscript>` iframe（サイト全体）

<completeness_contract>
Resolve the task fully before stopping.
Do not stop at the first plausible answer.
Check whether there are follow-on fixes, edge cases, or cleanup needed for a correct result（削除した関数を import している箇所・型の参照・テストの残骸）.
言いなりに直すな、まず自分で検証しろ。指示書に誤りがあれば論拠つきで指摘してよい（不変条件とコピーは守る）。
推測で実装するな。Next.js 15 の `searchParams`／`metadata.robots`／`headers()` の書き方は既存コードか公式ドキュメントで確認してから書け。
</completeness_contract>

<verification_loop>
Before finalizing, verify the result against the task requirements and the changed files or tool outputs.
If a check fails, revise the answer instead of reporting the first draft.

【検証コマンド】
git switch -c kantei-phase1 715a29a   # 最初に1回
npm run lint   # 変更前にbaseline → 変更後にもう一度。差分を報告
npm run typecheck
grep -rn "kantei/result\|getResultForPage\|resultOrigin\|isAllowedResultOrigin\|KanteiResultForPage" app lib components next.config.ts   # 0件であること
grep -rn "ns.html" app   # 0件であること
grep -rn "href=\"/kantei/pay\|href: \"/kantei/pay\|/kantei/pay\"" app components   # /kantei/pay へのサイト内リンクが無いこと（thanks内の自己参照も不可）
</verification_loop>

<action_safety>
Keep changes tightly scoped to the stated task.
Avoid unrelated refactors, renames, or cleanup unless they are required for correctness.
Call out any risky or irreversible action before taking it.

【触ってはいけないもの】
- `.env*`・Vercel設定・`vercel` CLI・`git push`・`git commit`
- Supabaseへの実行（SQLはファイルに書くだけ）
- `scripts/run-ga4-mcp.sh`（無関係な未コミット差分がある。stash・checkoutしない）、`marketing-present/`、`docs/verification/2026-09-04-kantei-pdf-prototype.pdf`
- `package.json` / `package-lock.json`
- ワーカーrepo
- このrepoはiCloud配下で git が固まることがある。`git switch` が60秒以上返らなければ諦めて報告（`.git/HEAD` を直接いじらない）
</action_safety>

<missing_context_gating>
Do not guess missing repository facts.
If required context is absent, retrieve it with tools or state exactly what remains unknown.
</missing_context_gating>

<structured_output_contract>
最後に必ず次を出力すること。
1. 変更・削除したファイルの完全な一覧（1つも省略しない）
2. 各ファイルで何を変えたか（1行ずつ）
3. 実行した検証コマンドと、その実際の出力（lintは変更前後のbaseline比較を含む）
4. やり残し・既知の制約・指示書に対して却下/変更した点とその論拠
1〜4は簡潔に。ファイル全文やログ全文は貼らない。
</structured_output_contract>
