# 計測タグ設定ガイド（GA4 / GTM）

## 1. 画面の場所

- URL: `/settings/tracking-tags`（トップページにはリンクを表示していません）
- ここで `head` / `body開始` / `body終了` に入れるタグを編集できます。

## 2. アクセス制御（重要）

設定画面は保護されています。Vercelで下記2つを設定しない限り、URLにアクセスしても`404`になります。

- `TRACKING_ADMIN_USER`
- `TRACKING_ADMIN_PASSWORD`

設定すると、アクセス時にID/パスワード入力（Basic認証）が表示されます。

## 3. まずやること（最短手順）

1. GA4のID（`G-XXXXXXXXXX`）かGTMのID（`GTM-XXXXXXX`）を入力  
2. テンプレート適用ボタンを押す  
3. 「このブラウザに保存」を押す  

保存後、このブラウザでは即時反映されます。

## 4. 本番全ユーザーに反映する方法

Vercelの環境変数に以下を設定してください。

- `NEXT_PUBLIC_TRACKING_HEAD_TAGS`
- `NEXT_PUBLIC_TRACKING_BODY_START_TAGS`
- `NEXT_PUBLIC_TRACKING_BODY_END_TAGS`

設定後に再デプロイすると、全ユーザーに反映されます。

## 5. 注意点

- タグの貼り間違いは表示崩れの原因になります。
- 設定前後で `View Source` と計測ツールのデバッグ表示を確認してください。
- 運用開始後は、タグ変更履歴をスプレッドシート等に記録してください。
