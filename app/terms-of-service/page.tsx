import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";
import { createBreadcrumbListJsonLd, createWebPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "利用規約",
  description: "開運ルナカレンダーの利用規約です。",
  alternates: {
    canonical: `${getSiteUrl()}/terms-of-service`
  }
};

export default function TermsOfServicePage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/terms-of-service`;
  const webPageJsonLd = createWebPageJsonLd({
    name: "利用規約",
    description: "開運ルナカレンダーの利用規約",
    url: pageUrl
  });
  const breadcrumbJsonLd = createBreadcrumbListJsonLd([
    { name: "ホーム", url: siteUrl },
    { name: "利用規約", url: pageUrl }
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
      <h1>利用規約</h1>
      <p>最終更新日: 2026年2月20日</p>
      <p>
        本利用規約（以下「本規約」）は、西山明宏（以下「当方」）が提供する開運ルナカレンダー（以下「本アプリ」）の
        利用条件を定めるものです。本アプリをご利用いただくことにより、本規約に同意したものとみなします。
      </p>

      <h2>第1条（適用）</h2>
      <p>本規約は、ユーザーと当方との間の本アプリの利用に関わる一切の関係に適用されます。</p>

      <h2>第2条（サービス内容）</h2>
      <p>本アプリは以下の機能を提供します。</p>
      <ul>
        <li>カードを用いた毎日のガイド表示</li>
        <li>暦情報（六曜、月齢、ボイドタイム等）の表示</li>
        <li>予定管理機能およびGoogleカレンダー同期機能</li>
      </ul>

      <h2>第3条（料金・サブスクリプション）</h2>
      <p>
        本アプリには無料プランと有料サブスクリプション（満月プラン）があります。有料プランの価格・期間は
        アプリ内表示およびApp Storeの購入画面に従います。
      </p>
      <ul>
        <li>支払いは購入確認時にApple IDへ請求されます</li>
        <li>更新日の24時間以上前に解約しない限り自動更新されます</li>
        <li>更新日前24時間以内に更新料金が請求されます</li>
        <li>解約・管理はApp Storeアカウント設定から行えます</li>
      </ul>

      <h2>第4条（情報・アドバイスに関する免責）</h2>
      <p>
        本アプリで提供されるカード、運勢情報、アドバイスは参考情報であり、医療・法律・金融等の専門的助言に
        代わるものではありません。本アプリの情報に基づく判断や行動について、当方は責任を負いません。
      </p>

      <h2>第5条（禁止事項）</h2>
      <p>ユーザーは、以下の行為を行ってはなりません。</p>
      <ul>
        <li>不正アクセスやサーバーへの過負荷行為</li>
        <li>本アプリのリバースエンジニアリング</li>
        <li>本アプリのコンテンツの無断転載・商用利用</li>
        <li>他のユーザーへの迷惑行為</li>
        <li>その他、当方が不適切と判断する行為</li>
      </ul>

      <h2>第6条（サービスの変更・停止）</h2>
      <p>
        当方は、事前の通知なく本アプリの内容を変更、または提供を停止することがあります。これによりユーザーに
        生じた損害について、当方は責任を負いません。
      </p>

      <h2>第7条（免責事項）</h2>
      <ul>
        <li>
          本アプリの利用により生じた損害について、当方は故意または重大な過失がある場合を除き責任を負いません
        </li>
        <li>通信障害、システム障害等による本アプリの利用不能について、当方は責任を負いません</li>
      </ul>

      <h2>第8条（準拠法・管轄裁判所）</h2>
      <p>
        本規約の解釈は日本法に準拠し、本アプリに関する紛争については、福岡地方裁判所を第一審の専属的合意管轄
        裁判所とします。
      </p>

      <h2>第9条（規約の変更）</h2>
      <p>
        当方は、必要と判断した場合に本規約を変更することがあります。変更後の規約は、本ページに掲示した時点から
        効力を生じます。
      </p>

      <h2>お問い合わせ</h2>
      <p>本規約に関するお問い合わせは、以下までご連絡ください。</p>
      <p>
        メール: <a href="mailto:pugwriting@gmail.com">pugwriting@gmail.com</a>
      </p>
    </article>
  );
}
