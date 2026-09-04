import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoonLock, SunriseEmblem } from "@/components/kantei/ornaments";
import { PayButtonSlot } from "@/components/kantei/pay-button-slot";
import { PrayerPage } from "@/components/kantei/prayer-page";
import { getPayPageState } from "@/lib/kantei/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "詳細鑑定書のお申し込み | 開運ルナカレンダー" },
  robots: {
    index: false,
    follow: false
  }
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type PayPageProps = {
  searchParams: Promise<{ t?: string | string[] }>;
};

const offerings = [
  { title: "恋愛運", description: "心のつながりと、これからの恋を見つめる頁" },
  { title: "金運", description: "お金との向き合い方を、静かに整える頁" },
  { title: "仕事運", description: "あなたらしい力の活かし方をたどる頁" },
  { title: "人間関係", description: "大切な人との距離を見つめ直す頁" },
  { title: "来年の運勢", description: "一年の流れを、あなただけの言葉でお渡しします" },
  { title: "あなたの月リズム", description: "月の満ち欠けとともに、自分の調子を知る頁" },
  { title: "開運アイテム", description: "開運カラー・パワーフード・ラッキースポット・開運行動" }
] as const;

export default async function KanteiPayPage({ searchParams }: PayPageProps) {
  const { t } = await searchParams;
  if (typeof t !== "string" || !UUID_PATTERN.test(t)) notFound();

  const state = await getPayPageState(t);
  if (!state) notFound();

  if (state.status === "pending" || (state.status === "generated" && state.artifact_ready_at === null)) {
    return <PayPageMessage>鑑定書を作成中です。完成しましたらメールでお届けしますので、しばらくお待ちください。</PayPageMessage>;
  }

  if (state.status === "failed") {
    return (
      <PayPageMessage>
        申し訳ありません。鑑定書をお作りすることができませんでした。お手数ですが sasha@kaiun-calendar.com までご連絡ください。
      </PayPageMessage>
    );
  }

  if (state.paid && state.paid_pdf_sent_at !== null) {
    return (
      <PayPageMessage>
        お支払いを確認しました。詳細鑑定書はメールでお届け済みです。届いていない場合は迷惑メールフォルダをご確認のうえ、ご連絡ください。
      </PayPageMessage>
    );
  }

  if (state.paid) {
    return <PayPageMessage>お支払いを確認しました。詳細鑑定書のお届けを準備しています。もう少しだけお待ちください。</PayPageMessage>;
  }

  return <PayPageContent name={state.name} />;
}

function PayPageMessage({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mx-auto max-w-2xl">
      <PrayerPage>
        <div className="text-center">
          <SunriseEmblem className="mx-auto w-36 text-[#B08A4F]" />
          <h1 className="mt-6 text-3xl font-bold tracking-[0.12em] text-[#B08A4F]">詳細鑑定書</h1>
          <p className="mx-auto mt-10 max-w-[34em] text-left text-base leading-8 text-[#4A3F3B]">{children}</p>
        </div>
      </PrayerPage>
    </div>
  );
}

function PayPageContent({ name }: { name: string }) {
  return (
    <div className="mx-auto max-w-3xl">
      <PrayerPage>
        <div className="text-center">
          <SunriseEmblem className="mx-auto w-36 text-[#B08A4F]" />
          <p className="mt-5 text-xs font-medium tracking-[0.12em] text-[#8A6A3B]">DETAIL READING</p>
          <h1 className="mt-5 text-balance text-3xl font-bold leading-[1.6] tracking-[0.12em] text-[#B08A4F] sm:text-4xl">
            まだ開かれていない頁を、あなたへ
          </h1>
          <MoonLock className="mx-auto mt-8 h-16 w-14 text-[#B7848C]" />
          <p className="mt-7 break-words text-xl font-bold leading-9 tracking-[0.08em] text-[#B08A4F] [overflow-wrap:anywhere]">
            {name}様の詳細鑑定書
          </p>
        </div>

        <section className="mt-12 border-y border-[#D9C08F] py-8">
          <h2 className="text-center text-2xl font-bold tracking-[0.12em] text-[#B08A4F]">お渡しするもの</h2>
          <ul className="mt-8 divide-y divide-[#D9C08F] text-left">
            {offerings.map((offering) => (
              <li key={offering.title} className="py-5">
                <h3 className="text-lg font-bold tracking-[0.08em] text-[#8A6A3B]">{offering.title}</h3>
                <p className="mt-2 text-base leading-8 text-[#4A3F3B]">{offering.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 text-center">
          <p className="text-2xl font-bold tracking-[0.1em] text-[#B08A4F]">詳細鑑定書　¥2,000（税込）</p>
          <p className="mt-7 text-left text-base leading-8 text-[#4A3F3B]">
            お支払いのあと、メールでPDFをお届けします。通常はすぐに届きます。
          </p>
          <p className="mt-4 text-left text-sm leading-7 text-[#4A3F3B]">
            デジタルコンテンツのため、お届け後の返金はできません。システムの不具合でお届けできなかった場合は全額返金します。
          </p>
        </section>

        <PayButtonSlot />

        <p className="mt-8 text-center text-base leading-8 text-[#4A3F3B]">
          ご購入は任意です。無料の鑑定書だけでも、どうぞ大切にお使いください。
        </p>
        <p className="mt-10 text-center text-sm leading-7">
          <a
            href="/commercial-transactions"
            className="text-[#8A6A3B] underline decoration-[#D9C08F] underline-offset-4 transition-colors hover:text-[#4A3F3B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8A6A3B]"
          >
            特定商取引法に基づく表記
          </a>
        </p>
      </PrayerPage>
    </div>
  );
}
