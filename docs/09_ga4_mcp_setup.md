# GA4 MCP セットアップ手順

このリポジトリでは、`Google Analytics MCP` を次の構成で使います。

- 実行スクリプト: `scripts/run-ga4-mcp.sh`
- 設定ファイル: `.ga4-mcp.env`（Git管理外）
- Codex設定: `~/.codex/config.toml` の `mcp_servers.ga4_mcp`

## 1. 認証情報を設定する

`.ga4-mcp.env` を開いて、次の2つを実値に変更します。

```env
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/your-google-adc-or-service-account.json
GOOGLE_PROJECT_ID=your-google-cloud-project-id
```

## 2. Codexを再起動する

`~/.codex/config.toml` の読み込みのため、Codexを再起動します。

## 3. 動作確認する

CodexでMCPサーバー一覧を確認し、`ga4_mcp` が表示されることを確認します。
