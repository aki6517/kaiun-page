# API設計書

## 1. API設計方針

- 本サイトはSSG中心の公開サイトであり、MVPではAPI依存を最小化する。
- 公開配信用のRoute Handler（`/sitemap.xml`、`/robots.txt`、`/llms.txt`、`/llms-full.txt`）をAPIとして扱う。
- `/api/*` 配下は運用用エンドポイントのみを配置し、`robots.txt` でクロール対象外にする。
- 例外時のJSONレスポンスは共通形式で返す。

## 2. 共通仕様

### 2.1 ベースURL

- 本番: `https://{domain}`
- 開発: `http://localhost:3000`

### 2.2 共通エラーフォーマット（JSON）

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Unexpected server error"
  }
}
```

### 2.3 ステータスコード方針

- `200`: 正常
- `400`: パラメータ不正
- `401`: 認証失敗
- `404`: 対象なし
- `429`: レート制限
- `500`: サーバー内部エラー

## 3. APIエンドポイント一覧

| 区分 | メソッド | パス | 用途 | MVP |
|---|---|---|---|---|
| 公開配信 | GET | `/sitemap.xml` | クローラ向けサイトマップ配信 | 対応 |
| 公開配信 | GET | `/robots.txt` | クロール制御配信 | 対応 |
| 公開配信 | GET | `/llms.txt` | LLM向け概要配信 | 対応 |
| 公開配信 | GET | `/llms-full.txt` | LLM向け拡張情報配信 | 対応 |
| 運用API | GET | `/api/health` | ヘルスチェック | 対応 |
| 運用API | POST | `/api/revalidate` | キャッシュ再検証（将来拡張） | 将来対応 |

## 4. エンドポイント詳細

### 4.1 GET `/sitemap.xml`

- **説明**: 公開ページのURL一覧をXMLで返す。
- **認証**: 不要
- **レスポンス形式**: `application/xml; charset=utf-8`
- **キャッシュ方針**: `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`

#### リクエスト

- クエリ/ボディなし

#### レスポンス（200）

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-02-16</lastmod>
  </url>
</urlset>
```

#### エラー時（500）

```json
{
  "error": {
    "code": "SITEMAP_GENERATION_FAILED",
    "message": "Failed to generate sitemap"
  }
}
```

### 4.2 GET `/robots.txt`

- **説明**: クローラ向けルールをテキストで返す。
- **認証**: 不要
- **レスポンス形式**: `text/plain; charset=utf-8`
- **キャッシュ方針**: `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`

#### リクエスト

- クエリ/ボディなし

#### レスポンス（200）

```txt
User-agent: *
Disallow: /api/
Allow: /

Sitemap: https://example.com/sitemap.xml
```

#### エラー時（500）

```json
{
  "error": {
    "code": "ROBOTS_GENERATION_FAILED",
    "message": "Failed to generate robots.txt"
  }
}
```

### 4.3 GET `/llms.txt`

- **説明**: LLM向けサイト概要・主要リンク情報を返す。
- **認証**: 不要
- **レスポンス形式**: `text/plain; charset=utf-8`
- **キャッシュ方針**: `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`

#### リクエスト

- クエリ/ボディなし

#### レスポンス（200）

```txt
# 開運ルナカレンダー

> 月の満ち欠け × タロットカードで毎日の運勢がわかるiOSアプリ。
```

#### エラー時（500）

```json
{
  "error": {
    "code": "LLMS_GENERATION_FAILED",
    "message": "Failed to generate llms.txt"
  }
}
```

### 4.4 GET `/llms-full.txt`

- **説明**: `llms.txt`拡張版。ブログ記事タイトル・要約を含む。
- **認証**: 不要
- **レスポンス形式**: `text/plain; charset=utf-8`
- **キャッシュ方針**: `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`

#### リクエスト

- クエリ/ボディなし

#### レスポンス（200）

```txt
# 開運ルナカレンダー (Full)

## ブログ記事
- 大アルカナ22枚の意味一覧...
```

#### エラー時（500）

```json
{
  "error": {
    "code": "LLMS_FULL_GENERATION_FAILED",
    "message": "Failed to generate llms-full.txt"
  }
}
```

### 4.5 GET `/api/health`

- **説明**: サービス稼働確認用のヘルスチェック。
- **認証**: 不要（外部監視を想定）
- **レスポンス形式**: `application/json`
- **インデックス方針**: `robots.txt` で `/api/` を除外

#### リクエスト

- クエリ/ボディなし

#### レスポンス（200）

```json
{
  "status": "ok",
  "timestamp": "2026-02-16T00:00:00.000Z",
  "version": "1.0.0"
}
```

#### エラー時（500）

```json
{
  "error": {
    "code": "HEALTH_CHECK_FAILED",
    "message": "Health check failed"
  }
}
```

### 4.6 POST `/api/revalidate`（将来拡張）

- **説明**: コンテンツ更新時に指定パスの再検証を行う。
- **認証**: 必須（`x-revalidate-token`）
- **レスポンス形式**: `application/json`
- **利用タイミング**: DB/CMS導入後の運用で利用

#### リクエスト

```json
{
  "paths": ["/blog/", "/blog/tarot-card-meanings-major-arcana/"],
  "reason": "content_updated"
}
```

#### レスポンス（200）

```json
{
  "revalidated": true,
  "count": 2
}
```

#### エラー時（401/400/500）

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid revalidate token"
  }
}
```

## 5. 認証・認可

### 5.1 MVP

- 公開配信エンドポイント（`/sitemap.xml`、`/robots.txt`、`/llms.txt`、`/llms-full.txt`）は認証なし。
- `/api/health` は認証なし（監視用途）。
- 現時点でユーザー認証（ログイン機能）は導入しない。

### 5.2 将来拡張

- `/api/revalidate` は `x-revalidate-token` によるサーバー間認証を採用。
- 将来の管理系APIは `Authorization: Bearer <token>` を基本とし、最小権限でロールを分離する。
- APIシークレットは `.env.local` / Vercel Environment Variables で管理する。

## 6. エラーハンドリング・運用方針

- 例外時は`code`を固定値で返し、監視で検知できるようにする。
- 500系エラーはVercelログに詳細を残し、レスポンスには機密情報を含めない。
- `/api/revalidate`（将来）はIP制限またはレート制限（`429`）を適用する。

## 7. 実装マッピング（Next.js App Router）

| パス | 実装ファイル | 備考 |
|---|---|---|
| `/sitemap.xml` | `app/sitemap.ts` | MetadataRouteで生成 |
| `/robots.txt` | `app/robots.ts` | MetadataRouteで生成 |
| `/llms.txt` | `app/llms.txt/route.ts` | Route Handler |
| `/llms-full.txt` | `app/llms-full.txt/route.ts` | Route Handler |
| `/api/health` | `app/api/health/route.ts` | Route Handler |
| `/api/revalidate` | `app/api/revalidate/route.ts` | 将来拡張 |

## 8. 受け入れ基準

- [ ] 上記MVP対象エンドポイントがHTTP 200で応答する
- [ ] `robots.txt` に `Disallow: /api/` と `Sitemap` が含まれる
- [ ] `sitemap.xml` に主要公開ページが含まれる
- [ ] `llms.txt` / `llms-full.txt` にアクセスできる
- [ ] APIエラー時レスポンスが共通フォーマットに準拠する
