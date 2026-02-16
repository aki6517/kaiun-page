# 実装計画書

## 1. 目的

`docs/01_requirements.md`、`docs/02_architecture.md`、`docs/03_database.md`、`docs/05_sitemap.md` に基づき、開運ルナカレンダー LP・ブログサイトを段階的に実装する。

## 2. 実装の前提

- 技術スタックは Next.js 15 + TypeScript + Tailwind CSS v4 を採用する。
- MVPではDBを必須にしない（MDXファイルを正データとして運用）。
- SEO要件（構造化データ、sitemap、robots、canonical）を機能要件と同等優先で扱う。
- `docs/04_api.md` を基準に、実装前レビューで仕様を確定する。

## 3. 優先順位（P0/P1/P2）

### P0（公開に必須）

- プロジェクト基盤構築（Next.js/Tailwind/TypeScript）
- 共通レイアウト（ヘッダー・フッター）
- トップページ（現LP移行）
- ブログ基盤（MDX読み込み、一覧、詳細、カテゴリ）
- SEO基盤（Metadata、JSON-LD、sitemap、robots、canonical）
- llms.txt / llms-full.txt
- プライバシーポリシー

### P1（品質・運用に必須）

- 目次自動生成、関連記事、SNSシェア
- 404ページ、内部リンク最適化
- GA4/Search Console設定、デプロイ導線
- Core Web Vitals最適化

### P2（公開後に強化）

- OGP画像自動生成
- 人気記事ランキング自動化
- DB導入（将来拡張）

## 4. 依存関係の整理

1. 開発基盤構築  
2. 共通レイアウト実装  
3. コンテンツスキーマ（frontmatter）定義  
4. ブログ機能（一覧/詳細/カテゴリ）  
5. SEO/LLMファイル生成  
6. 計測・検証・最適化  
7. 本番デプロイ

## 5. フェーズ別実装ステップ

### フェーズ1: 設計補完と開発基盤（3日）

- [x] `docs/04_api.md` をレビュー・確定（Route Handler中心のAPI仕様）
- [x] Next.js 15プロジェクト初期化
- [x] TypeScript/Tailwind v4/ESLint設定
- [x] GitHub Actions（lint/build）追加
- [ ] Vercel連携確認

完了条件:
- [x] `npm run build` が成功
- [ ] CIでlint/buildが通る

### フェーズ2: サイト骨格とトップページ（4日）

- [x] `app/layout.tsx` と共通ヘッダー・フッター実装
- [x] `index.html` のLPを `app/page.tsx` に移行
- [x] レスポンシブ対応（モバイル/タブレット/デスクトップ）
- [x] FAQ/CTAセクション実装

完了条件:
- [x] デザイン要件（色/タイポ/トーン）を満たす
- [x] 主要導線（ホーム/ブログ/プライバシー）が動作

### フェーズ3: ブログ基盤（5日）

- [x] `content/blog/*.mdx` 読み込み基盤作成
- [x] frontmatterバリデーション（slug一意性含む）
- [x] `/blog/` 一覧ページ実装（12件ページネーション）
- [x] `/blog/[slug]/` 詳細ページ実装（目次/関連記事）
- [x] `/blog/category/[category]/` 実装
- [ ] 初期記事10本を投入

完了条件:
- [x] 全記事の生成がビルド時に成功
- [x] 記事一覧から詳細へ遷移可能

### フェーズ4: SEO/LLM最適化（4日）

- [x] Metadata APIでtitle/description/canonical実装
- [ ] JSON-LD（SoftwareApplication/Article/FAQ/Breadcrumb）実装
- [x] `app/sitemap.ts` 実装
- [x] `app/robots.ts` 実装
- [x] `/llms.txt` と `/llms-full.txt` 実装

完了条件:
- [ ] Rich Results Testで重大エラーなし
- [ ] `sitemap.xml` と `robots.txt` が要件通り出力

### フェーズ5: 品質保証と公開準備（4日）

- [ ] Core Web Vitals改善（LCP/INP/CLS）
- [x] 404ページとリンク切れチェック
- [x] GA4/Search Console設定画面（head/bodyタグ挿入）実装
- [ ] 本番デプロイ（独自ドメイン・HTTPS確認）

完了条件:
- [ ] PageSpeed Insights 90点以上（モバイル/デスクトップ）
- [ ] 受け入れ基準チェックリストを満たす

## 6. GitHubイシュー案

### [ISSUE-01] API設計書のレビュー・確定

### 概要
Route Handler（`sitemap`/`robots`/`llms`）を含むAPI設計を実装前にレビューし、仕様を確定する。

