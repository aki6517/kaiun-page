import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site";

const faqItems = [
  {
    question: "無料で使えますか？",
    answer: "基本機能は無料で利用できます。より深い分析や同期機能は有料プランで提供しています。"
  },
  {
    question: "どんな人に向いていますか？",
    answer:
      "日々の予定管理に加えて、運気の流れや意思決定のタイミングも意識したい方に向いています。"
  },
  {
    question: "ブログ記事はどう活用すればいいですか？",
    answer:
      "暦やタロットの基礎知識を学びつつ、今日の運勢画面と合わせて行動計画を立てる使い方がおすすめです。"
  }
] as const;

export const metadata: Metadata = {
  title: "開運カレンダー アプリ【ルナ】運がいい日がわかるカレンダー2026｜月×タロットで毎日の運勢",
  description:
    "月の満ち欠けとタロットを組み合わせて、毎日の運勢・吉日・行動のヒントを提供する開運カレンダーアプリ。",
  alternates: {
    canonical: `${getSiteUrl()}/`
  }
};

export default function HomePage() {
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "開運ルナカレンダー",
    operatingSystem: "iOS",
    applicationCategory: "LifestyleApplication",
    offers: [
      { "@type": "Offer", price: "0", priceCurrency: "JPY", name: "新月プラン" },
      { "@type": "Offer", price: "480", priceCurrency: "JPY", name: "満月プラン（月額）" }
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      ratingCount: "100"
    }
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };

  return (
    <div className="space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="space-y-6 rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(200,168,124,0.24),_rgba(13,11,20,0.8))] p-8 md:p-12">
        <p className="text-xs uppercase tracking-[0.24em] text-[#C8A87C]">
          月の満ち欠け × タロット × カレンダー
        </p>
        <h1 className="max-w-4xl text-3xl font-bold leading-tight md:text-5xl">
          開運カレンダー アプリ【ルナ】<br className="hidden md:block" />
          運がいい日がひと目でわかる
        </h1>
        <p className="max-w-3xl text-base leading-8 text-[#D1CCDF]">
          今日の運勢、吉日、タロットのメッセージを1画面で確認。忙しい毎日でも迷わない選択を支える、iOS向け開運カレンダーです。
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://apps.apple.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#C8A87C]/40 bg-[#C8A87C]/15 px-6 py-3 text-sm font-semibold text-[#E8E4F0]"
          >
            App Storeで見る
          </a>
          <Link
            href="/blog"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-[#B8B3C4]"
          >
            ブログ記事を読む
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold md:text-3xl">主な機能</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold">今日の運勢</h3>
            <p className="mt-2 text-sm leading-7 text-[#B8B3C4]">
              月齢とタロットから、その日の行動指針を提案します。
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold">開運カレンダー</h3>
            <p className="mt-2 text-sm leading-7 text-[#B8B3C4]">
              吉日・凶日を見ながら予定を組み立てられます。
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold">Googleカレンダー連携</h3>
            <p className="mt-2 text-sm leading-7 text-[#B8B3C4]">
              有料プランでは予定同期で意思決定をさらに効率化できます。
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-bold">料金プラン</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/15 bg-[#141122] p-5">
            <p className="text-sm text-[#C8A87C]">新月プラン</p>
            <p className="mt-1 text-3xl font-bold">無料</p>
            <p className="mt-3 text-sm text-[#B8B3C4]">基本機能で毎日の運勢をチェック</p>
          </div>
          <div className="rounded-xl border border-[#C8A87C]/40 bg-[#141122] p-5">
            <p className="text-sm text-[#C8A87C]">満月プラン</p>
            <p className="mt-1 text-3xl font-bold">¥480 / 月</p>
            <p className="mt-3 text-sm text-[#B8B3C4]">
              全機能開放 + Googleカレンダー連携 + 詳細分析
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">よくある質問</h2>
        <div className="space-y-3">
          {faqItems.map((item) => (
            <details key={item.question} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer font-semibold">{item.question}</summary>
              <p className="mt-3 text-sm leading-7 text-[#B8B3C4]">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        <h2 className="text-2xl font-bold">毎日の意思決定に、運勢のヒントを。</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#B8B3C4]">
          ブログでは「開運カレンダー アプリ」活用法を随時更新しています。運の流れを整える習慣を、今日から始めましょう。
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a
            href="https://apps.apple.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#C8A87C]/40 bg-[#C8A87C]/15 px-6 py-3 text-sm font-semibold text-[#E8E4F0]"
          >
            App Storeでダウンロード
          </a>
          <Link
            href="/blog"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-[#B8B3C4]"
          >
            ブログ一覧へ
          </Link>
        </div>
      </section>
    </div>
  );
}
