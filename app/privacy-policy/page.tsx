import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";
import { createBreadcrumbListJsonLd, createWebPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "開運ルナカレンダーの個人情報保護方針と計測ツール利用に関するポリシーです。",
  alternates: {
    canonical: `${getSiteUrl()}/privacy-policy`
  }
};

export default function PrivacyPolicyPage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/privacy-policy`;
  const webPageJsonLd = createWebPageJsonLd({
    name: "プライバシーポリシー",
    description: "開運ルナカレンダーの個人情報保護方針",
    url: pageUrl
  });
  const breadcrumbJsonLd = createBreadcrumbListJsonLd([
    { name: "ホーム", url: siteUrl },
    { name: "プライバシーポリシー", url: pageUrl }
  ]);

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
      <h1>プライバシーポリシー</h1>
      <p>
        開運ルナカレンダー（以下「本サービス」）は、利用者のプライバシーを尊重し、
        個人情報保護に関する法令を遵守します。
      </p>
      <h2>取得する情報</h2>
      <ul>
        <li>アクセス解析のための匿名データ</li>
        <li>お問い合わせ時に提供される情報</li>
      </ul>
      <h2>利用目的</h2>
      <ul>
        <li>サービス改善</li>
        <li>不具合調査</li>
        <li>利用状況分析</li>
      </ul>
      <h2>外部サービス</h2>
      <p>
        Google Analytics 等の計測ツールを利用する場合があります。必要に応じてCookieが使用されます。
      </p>
      <h2>改定</h2>
      <p>本ポリシーは必要に応じて改定されます。改定後は本ページに掲載した時点で有効となります。</p>
    </article>
  );
}