### 実装内容
- [ ] 要件・アーキテクチャ・サイトマップからAPI対象を抽出
- [ ] エンドポイント定義（メソッド/レスポンス/エラー）を記述
- [ ] 認証不要方針と将来拡張方針を記述

### 関連ドキュメント
- `docs/01_requirements.md`
- `docs/02_architecture.md`
- `docs/05_sitemap.md`

### 完了条件
- [ ] `docs/04_api.md` が実装可能な粒度で確定
- [ ] ルーティング設計との不整合がない

### テスト観点
- ドキュメントのみのため、実装前レビューで整合確認
- エンドポイント一覧に漏れがないこと

### [ISSUE-02] Next.js基盤構築

### 概要
Next.js 15 + TypeScript + Tailwind v4 + CI の実装基盤を構築する。

### 実装内容
- [ ] Next.jsプロジェクト初期化
- [ ] Tailwind v4設定とグローバルスタイル整備
- [ ] ESLint/TypeScript設定
- [ ] GitHub Actionsでlint/build実行

### 関連ドキュメント
- `docs/01_requirements.md`
- `docs/02_architecture.md`

### 完了条件
- [ ] ローカル開発サーバー起動
- [ ] CIがグリーン

### テスト観点
- `npm run build` の成功
- 依存ライブラリの重大脆弱性がないこと

### [ISSUE-03] 共通レイアウト実装

### 概要
ヘッダー/フッター/共通レイアウトを実装し、全ページの導線を統一する。

### 実装内容
- [ ] `app/layout.tsx` 実装
- [ ] ヘッダー（ホーム/ブログ）実装
- [ ] フッター（ホーム/ブログ/プライバシー）実装
- [ ] モバイルナビ実装

### 関連ドキュメント
- `docs/01_requirements.md`
- `docs/02_architecture.md`
- `docs/05_sitemap.md`

### 完了条件
- [ ] 全ページで共通レイアウトが適用される
- [ ] ナビゲーション動線が要件通り

### テスト観点
- モバイル/デスクトップでナビ動作確認
- キーボード操作で主要リンクに到達可能

### [ISSUE-04] トップページ（LP）移行

### 概要
既存 `index.html` を Next.js のトップページに移行し、デザインを維持する。

### 実装内容
- [ ] LP各セクションのコンポーネント化
- [ ] 既存カラー/タイポ/余白を再現
- [ ] CTA/App Storeリンク整備
- [ ] FAQセクション実装

### 関連ドキュメント
- `docs/01_requirements.md`
- `docs/02_architecture.md`

### 完了条件
- [ ] 主要セクションがすべて移行済み
- [ ] 見た目・文言が旧LPと同等

### テスト観点
- 視覚差分（旧LP比較）
- 主要CTAリンクの疎通

### [ISSUE-05] MDXコンテンツ基盤

### 概要
`content/blog/` のMDXをビルド時に読み込み、frontmatter検証を行う。

### 実装内容
- [ ] MDXローダー導入
- [ ] frontmatter型定義とバリデーション
- [ ] slug一意性チェック
- [ ] カテゴリ定義（tarot/kaiun/koyomi/moon/guide）

### 関連ドキュメント
- `docs/01_requirements.md`
- `docs/02_architecture.md`
- `docs/03_database.md`

### 完了条件
- [ ] 不正frontmatter時にビルド失敗
- [ ] 正常な記事データが取得できる

### テスト観点
- バリデーション正常系/異常系
- slug重複時のエラー確認

### [ISSUE-06] ブログ一覧ページ実装

### 概要
`/blog/` で記事カード一覧、カテゴリ導線、ページネーションを実装する。

### 実装内容
- [ ] 一覧カードUI実装
- [ ] 1ページ12件のページネーション
- [ ] カテゴリフィルタ導線
- [ ] サイドバーCTA（デスクトップ）

### 関連ドキュメント
- `docs/01_requirements.md`
- `docs/05_sitemap.md`

### 完了条件
- [ ] 新着順で記事表示
- [ ] ページ切り替えとカテゴリ遷移が機能

### テスト観点
- 記事0件/1件/複数件時の表示
- モバイルでのカード崩れがないこと

### [ISSUE-07] ブログ記事詳細ページ実装

### 概要
`/blog/[slug]/` で本文表示、目次、関連記事、シェア導線を実装する。

### 実装内容
- [ ] MDX本文レンダリング
- [ ] 目次自動生成（h2/h3）
- [ ] 関連記事3件表示
- [ ] SNSシェアボタン実装

