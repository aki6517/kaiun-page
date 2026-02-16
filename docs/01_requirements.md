# 開運ルナカレンダー LP・ブログサイト 要件定義書

## 1. プロジェクト概要

### 1.1 目的
開運カレンダーアプリ「ルナ」のサービスサイトを構築する。現在の単一HTMLランディングページを、SEO集客可能なブログ付きサイトへ拡張し、「開運カレンダー アプリ」関連キーワードでのオーガニック流入を獲得する。

### 1.2 ターゲットユーザー
- **プライマリ**: 30〜50代女性（会社員、フリーランス、主婦、ママ）
- **セカンダリ**: 占い・開運・タロットに関心のある全年齢層

### 1.3 運営者
個人開発（西山明宏）

### 1.4 解決する課題
- 現在の単一HTMLページではSEO集客に限界がある
- ブログコンテンツがないため、ロングテールキーワードでの流入が取れない
- 構造化マークアップ未実装のため、リッチリザルト表示の機会を逃している
- LLM経由でのサイト情報提供（llms.txt）に未対応

---

## 2. 技術要件

### 2.1 技術スタック

#### フロントエンド
- **Next.js 15** (App Router)
  - Static Site Generation (SSG) でブログ記事を事前生成
  - サービスページ（現LP）もSSGで高速配信
  - Image Optimization（next/image）
- **TypeScript**: 型安全性
- **Tailwind CSS v4**: ユーティリティファーストCSS
- **React 19**: UIライブラリ

#### コンテンツ管理
- **MDX（Markdown + JSX）**: ブログ記事をGitリポジトリで管理
  - `content/blog/` ディレクトリにMDXファイルを配置
  - frontmatterでメタデータ管理（title, description, date, tags, category等）
  - next-mdx-remote または contentlayer2 で読み込み

#### インフラ
- **Vercel**: Next.jsホスティング（Hobbyプラン: ¥0/月）
- **Cloudflare**: DNS + CDN（無料）
- **SSL/TLS証明書**: Vercelが自動提供（Let's Encrypt）
- **独自ドメイン**: 取得予定（luna-calendar.com 等）

#### 開発ワークフロー
- **Git**: バージョン管理（GitHub）
- **GitHub Actions**: CI/CD（Lint、ビルドチェック）
- **Vercel自動デプロイ**: `git push` → 自動ビルド → デプロイ

#### 月額コスト
| 項目 | 月額 |
|------|------|
| Vercel Hobby | ¥0 |
| Cloudflare Free | ¥0 |
| ドメイン | ¥100-150 |
| **合計** | **¥100-150/月** |

### 2.2 Google SEO準拠要件（最重要）

#### 2.2.1 サイト構造
論理的な階層構造（3階層以内）：
```
/ (トップ = サービスページ、現在のLP)
├── /blog/ (ブログ一覧)
│   ├── /blog/category/[category]/ (カテゴリ別一覧)
│   └── /blog/[slug]/ (ブログ記事詳細)
├── /privacy-policy/ (プライバシーポリシー)
├── /llms.txt (LLM向け情報ファイル)
├── /robots.txt
└── /sitemap.xml
```

**設計方針**:
- トップページ（`/`）= 現在のLPをそのままサービスページとして配置
- ブログは `/blog/` 配下に集約、カテゴリ分類あり
- 階層はシンプルに保つ（最大3階層）

#### 2.2.2 URL設計規則（Google推奨）
- シンプルで意味のある英語単語を使用
- ハイフン（`-`）で区切る（アンダースコアは不可）
- 全て小文字
- パラメータは最小限
- 例: `/blog/tarot-card-meanings-major-arcana/`
- **slugの一意性**: 全記事で一意であること

#### 2.2.3 構造化マークアップ（Schema.org）
すべてのページに適切なJSON-LD形式の構造化データを実装：

