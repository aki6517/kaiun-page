import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";
import { createBreadcrumbListJsonLd, createWebPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description: "開運ルナカレンダーの特定商取引法に基づく表記です。",
  alternates: {
    canonical: `${getSiteUrl()}/commercial-transactions`
  }
};

export default function CommercialTransactionsPage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/commercial-transactions`;
  const webPageJsonLd = createWebPageJsonLd({
    name: "特定商取引法に基づく表記",
    description: "開運ルナカレンダーの特定商取引法に基づく表記",
    url: pageUrl
  });
  const breadcrumbJsonLd = createBreadcrumbListJsonLd([
    { name: "ホーム", url: siteUrl },
    { name: "特定商取引法に基づく表記", url: pageUrl }
  ]);

  const rows: { label: string; value: string }[] = [
    { label: "販売事業者", value: "西山明宏" },
    { label: "運営統括責任者", value: "西山明宏" },
    { label: "所在地", value: "ご請求をいただいた場合、遅滞なく開示いたします。" },
    { label: "電話番号", value: "ご請求をいただいた場合、遅滞なく開示いたします。" },
    { label: "メールアドレス", value: "pugwriting@gmail.com" },
    { label: "販売URL", value: "https://www.kaiun-calendar.com/" },
    {
      label: "販売価格",
      value:
        "満月プラン：月額480円／年額4,800円（いずれも税込）。新月プラン：無料。最新の価格はApp Storeの購入画面に表示されます。"
    },
    {
      label: "商品代金以外の必要料金",
      value: "インターネット接続にかかる通信料はお客様のご負担となります。"
    },
    { label: "支払方法", value: "Apple App Store経由（Apple IDへの課金）。" },
    {
      label: "支払時期",
      value: "購入手続き完了時にお支払いとなります。自動更新サブスクリプションは各更新日に請求されます。"
    },
    { label: "役務の提供時期", value: "購入手続き完了後、ただちにご利用いただけます。" },
    {
      label: "返品・キャンセルについて",
      value:
        "デジタルコンテンツの性質上、購入後の返金は原則としてお受けできません。サブスクリプションの解約はApp Storeのアカウント設定からいつでも可能で、解約後は次回更新日以降の課金が停止されます。"
    },
    { label: "動作環境", value: "iOS（App Store経由で配信）。" }
  ];

  return (
    <article className="prose prose-invert max-w-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <h1>特定商取引法に基づく表記</h1>
      <p>
        本表記は、特定商取引法に基づき、開運ルナカレンダー（以下「本サービス」）に関する事項を記載するものです。
        所在地および電話番号は、お客様からのご請求に応じて遅滞なく開示いたします。お問い合わせは下記メールアドレス
        までご連絡ください。
      </p>
      <table>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" style={{ whiteSpace: "nowrap", verticalAlign: "top", textAlign: "left" }}>
                {row.label}
              </th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
