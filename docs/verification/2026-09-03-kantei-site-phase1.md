<task>
【何をするか】
このリポジトリ（Next.js 15 App Router / React 19 / Tailwind v4 / TypeScript / Vercel本番 kaiun-calendar.com）に「無料AI鑑定」ファネルのサイト側を実装する。
フォーム（名前・生年月日・メール・同意）→ APIで受付 → 受付完了メール即時送信 → 後日ローカルワーカー（別リポジトリ）が鑑定書を生成しメールする。結果ページはトークン付きURLで、無料パートを表示し有料パートはぼかしプレースホルダにする。

設計の正本: docs/10_kantei_funnel.md / docs/11_kantei_prompt_design.md / docs/12_kantei_requests_table.sql / docs/13_kantei_migration2.sql（DBは12が適用済み・13は適用予定。13の関数契約に合わせて実装する）

【対象ファイル（新規）】
- app/kantei/page.tsx — 鑑定LP。内容: 紗々・マグダレナ紹介（母の哲学=他人軸→自分軸）・無料鑑定でわかること・AI開示文「本鑑定はAI鑑定システムが生成しています（紗々・マグダレナ監修）」・安心設計3ヶ条（煽らない・依存させない・明朗会計）・「鑑定書は24時間以内を目安にメールでお届けします（順次作成のため前後する場合があります）」・フォーム。トンマナはアプリ準拠: ダスティローズ#B7848C / シャンパン#E8D9C3 / 温かいダーク#2D2428、フォントは既存レイアウトのZen Maru Gothic系を踏襲
- components/kantei/kantei-form.tsx — client component。名前(1〜50字)・生年月日(1920年〜今日の5年前)・メール・同意チェック(必須・/privacy-policyへのリンク付き「個人情報の取り扱いに同意する」)。zodでバリデーション。honeypot隠しフィールド＋フォーム表示時刻hidden。送信中disabled。成功で/kantei/thanksへ遷移。dataLayer.push: kantei_form_view(表示時)・kantei_form_submit(成功時)。PIIはdataLayerに入れない
- app/kantei/thanks/page.tsx — 静的。受付完了・メール確認案内・迷惑メールフォルダ案内。トークンは扱わない
- app/kantei/result/[token]/page.tsx — Server Component。`export const dynamic = "force-dynamic"`＋レスポンスヘッダ Cache-Control: private, no-store（route segment configとheaders）。metadata: robots noindex,nofollow。UUID形式不正または行なし→notFound()。status=pending→「鑑定書を作成中です。完成しだいメールでお知らせします」。status=failed→「申し訳ありません。鑑定書の作成で問題が発生しました。お手数ですが、再度お申込みいただくか pugwriting@gmail.com までご連絡ください」（内部事情は書かない）。status=generated→無料パート（essence/healing_word/this_year_digest）を表示し、有料パート（恋愛運・金運・仕事運・人間関係・来年の運勢・月リズム・開運アイテム）は見出し＋ぼかし風ダミーの器だけ表示。¥2,000解放の予告文言（決済ボタンはP2なので「準備中」表記）。dataLayer: kantei_result_view・kantei_locked_view
- app/api/kantei/request/route.ts — POST。zodで再検証→honeypot埋まってる or 表示から3秒未満→**200 {ok:true}を返して何もしない**（攻撃者に区別を与えない）→ip_hash=sha256(クライアントIP + process.env.IP_HASH_SALT)→supabase.rpc("kantei_submit", {p_name, p_birth_date, p_email, p_ip_hash})→outcome分岐: created=受付完了メール送信 / duplicate=同じメールアドレスへ受付済み案内メール再送（結果ページリンク入り） / rate_limited=**200 {ok:true}のまま何もしない**。**レスポンスにtokenを絶対含めない**。エラー時もPII・内部事情をレスポンスとログに出さない
- lib/kantei/schema.ts — zodスキーマ（フォームとAPIで共用）
- lib/kantei/db.ts — supabase-js（SUPABASE_URL＋SUPABASE_SERVICE_ROLE_KEY）。**server-only import**。関数: submitKantei(rpc呼び出し)・getResultForPage(token)→ **selectで status, paid, result->'free' のみ取得。paidの本文はpaid=falseの間クエリすら発行しない**
- lib/kantei/email.ts — Resend REST fetch（https://api.resend.com/emails・Bearer RESEND_API_KEY・ヘッダIdempotency-Key: "kantei-accept-<token>"）。差出人=KANTEI_FROM_EMAIL（紗々・マグダレナ表示名）。受付完了メールテンプレ: お礼・お届け目安・結果ページリンク(https://kaiun-calendar.com/kantei/result/<token>)・AI開示フッター。**HTMLに埋める全変数（名前等）はエスケープ関数を通す**