1. **トップページ（サービスページ）**:
   - **WebSite Schema**: サイト情報
   - **Organization Schema**: 運営者情報
   - **SoftwareApplication Schema**: アプリ情報
   ```json
   {
     "@context": "https://schema.org",
     "@type": "SoftwareApplication",
     "name": "開運ルナカレンダー",
     "operatingSystem": "iOS",
     "applicationCategory": "LifestyleApplication",
     "offers": [
       {
         "@type": "Offer",
         "price": "0",
         "priceCurrency": "JPY",
         "name": "新月プラン"
       },
       {
         "@type": "Offer",
         "price": "480",
         "priceCurrency": "JPY",
         "name": "満月プラン（月額）"
       }
     ],
     "aggregateRating": {
       "@type": "AggregateRating",
       "ratingValue": "4.5",
       "ratingCount": "100"
     }
   }
   ```

2. **ブログ記事ページ**: Article Schema
   ```json
   {
     "@context": "https://schema.org",
     "@type": "Article",
     "headline": "記事タイトル",
     "datePublished": "2026-02-16",
     "dateModified": "2026-02-16",
     "author": {
       "@type": "Person",
       "name": "ルナ編集部"
     },
     "publisher": {
       "@type": "Organization",
       "name": "開運ルナカレンダー"
     }
   }
   ```

3. **パンくずリスト**: BreadcrumbList Schema（全ページ）

4. **FAQ**: FAQPage Schema（トップページのFAQセクション）

#### 2.2.4 HTML最適化
1. **タイトルタグ**:
   - 各ページ固有、60文字以内
   - 主要キーワードを前方に配置
   - トップ: `開運カレンダー アプリ【ルナ】運がいい日がわかるカレンダー2026｜月×タロットで毎日の運勢`
   - ブログ: `[記事タイトル] | 開運ルナカレンダー`

2. **メタディスクリプション**:
   - 各ページ固有、155文字以内
   - アクションを促す文言を含む

3. **セマンティックHTML**:
   - 見出しタグ（h1〜h6）の論理的な階層
   - h1は1ページに1つ
   - `<article>`, `<section>`, `<nav>`, `<aside>` の適切な使用

4. **画像最適化**:
   - すべての画像に`alt`属性
   - WebP / AVIF 形式（next/image で自動変換）
   - `loading="lazy"`の適用（ファーストビュー外）
   - レスポンシブ画像（`srcset`, `sizes`）
   - width/height 属性を必ず指定（CLS防止）

5. **headタグの有効性**:
   - `<title>`, `<meta>`, `<link>`, `<script>`, `<style>`のみ
   - 無効な要素を配置しない

#### 2.2.5 リンク構造
1. **クロール可能なリンク**:
   - すべてのリンクは`<a href="">`形式（Next.js `<Link>`）
   - JavaScriptのみのリンクは不可
   - フラグメント（`#`）をルーティングに使用しない

2. **内部リンク**:
   - ブログ記事間の相互リンク
   - 記事からサービスページへの適切な導線
   - 関連記事リンク

3. **外部リンク**:
   - App Storeリンク: `rel="noopener"`
   - 参考サイトリンク: `rel="noopener noreferrer"`

#### 2.2.6 パフォーマンス最適化
**目標**: PageSpeed Insights スコア 90点以上（モバイル/デスクトップ）

1. **画像最適化**:
   - next/image による自動WebP変換・リサイズ
   - lazy loading
   - placeholder blur

2. **CSS/JS最適化**:
   - Tailwind CSSのパージ（未使用CSS除去）
   - Next.jsのコード分割（自動）
   - クリティカルCSSのインライン化

3. **キャッシュ設定**:
   - Vercel CDNキャッシュ（静的アセット）
   - Next.js のISR/SSGキャッシュ

4. **フォント最適化**:
   - next/font でGoogle Fontsを最適読み込み
   - `font-display: swap`
   - サブセット化

#### 2.2.7 クロール・インデックス最適化
1. **robots.txt**:
   ```
   User-agent: *
   Disallow: /api/
   Allow: /

   Sitemap: https://[domain]/sitemap.xml
   ```

2. **XMLサイトマップ**:
   - Next.js の `app/sitemap.ts` で自動生成
   - 全ページを含む
   - 優先度、更新頻度の設定

3. **canonicalタグ**:
   - すべてのページに正規URLを指定（Next.js Metadata APIで管理）

4. **noindexタグ**:
   - APIエンドポイント（`/api/`）のみ

### 2.3 llms.txt 対応

