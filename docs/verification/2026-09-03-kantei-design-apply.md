<task>
【何をするか】
無料AI鑑定ファネルのUIを、デザイン定義書 **docs/14_kantei_design_spec.md（正本・必読）** の「夜明けの祈祷書」コンセプトに全面リデザインする。機能・データフロー・セキュリティ挙動は一切変えない（見た目とマークアップだけ）。

【対象ファイル】
- 新規 `components/kantei/ornaments.tsx` — 金1色のインラインSVG装飾集: ①コーナー扇（四隅用・放射細線のアールデコ扇。幾何プリミティブで構成） ②二重線フレーム（角に小さな渦） ③日の出紋章（半円＋放射線＋下の水平線。実物表紙の再構成） ④月の満ち欠けディバイダー（●◐○◑●の5点＋細線・ローズ可） ⑤星の点（＋と・）⑥金の★（塗り）と空き★（`#D9C08F`輪郭）。すべて `currentColor` または prop で色指定・viewBox付き・装飾は `aria-hidden`
- 新規 `app/kantei/layout.tsx` — next/font/google で Shippori Mincho を読み込み（weight 400/500/700・subsets latin＋preload最小）、/kantei配下だけにCSS変数で適用。ブログ等他ページに影響させない
- 全面改修 `app/kantei/result/[token]/page.tsx` — 定義書§3レイアウト構造どおり: 表紙ブロック（二重線フレーム＋日の出紋章＋「鑑定書」大見出し＋◯◯様＋鑑定日）→頁カード（1テーマ1カード・コーナー扇・余白たっぷり）→癒す言葉（中央・「」・ローズ細帯）→★は「金運 ★★★★☆」形式→有料は「まだ開かれていない頁」演出（金枠＋ローズの月の錠前＋ぼかしダミー行。「準備中」「ロック」等のシステム語を出さない。¥2,000の案内文言は事実だけ静かに）→結び（中央「〜 紗々・マグダレナより愛を込めて 〜」＋小さな月線画）。pending/failed状態の画面も同じ世界観の頁カードに
- トーン改修 `app/kantei/page.tsx` — 配色・フォント・装飾を定義書トークンに同調（構成・文言・フォーム機能は維持。フォーム入力欄は可読性優先で現行の暗背景をやめ、生成り地×墨文字×金枠線に）
- 改修 `lib/kantei/email.ts` — 受付メールを定義書§3メール仕様に（外周#2D2428・生成りカード・インラインCSSのみ・画像なし・`─ ✦ ─`ディバイダー・明朝フォールバック指定）。エスケープ・Idempotency-Key等のロジックは不変

【背景・制約】
- 実物鑑定書の様式継承がゴール。市場のCanvaテンプレ感（パステル虹色・枠だらけ）と真逆の「静けさ」を出す
- **コントラストは定義書§3の計算済みルールを厳守**: 金`#B08A4F`は24px以上or太字19px以上限定／小さい金文字は`#8A6A3B`／本文は`#4A3F3B`／ローズは装飾・大文字限定
- 定義書§4のNGリストを1つも踏まない
- Tailwind v4のレイヤー注意（globals.cssの素のelementルールは@layer baseへ。既存を壊さない）
- モバイル375px幅で横スクロールなし・余白が潰れないこと
- dataLayer push・noindex・force-dynamic・有料テキスト非送出・トークン非表示などの既存挙動は完全維持

【読む範囲】
- docs/14_kantei_design_spec.md（正本）・app/kantei/**・components/kantei/**・lib/kantei/email.ts・app/globals.css・tailwind設定
- 読まない: node_modules・content/blog・public/lp-index.html・.next

【完了条件】
- 上記ファイルが定義書と1対1で対応（§3トークン・§4NG・レイアウト構造）
- 機能回帰ゼロ（フォーム送信・状態分岐・ぼかし非送出・イベント）
- 各テキスト要素の色×サイズがコントラストルール表に適合していることを自分で列挙確認
</task>

<completeness_contract>
Resolve the task fully before stopping.
Do not stop at the first plausible answer.
Check whether there are follow-on fixes, edge cases, or cleanup needed for a correct result.
</completeness_contract>

<verification_loop>
npm install / build / test / git は実行禁止（検証はVercelプレビューでせおが行う）。
代わりに: ①定義書§3・§4と実装の突合表を作る ②全テキストの色・サイズとコントラスト適合の一覧 ③SVGのviewBox・aria-hiddenの確認 ④モバイル幅で崩れそうな箇所の自己点検
</verification_loop>

<action_safety>
【触ってはいけないもの】route.ts・db.ts・schema.ts・worker関連・next.config.tsのrewrites・public/lp-index.html・blog・settings・gitコマンド・npmコマンド
【不変条件】有料テキスト非送出／トークン非表示／PII非出力／既存のdataLayerイベント名／フォームのバリデーション・honeypot挙動
</action_safety>

<structured_output_contract>
最後に必ず: 1.変更ファイル全列挙 2.各ファイル1行説明 3.コントラスト適合一覧（要素×色×サイズ×比） 4.定義書との突合で妥協した点（あれば理由つき）
</structured_output_contract>