### 関連ドキュメント
- `docs/01_requirements.md`
- `docs/02_architecture.md`
- `docs/05_sitemap.md`

### 完了条件
- [ ] 記事本文とメタ情報が表示される
- [ ] 関連記事とシェア導線が動作

### テスト観点
- 見出し無し記事でも崩れないこと
- 関連記事が同カテゴリ優先で表示されること

### [ISSUE-08] カテゴリ一覧ページ実装

### 概要
`/blog/category/[category]/` でカテゴリ別の記事一覧を提供する。

### 実装内容
- [ ] カテゴリ別フィルタロジック実装
- [ ] カテゴリ説明と記事件数表示
- [ ] ページネーション対応

### 関連ドキュメント
- `docs/01_requirements.md`
- `docs/05_sitemap.md`

### 完了条件
- [ ] 5カテゴリすべて表示可能
- [ ] 不正カテゴリは404へ遷移

### テスト観点
- カテゴリ別件数の一致
- 不正パラメータ時のハンドリング

### [ISSUE-09] SEO基盤実装

### 概要
Metadata API、JSON-LD、パンくず、canonicalを実装し、検索最適化を成立させる。

### 実装内容
- [ ] ページ別title/description実装
- [ ] canonical設定
- [ ] JSON-LD実装（トップ/一覧/記事/固定ページ）
- [ ] パンくずUI + BreadcrumbList実装

### 関連ドキュメント
- `docs/01_requirements.md`
- `docs/02_architecture.md`
- `docs/05_sitemap.md`

### 完了条件
- [ ] 全公開ページにメタ情報がある
- [ ] Rich Results Testで重大エラーなし

### テスト観点
- 構造化データの必須項目欠落がないこと
- タイトル/説明の文字数要件を満たすこと

### [ISSUE-10] `sitemap` / `robots` / `llms` 実装

### 概要
クローラ向けとLLM向けの公開ファイルを実装する。

### 実装内容
- [ ] `app/sitemap.ts` 実装
- [ ] `app/robots.ts` 実装
- [ ] `/llms.txt` 実装
- [ ] `/llms-full.txt` 自動生成実装

### 関連ドキュメント
- `docs/01_requirements.md`
- `docs/02_architecture.md`
- `docs/05_sitemap.md`

### 完了条件
- [ ] `sitemap.xml` に主要ページが含まれる
- [ ] `robots.txt` が要件通り
- [ ] `llms.txt` / `llms-full.txt` にアクセスできる

### テスト観点
- URL漏れ・重複がないこと
- 本番ドメイン反映後にSearch Console登録可能であること

### [ISSUE-11] 固定ページ・404・法務整備

### 概要
プライバシーポリシーと404ページを実装し、公開品質を満たす。

### 実装内容
- [ ] `/privacy-policy/` 作成
- [ ] `not-found` 実装
- [ ] フッターからの導線確認

### 関連ドキュメント
- `docs/01_requirements.md`
- `docs/05_sitemap.md`

### 完了条件
- [ ] 法務ページが公開される
- [ ] 404導線が機能する

### テスト観点
- 存在しないURLで404表示
- プライバシーポリシーの文言漏れがないこと

### [ISSUE-12] 品質検証と本番公開

### 概要
性能・SEO・導線・解析設定を検証し、本番公開する。

### 実装内容
- [ ] PageSpeed Insights検証と改善
- [ ] Core Web Vitals確認（LCP/INP/CLS）
- [ ] GA4/Search Console設定
- [ ] Vercel本番デプロイと独自ドメイン設定

### 関連ドキュメント
- `docs/01_requirements.md`
- `docs/02_architecture.md`
- `docs/05_sitemap.md`

### 完了条件
- [ ] 受け入れ基準を満たして公開完了
- [ ] KPI追跡の初期計測が開始できる

### テスト観点
- モバイル/デスクトップのスコア確認
- 主要導線（ブログ -> サービス -> App Store）の計測確認

## 7. リスクと対策

- API設計との実装乖離: フェーズ1で`docs/04_api.md`レビューを実施し、差分を潰す。
- コンテンツ不足: フェーズ3で初期10本を並行作成する。
- SEO品質不足: フェーズ4で構造化データ検証を必須ゲートにする。
- パフォーマンス不足: フェーズ5で画像・フォント・JS最適化を実施する。

## 8. リリース判定ゲート

- [ ] `docs/01_requirements.md` の受け入れ基準を全て満たす
- [ ] 重大なレイアウト崩れ・リンク切れがない
- [ ] `sitemap.xml` / `robots.txt` / `llms.txt` が公開確認できる
- [ ] PageSpeed Insights 90点以上を確認できる