#### 2.3.1 概要
[llms.txt仕様](https://llmstxt.org/)に準拠し、LLM（大規模言語モデル）がサイト情報を効率的に取得できるファイルを提供する。

#### 2.3.2 ファイル構成
1. **`/llms.txt`**（必須）: サイト概要 + 主要ページリンク
   ```markdown
   # 開運ルナカレンダー

   > 月の満ち欠け × タロットカードで「今日のあなたの運勢」がわかる開運カレンダーアプリ。
   > 30〜50代女性の日常の意思決定をサポートする、iOS向け無料アプリです。

   ## アプリ情報
   - [サービスページ](https://[domain]/): アプリの機能紹介・料金プラン・ダウンロード
   - [プライバシーポリシー](https://[domain]/privacy-policy/): 個人情報の取り扱い

   ## プラン
   - 新月プラン（無料）: 開運カレンダー、毎日の開運メッセージ（初回のみ）、タロット運勢（初回のみ）
   - 満月プラン（¥480/月・¥4,800/年）: 全機能無制限、Googleカレンダー同期

   ## ブログ記事
   - [ブログ一覧](https://[domain]/blog/): 開運・暦・タロットに関する記事

   ## Optional
   - [App Store](https://apps.apple.com/...): iOSアプリダウンロード
   ```

2. **`/llms-full.txt`**（オプション）: 全ブログ記事の要約を含む拡張版
   - ビルド時に自動生成（全MDXファイルからタイトル・要約を抽出）

#### 2.3.3 実装方法
- Next.js の `app/llms.txt/route.ts` で動的生成（または `public/llms.txt` に静的配置）
- llms-full.txt はビルドスクリプトで自動生成

---

## 3. 機能要件

### 3.1 サービスページ（トップ: `/`）

#### 3.1.1 既存LP移行
現在の `index.html` の内容をNext.jsのトップページとして移行：
- ヒーローセクション
- 課題提起セクション
- 解決策セクション
- 機能紹介セクション
- 使い方セクション
- お客様の声セクション
- 料金プランセクション（新月プラン / 満月プラン）
- FAQセクション
- 最終CTAセクション

**移行時の注意**:
- 現在のデザイン・トーンを完全に維持
- SVGアイコン、タロットカード画像もそのまま移行
- CSSカスタムプロパティベースのテーマを Tailwind に変換
- インラインSVG → コンポーネント化

#### 3.1.2 SEO強化（新規追加）
- JSON-LD構造化データ（SoftwareApplication, FAQPage, Organization, BreadcrumbList）
- OGP / Twitter Cardメタタグ
- canonical URL

#### 3.1.3 共通ヘッダー
- サイトロゴ（テキスト+SVG）
- ナビゲーション: ホーム / ブログ
- モバイル: ハンバーガーメニュー
- **シンプルに**: 最小限のナビ項目

#### 3.1.4 共通フッター
- サイトロゴ
- フッターナビ（ホーム / ブログ / プライバシーポリシー）
- App Storeリンク
- コピーライト

### 3.2 ブログ機能

#### 3.2.1 ブログ一覧ページ（`/blog/`）
1. **記事リスト**:
   - カード形式（アイキャッチ画像、タイトル、概要、日付、カテゴリ）
   - 新着順表示（デフォルト）
   - ページネーション（1ページ12件）

2. **カテゴリフィルター**:
   - タロット / 開運 / 暦・吉日 / 月の満ち欠け / 使い方ガイド

3. **サイドバー（デスクトップ）**:
   - カテゴリ一覧
   - 人気記事ランキング（任意: アクセス順）
   - アプリCTAバナー

#### 3.2.2 ブログ記事詳細ページ（`/blog/[slug]/`）
1. **パンくずリスト**: ホーム > ブログ > カテゴリ > 記事タイトル
2. **記事ヘッダー**:
   - タイトル（h1）
   - 公開日、更新日
   - カテゴリ、タグ
   - 目次（自動生成、h2/h3ベース）
3. **記事本文**: MDXレンダリング
4. **記事フッター**:
   - 関連記事（同カテゴリ3件）
   - アプリCTAバナー
   - SNSシェアボタン（X/Twitter、LINE）
5. **構造化データ**: Article Schema（JSON-LD）

#### 3.2.3 カテゴリ別一覧ページ（`/blog/category/[category]/`）
- カテゴリに属する記事を一覧表示
- ページネーション

#### 3.2.4 コンテンツ管理
- MDXファイルを `content/blog/` に配置
- frontmatter例:
  ```yaml
  ---
  title: "大アルカナ22枚の意味一覧｜初心者でもわかるタロットカード解説"
  description: "タロットカードの大アルカナ22枚の意味を初心者向けにわかりやすく解説。正位置・逆位置の意味、恋愛・仕事への活かし方も。"
  date: "2026-02-16"
  updated: "2026-02-16"
  category: "tarot"
  tags: ["タロット", "大アルカナ", "意味", "初心者"]
  image: "/blog/images/major-arcana-guide.webp"
  ---
  ```

### 3.3 固定ページ

#### 3.3.1 プライバシーポリシー（`/privacy-policy/`）
- 個人情報の取り扱い
- Cookie使用について
- Google Analyticsについて
- RevenueCat（決済）について

### 3.4 SEO初期コンテンツ計画

#### 3.4.1 ブログ記事（初期作成 10本）

**カテゴリ: タロット（tarot）**
1. 「大アルカナ22枚の意味一覧｜初心者でもわかるタロットカード解説」
2. 「タロットカードの正位置・逆位置とは？読み方の基本」
3. 「今日のタロット占い｜一枚引きの方法とカードの意味」

**カテゴリ: 開運（kaiun）**
4. 「開運カレンダーの使い方｜運がいい日の見つけ方2026」
5. 「開運日カレンダー2026年版｜天赦日・一粒万倍日・大安一覧」
6. 「開運アクション7選｜今日からできる運気アップの習慣」

**カテゴリ: 暦・吉日（koyomi）**
7. 「一粒万倍日とは？2026年カレンダーと過ごし方」
8. 「天赦日とは？2026年はいつ？最強開運日の活用法」

**カテゴリ: 月の満ち欠け（moon）**
9. 「月の満ち欠けと運勢の関係｜新月・満月の過ごし方」

**カテゴリ: 使い方ガイド（guide）**
10. 「開運カレンダーアプリ「ルナ」の使い方｜初めてガイド」

#### 3.4.2 SEOキーワード戦略
- **メインKW**: 開運カレンダー アプリ
- **サジェストKW**: 運がいい日がわかるカレンダーアプリ、運がいい日がわかるカレンダー2026
- **ロングテールKW**（ブログで狙う）:
  - タロットカード 意味 一覧
  - 大アルカナ 意味
  - 一粒万倍日 2026
  - 天赦日 2026
  - 開運日 カレンダー 2026
  - 月の満ち欠け 運勢
  - 今日の運勢 タロット

---

## 4. 非機能要件

### 4.1 パフォーマンス（Core Web Vitals）

**目標**: PageSpeed Insights スコア 90点以上（モバイル/デスクトップ）

#### 4.1.1 LCP (Largest Contentful Paint)
- **目標**: 2.5秒以内
- **施策**:
  - SSG による事前レンダリング（TTFB最小化）
  - next/image で画像最適化（WebP、適切なサイズ）
  - ヒーロー画像は `priority` 属性で優先読み込み
  - クリティカルCSSのインライン化
  - Vercel CDN による配信高速化

#### 4.1.2 INP (Interaction to Next Paint) ※FIDの後継指標
- **目標**: 200ミリ秒以内
- **施策**:
  - JavaScriptの最小化とコード分割（Next.js自動）
  - 重い処理をメインスレッドから分離
  - サードパーティスクリプト（GA4等）の遅延読み込み

#### 4.1.3 CLS (Cumulative Layout Shift)
- **目標**: 0.1以下
- **施策**:
  - すべての画像に `width` と `height` 属性
  - Webフォントは `font-display: swap` + next/font
  - 広告・埋め込みなし（CLSリスク排除）
  - 動的コンテンツは既存コンテンツの下に挿入

### 4.2 セキュリティ
- **SSL/TLS**: Vercel自動提供
- **環境変数**: `.env.local` で管理（GA4 ID等）
- **依存パッケージ**: `npm audit` で定期チェック
- **CSP (Content Security Policy)**: Next.js の middleware で設定

### 4.3 アクセシビリティ
- **WCAG 2.1 Level AA準拠**（可能な範囲）
- キーボードナビゲーション対応
- スクリーンリーダー対応（ARIAラベル）
- 色のコントラスト比: 4.5:1以上（本文）
- 現LPの薄文字（40後半〜50代向け改善済み）を維持

### 4.4 ブラウザ対応
- **デスクトップ**: Chrome, Firefox, Safari, Edge（各最新版+1つ前）
- **モバイル**: iOS Safari, Android Chrome（各最新版+1つ前）

---

## 5. デザイン要件

### 5.1 デザインコンセプト
**ミスティカル＆フェミニン** — 現LPの世界観を維持
- 深い紫〜紺のダークテーマ
- 月と星のモチーフ
- ゴールドのアクセントカラー
- やさしく神秘的な雰囲気

### 5.2 カラーパレット（現LPから継承）
- **背景**: `#0D0B14`（深い紫黒）
- **テキスト**: `#E8E4F0`（淡いラベンダー白）
- **テキスト（薄）**: `#B8B3C4`（ミューテッドラベンダー）
- **ゴールド**: `#C8A87C`（アンティークゴールド）
- **アクセント**: `#9B8EC4`（ラベンダー）

### 5.3 タイポグラフィ
- **見出し**: Noto Serif JP（明朝体、神秘的な雰囲気）
- **本文**: Noto Sans JP（ゴシック体、可読性重視）
- **ベースフォントサイズ**: 17px（40後半〜50代向け配慮）
- **本文行間**: 2.0
- **本文ウェイト**: 400（Regular、薄くしない）

### 5.4 ブログデザイン
- サービスページと統一したダークテーマ
- 記事本文は可読性を最優先（行間2.0、文字サイズ17px+）
- アイキャッチ画像はタロットカード画像やイラストを活用
- サイドバー: ダークカード形式

### 5.5 レスポンシブデザイン
- **モバイルファースト設計**
- ブレークポイント:
  - モバイル: `< 768px`
  - タブレット: `768px - 1024px`
  - デスクトップ: `> 1024px`

---

## 6. 内部SEO対策チェックリスト

### 6.1 テクニカルSEO
- [ ] XMLサイトマップ自動生成（`app/sitemap.ts`）
- [ ] robots.txt 設定
- [ ] canonical URL 全ページ設定
- [ ] 301リダイレクト設計（将来のURL変更時）
- [ ] 404ページカスタマイズ
- [ ] SSL/HTTPS 強制
- [ ] www/non-www 統一

### 6.2 構造化マークアップ
- [ ] トップページ: WebSite + SoftwareApplication + FAQPage + Organization + BreadcrumbList
- [ ] ブログ一覧: WebPage + BreadcrumbList
- [ ] ブログ記事: Article + BreadcrumbList
- [ ] プライバシーポリシー: WebPage + BreadcrumbList
- [ ] Google Rich Results Test で検証

### 6.3 Core Web Vitals
- [ ] LCP < 2.5秒
- [ ] INP < 200ms
- [ ] CLS < 0.1
- [ ] PageSpeed Insights モバイル 90点以上
- [ ] PageSpeed Insights デスクトップ 90点以上

### 6.4 オンページSEO
- [ ] 全ページにユニークなtitle + meta description
- [ ] h1は1ページに1つ
- [ ] 見出し階層の論理性（h1→h2→h3）
- [ ] 画像alt属性
- [ ] 内部リンクの適切な設置
- [ ] パンくずリスト

### 6.5 LLM対応
- [ ] `/llms.txt` 配置
- [ ] `/llms-full.txt` 自動生成（ビルド時）

### 6.6 アクセス解析
- [ ] Google Analytics 4 設置
- [ ] Google Search Console 登録
- [ ] サイトマップ送信

---

## 7. マイルストーン

### Phase 1: 設計・準備（1週間）
- [ ] 要件定義書作成（本ドキュメント）
- [ ] アーキテクチャ設計書作成
- [ ] サイトマップ設計書作成
- [ ] ドメイン取得
- [ ] Vercelアカウント作成
- [ ] GitHubリポジトリ作成

### Phase 2: 開発 — 基盤（1-2週間）
- [ ] Next.js 15 プロジェクト初期化
- [ ] Tailwind CSS v4 セットアップ
- [ ] 共通レイアウト（ヘッダー、フッター）
- [ ] 現LPのNext.js移行（トップページ）
- [ ] 構造化データ実装（JSON-LD）
- [ ] SEO基盤（Metadata API、sitemap.ts、robots.txt）
- [ ] llms.txt / llms-full.txt 実装

### Phase 3: 開発 — ブログ（1-2週間）
- [ ] MDXコンテンツ基盤構築
- [ ] ブログ一覧ページ
- [ ] ブログ記事詳細ページ
- [ ] カテゴリ別一覧ページ
- [ ] 目次自動生成
- [ ] 関連記事
- [ ] SNSシェアボタン
- [ ] OGP画像自動生成（任意）

### Phase 4: コンテンツ作成（1-2週間）
- [ ] 初期ブログ記事10本作成
- [ ] プライバシーポリシー作成
- [ ] アイキャッチ画像作成

### Phase 5: テスト・最適化（1週間）
- [ ] PageSpeed Insights テスト（90点以上目標）
- [ ] Core Web Vitals 検証
- [ ] Google Rich Results Test
- [ ] モバイル対応チェック
- [ ] ブラウザ互換性テスト
- [ ] リンク切れチェック

### Phase 6: リリース（数日）
- [ ] Vercel本番環境デプロイ
- [ ] カスタムドメイン設定
- [ ] Google Analytics 4 設定
- [ ] Google Search Console 登録・サイトマップ送信
- [ ] OGP確認（各SNSデバッガー）
- [ ] 公開

---

## 8. 運用・保守

### 8.1 コンテンツ更新ワークフロー
1. MDXファイルを `content/blog/` に新規作成
2. ローカルでプレビュー確認（`npm run dev`）
3. `git push` → Vercel自動デプロイ（1-2分）

### 8.2 定期メンテナンス
- **ブログ記事**: 週1本以上の新規記事
- **依存パッケージ**: 月次アップデート（`npm update`）
- **セキュリティスキャン**: 月次（`npm audit`）
- **パフォーマンスチェック**: 月次（PageSpeed Insights）
- **Search Console**: 週次チェック（インデックス状況、エラー）

### 8.3 分析・改善
- **Google Analytics 4**: 月次レポート
- **Google Search Console**: 週次（検索パフォーマンス、キーワード順位）
- **Core Web Vitals**: 月次モニタリング

---

## 9. 成功指標（KPI）

### 9.1 SEO指標
- **検索順位**: 「開運カレンダー アプリ」で10位以内（6ヶ月後）
- **オーガニック流入**: 月間1,000セッション（6ヶ月後）
- **PageSpeed Insights スコア**: 90点以上維持

### 9.2 ユーザーエンゲージメント
- **直帰率**: 60%以下
- **平均セッション時間**: 2分以上
- **ページビュー/セッション**: 2.0以上

### 9.3 コンバージョン
- **App Storeリンククリック**: 月間100クリック（6ヶ月後）
- **ブログ → サービスページ遷移率**: 15%以上

---

## 10. 受け入れ基準

- [ ] トップページ（現LP）がNext.jsで同等の見た目・機能で表示される
- [ ] ブログ一覧・記事詳細が正常に表示・ナビゲーションできる
- [ ] 全ページに構造化データ（JSON-LD）が実装されている
- [ ] Google Rich Results Testでエラーがない
- [ ] `/llms.txt` にアクセスできる
- [ ] `/sitemap.xml` が全ページを含む
- [ ] `/robots.txt` が正しく設定されている
- [ ] PageSpeed Insights モバイル 90点以上
- [ ] Core Web Vitals が全指標「Good」
- [ ] 全ページにcanonical URL、title、meta descriptionが設定されている
- [ ] レスポンシブ対応（モバイル・タブレット・デスクトップ）

---

**作成日**: 2026-02-16
**バージョン**: 1.0
**作成者**: Claude Code (AI Assistant)
