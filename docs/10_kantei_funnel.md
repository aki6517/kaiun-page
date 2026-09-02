# 鑑定ファネル（無料AI鑑定→有料詳細鑑定書¥2,000）— Phase 0 調査記録

作成: 2026-08-26（せお）／実装計画の正本: `~/.claude/plans/seo-ai-line-glimmering-popcorn.md`

## 決済プロバイダの裏取り結果（2026-08-26 Web実査）

### 結論: PayPal を採用（第一候補）、BASE をバックアップとする

| 候補 | 判定 | 根拠 |
|---|---|---|
| Stripe | **採用不可（確定）** | 公式の禁止業種リストの「管轄区域固有の禁止業種（日本）」に**「サイキックサービス / 占い師」が明記**。事業成長後の凍結・売上差し押さえリスクが業界記事でも複数報告 |
| PayPal | **採用（第一候補）** | 利用規定ポリシー（AUP）に占い・鑑定・サイキック・スピリチュアルの禁止/事前承認記載**なし**（PDF原文確認）。事前承認カテゴリ（ギャンブル・仮想通貨・成人向け等）にも非該当。業界記事でも「占い・スピリチュアル系はStripe不可のためPayPalが実運用の受け皿」との報告 |
| BASE | バックアップ | 販売禁止リストに占い関連の記載なし＝販売可。ただし**無形サービスは「有形の証明物（お礼状等）を追跡可能な配送で郵送」が必須条件**＝毎注文の郵送運用が発生し自動化に不向き。デジタルコンテンツAppでのPDF販売は可能性があるが、注文Webhookでの自動解放は弱い |

### 証跡URL
- Stripe禁止業種（公式）: https://stripe.com/jp/legal/restricted-businesses — 日本の禁止業種に「サイキックサービス / 占い師」
- PayPal利用規定ポリシー（公式）: https://www.paypal.com/jp/legalhub/acceptableuse-full ／ PDF原文: https://www.paypalobjects.com/webstatic/ja_JP/ua/pdf/ints/acceptableuse.pdf — 占い関連の記載なし
- BASE 無形商品の販売条件（公式ヘルプ）: https://help.thebase.in/hc/ja/articles/115000041462 — 有形の証明物の追跡配送が必須
- BASE 販売不可・登録禁止商品（公式ヘルプ）: https://help.thebase.in/hc/ja/articles/115000047621 — 占い関連の記載なし
- 業界動向（Stripe不可→PayPal実運用）: https://joylifepc.net/payment/

### PayPal採用時の設計
- PayPalビジネスアカウント + Orders API（Checkout）+ Webhook `PAYMENT.CAPTURE.COMPLETED` で `paid=true` 自動解放
- 注文の `custom_id` に結果ページのトークン（UUID）を埋めて照合
- 手数料: 国内標準 3.6% + 40円/件（¥2,000 → 手取り約¥1,888）
- **残リスクと対策**: PayPalは売上急増時にアカウント審査・一時保留が入ることがある → 売上が伸び始めたら事前にPayPalへ事業内容・見込み売上を連絡。AI鑑定の開示・明朗会計・特商法整備はアカウント健全性の面でも有効

## 2026-09-03 生成AIの変更（西山くん決定）

Gemini API → **Claude Code headless（サブスク内・ローカルワーカー方式）** に変更。理由=鑑定書は文章商品であり日本語の質を最優先＋サブスク内でコスト0円。トレードオフとして即時お届けを捨て「24時間以内にメールでお届け」表記に（受付完了メールは即時自動返信）。ワーカー=`~/dev/luna-kantei-worker/`（iCloud外）＋launchd。GEMINI_API_KEYの準備は不要になった。スケール時はClaude API従量課金へ切替検討。

## Phase 0 残タスク（西山くん側の作業が必要なもの）
- [ ] PayPalビジネスアカウント（既存の有無確認→なければ開設。屋号・事業内容は「デジタルコンテンツ（AI鑑定書）販売」で正直に登録）
- [ ] Supabaseプロジェクト作成（テーブル定義は計画正本に記載）
- [ ] Resendアカウント + kaiun-calendar.com のDNS認証（SPF/DKIM/DMARC）
- [ ] Gemini APIキー発行
- [ ] Vercel環境変数の登録（Production/Preview）
- [ ] 過去の実物鑑定書（紗々・マグダレナ）の場所を共有 → 鑑定書プロンプトの型に