【対象ファイル（変更）】
- package.json — dependencies に "@supabase/supabase-js" を手書き追加（コマンドでのinstallはしない）
- app/sitemap.ts — /kantei を追加（result・thanksは載せない）
- app/privacy-policy/page.tsx — 既存の体裁に合わせて追記: 無料AI鑑定で取得する情報（氏名・生年月日・メールアドレス）と利用目的（鑑定書の生成・送付・購入管理）／処理の委託先（Anthropic Claude=鑑定文の生成、Resend=メール配信、Supabase=データ保管）／保存期間（未購入の申込みデータは12ヶ月を目安に削除）／削除請求窓口 pugwriting@gmail.com

【読む範囲】
- 読んでよい: app/・components/・lib/・docs/10〜13・package.json・next.config.ts・middleware.ts
- 読まない: node_modules・content/blog・public/（特にlp-index.htmlは2,500行あるので開かない）・.next・.vercel

【完了条件】
- 上記ファイルが揃い、TypeScriptとして整合していること（型エラーを目視確認。ローカルbuildは走らせない）
- 不変条件: ①paid=falseのレスポンスに有料パートの実テキストが一切含まれない（RSCペイロード含む） ②tokenはAPIレスポンスに含まれない ③service_role/Resendキーがクライアントバンドルに入らない ④PII（氏名・生年月日・メール）がログ・dataLayer・エラーレスポンスに出ない
- この機能の実装のみ。既存ページ・ブログ・トラッキング設定のリファクタはしない

【背景】
SEOブログ流入のマネタイズ。鑑定書の生成は別リポジトリのローカルワーカー（Claude Code headless）が担うため、このAPIはAIを呼ばない。DBテーブルは作成済み（docs/12）、docs/13のRPCは近日適用（契約はdocs/13を正とする）。
</task>

<completeness_contract>
Resolve the task fully before stopping.
Do not stop at the first plausible answer.
Check whether there are follow-on fixes, edge cases, or cleanup needed for a correct result.
</completeness_contract>

<verification_loop>
Before finalizing, verify the result against the task requirements and the changed files.
このリポジトリはローカルのnode_modulesが壊れ気味のため、**npm install / npm run build / npm test は実行しない**（検証はVercelプレビューでせおが行う）。
代わりに: ①全新規ファイルの相互import整合を目視確認 ②route.tsのレスポンス分岐を再確認（token非含有・攻撃経路で200） ③result/[token]ページが有料本文を取得しないことをdb.tsのselect句で確認 ④docs/13のRPCシグネチャと呼び出しの一致確認
</verification_loop>

<action_safety>
Keep changes tightly scoped to the stated task.
【触ってはいけないもの】
- public/lp-index.html・content/blog/・app/settings/・tracking関連・next.config.tsのrewrites
- **gitコマンド一切禁止**（このリポジトリはgitがSIGBUSで壊れやすい。commit/pushはせおが後で安全モードで行う）
- npm/npx等のパッケージコマンド禁止（package.jsonの手書き編集のみ）
- .env.local・鍵ファイル
【削ってはいけない不変条件】
- 完了条件に列挙した①〜④
</action_safety>

<missing_context_gating>
Do not guess missing repository facts.
If required context is absent, retrieve it with tools or state exactly what remains unknown.
</missing_context_gating>

<structured_output_contract>
最後に必ず次を出力すること。
1. 変更・新規ファイルの完全な一覧（1つも省略しない）
2. 各ファイルで何をしたか（1行ずつ）
3. 目視検証で確認した項目と結果
4. やり残し・既知の制約（Vercelプレビューで確認すべき点を明記）
報告は簡潔に。ファイル全文は貼らない。
</structured_output_contract>
