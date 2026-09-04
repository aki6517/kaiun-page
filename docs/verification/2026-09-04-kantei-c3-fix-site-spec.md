# C-3 修正指示書（サイト側）— 3モデルレビュー結果の反映

対象リポジトリ: `/Users/nishiyamaakihiro/dev/luna-lp-site`（ブランチ `kantei-phase1`）
前提: 未コミットの B-1 実装（`git status` で見える差分）に対する修正。B-1 の実装指示書 `docs/verification/2026-09-04-kantei-pay-page-site-spec.md` は引き続き有効。

## 進め方

- **言いなりに直すな。まず自分で該当コードを開いて、指摘が実在するか検証してから直せ。** 誤った指摘だと判断したら、論拠つきで却下して報告に書け
- 推測で実装するな。Next.js 15 App Router の `not-found.tsx` の適用範囲（セグメント内で `notFound()` を呼んだとき、そのセグメントの `not-found.tsx` が使われる）は公式ドキュメントで確認してから決めろ
- 機構を足しすぎるな。新しい依存・新しい環境変数は作らない

## 修正項目

### S-1（High）`app/kantei/pay/not-found.tsx` を新設する

問題: `/kantei/pay?t=<token>` で `notFound()` になったとき（配列パラメータ・非UUID・行なし）、ルートの `app/not-found.tsx` が出る。そこには `next/link` の `<Link>`（ホーム・ブログ）があり、SPA遷移で外部タグが再注入されたあと、ブラウザの「戻る」で token 付きURLへSPA復帰すると History Change を拾える。tokenが不正な場合限定だが、修正が安価なので塞ぐ

直し方:
- `app/kantei/pay/not-found.tsx` を新設。**`next/link` を使わず**、通常の `<a href="/">` だけにする（`HardNavigationLink` を使ってもよい）
- デザインは決済ページと同じ「祈祷書」（`PrayerPage` の枠・`SunriseEmblem`・色 `#FDFBF7` / `#B08A4F` / `#4A3F3B`）。`PrayerPage` が `app/kantei/pay/page.tsx` 内のローカル関数なら `components/kantei/prayer-page.tsx` に切り出して両方から使う（見た目は変えない）
- 文言: 見出し「このページは見つかりませんでした」／本文「リンクの有効期限が切れているか、URLに誤りがある可能性があります。お手数ですが、メールに記載のリンクをもう一度お試しください。」／リンク「開運ルナカレンダーのトップへ」
- `metadata` は決済ページと同じく noindex
- ルートの `app/not-found.tsx` は変えない（他ページの挙動を変えない）

### S-2（Low）不変条件をコードのコメントに残す

1. `components/tracking-tag-injector.tsx` の `if (pathname === "/kantei/pay")` の直前に、日本語で2〜3行:「このガードは初回マウント時のみ効く。`/kantei/pay` へはメール・PDFのリンク（hard navigation）からしか入らない前提。サイト内から `<Link>` / `router.push` で `/kantei/pay` へ遷移する導線を作らないこと。作ると外部タグが token 付きURLを拾う」
2. `lib/kantei/email.ts` の `getEmailIdempotencyToken` の直前に1〜2行:「Resend の Idempotency-Key に生tokenを載せないため sha256 化。決定的なので同じtokenからは同じキーになる」

コメント以外は変えない。

### S-3 ティザー画像を `public/kantei/teaser/` に置く

`public/kantei/teaser/{love,money,work,relationships}.png`（各 520×288 / 約73KB）は、せおがワーカーrepoからコピー済みの前提で進める。**存在を `ls` で確認して報告に書く**。無ければ報告で「未配置」と書き、自分で作らない（ワーカーrepoの `assets/teasers/` が正本）。
`next.config.ts` のヘッダ設定で `/kantei/teaser/*` に `no-store` が付いていないこと（画像は通常キャッシュでよい）、`X-Robots-Tag: noindex` は付けてよい（付いていなくても指摘不要）を確認して報告する。

### S-4（Medium）受付メールにAI開示の一文を足す

場所: `lib/kantei/email.ts` `createAcceptanceEmailHtml`

文言（`app/kantei/page.tsx` のフォーム頁と同文。改変しない）:
> 本鑑定はAI鑑定システムが生成しています（紗々・マグダレナ監修）

直し方: 末尾の `─ ✦ ─` の下に、12px `#8A6A3B` で1行。他の文面は変えない（P5 の差し替え2文はそのまま）。

## 不変条件

- `/kantei/pay` のHTMLに `result` 列の内容（有料本文）を出さない（`getPayPageState` の select に `result` を足さない）
- token は `/kantei/pay?t=` のクエリ以外に載せない。GTM/GA4/Clarity・Referer・サイト内 `<Link>`・ログに載せない
- `next.config.ts` の `/kantei/pay` ヘッダ（`no-store` / `no-referrer` / `X-Robots-Tag`）を変えない
- `app/sitemap.ts` は `/kantei` のみ
- 依存追加なし・`package.json` 不変・環境変数名を変えない
- `docs/15_kantei_migration3.sql` を変えない

## やらないこと

- `git commit` / `git push` / Vercel デプロイ
- ワーカーrepo（`~/dev/luna-kantei-worker`）への変更
- `npm install`・`.next` の削除
- 上記以外のリファクタ

## 却下済み（直さなくてよい）

- 受付メールの差し替え2文が箇条書きで分断されている件 → 文面は無改変で、「いつ届く→何が届く→見当たらなければ」の順は読み手に自然。現状維持
- `artifact_ready_at === null` の判定（空文字の扱い） → `timestamptz` に空文字は入らない。現状維持
- `PayButtonSlot` の `data-paypal-client-id` 属性 → `NEXT_PUBLIC_*` は公開値。Stage B で扱う
- `lib/tracking-tags.ts` のプリセットに残る `ns.html` iframe → `/kantei/pay` では injector が注入しないので到達しない
- Vercel Runtime Logs にクエリ `?t=` が残る件 → 計画§9で受容済みの残余リスク（西山くんへ報告する）

## 検証

- `npm run typecheck`（`--incremental false`）と `eslint --no-cache` で対象ファイルが通ること。`npm run lint` が `.next/cache` の権限で失敗する場合は前者で代替してよい
- `git diff --check`
- ローカルで `next dev` / `next build` は**しない**（iCloud外クローンでも、検証は Vercel プレビューで行う方針）

## 報告形式

1. 項目ごとに「直した／却下した（論拠）」
2. `git status` と変更ファイル一覧（新規 `not-found.tsx`・`prayer-page.tsx`・`public/kantei/teaser/*` を含む）
3. typecheck / eslint / `git diff --check` の実出力
4. 保証できなかったこと
