import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  CornerFan,
  CrescentMoon,
  DoubleLineFrame,
  FilledStar,
  MoonLock,
  MoonPhaseDivider,
  OutlineStar,
  StarField,
  SunriseEmblem
} from "@/components/kantei/ornaments";
import { getResultForPage, type KanteiFreeResult } from "@/lib/kantei/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "無料AI鑑定結果",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  }
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const sealedSections = ["恋愛運", "金運", "仕事運", "人間関係", "来年の運勢", "月リズム", "開運アイテム"] as const;

export default async function KanteiResultPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!UUID_PATTERN.test(token)) notFound();

  let result: Awaited<ReturnType<typeof getResultForPage>>;
  try {
    result = await getResultForPage(token);
  } catch {
    console.error(JSON.stringify({ event: "kantei_result", outcome: "lookup_failed" }));
    return (
      <KanteiResultShell>
        <p className="mx-auto max-w-[34em] break-words text-center text-lg leading-9 text-[#4A3F3B] [overflow-wrap:anywhere]">
          鑑定結果を読み込めませんでした。時間をおいて、このページを開き直してください。
        </p>
      </KanteiResultShell>
    );
  }
  if (!result) notFound();

  if (result.status === "pending") {
    return (
      <KanteiResultShell>
        <p className="mx-auto max-w-[34em] break-words text-center text-lg leading-9 text-[#4A3F3B] [overflow-wrap:anywhere]">
          鑑定書を作成中です。完成しだいメールでお知らせします。
        </p>
      </KanteiResultShell>
    );
  }

  if (result.status === "failed") {
    return (
      <KanteiResultShell>
        <p className="mx-auto max-w-[34em] break-words text-center text-lg leading-9 text-[#4A3F3B] [overflow-wrap:anywhere]">
          申し訳ありません。鑑定書の作成で問題が発生しました。お手数ですが、再度お申込みいただくか
          pugwriting@gmail.com までご連絡ください
        </p>
      </KanteiResultShell>
    );
  }

  return <GeneratedResult freeResult={result.free} />;
}

function KanteiResultShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="mx-auto min-w-0 max-w-3xl">
      <PageCard>
        <div className="text-center">
          <SunriseEmblem className="mx-auto w-36 text-[#B08A4F]" />
          <p className="mt-5 text-xs font-medium tracking-[0.12em] text-[#8A6A3B]">FREE AI READING</p>
          <h1 className="mt-4 text-balance text-3xl font-bold tracking-[0.12em] text-[#B08A4F]">鑑定書</h1>
          <div className="mt-8">{children}</div>
        </div>
      </PageCard>
      <ResultTracking locked={false} />
    </div>
  );
}

function GeneratedResult({ freeResult }: { freeResult: KanteiFreeResult }) {
  return (
    <div className="mx-auto min-w-0 max-w-3xl space-y-8 sm:space-y-12">
      <CoverPage />

      <MoonPhaseDivider className="mx-auto h-8 w-full max-w-64 text-[#D9C08F]" />

      <FreeSection title="あなたの本質" body={freeResult.essence} />

      <MoonPhaseDivider className="mx-auto h-8 w-full max-w-64 text-[#D9C08F]" />

      <HealingWordSection phrase={freeResult.healing_word.phrase} body={freeResult.healing_word.body} />

      <MoonPhaseDivider className="mx-auto h-8 w-full max-w-64 text-[#D9C08F]" />

      <FreeSection title="今年の流れ" body={freeResult.this_year_digest} />

      <MoonPhaseDivider className="mx-auto h-8 w-full max-w-64 text-[#D9C08F]" />

      <SealedPages />

      <Closing />
      <ResultTracking locked />
    </div>
  );
}

function CoverPage() {
  return (
    <section className="relative min-w-0 overflow-hidden bg-[#FDFBF7] px-6 py-16 text-center sm:px-12 sm:py-24">
      <DoubleLineFrame
        className="pointer-events-none absolute"
        style={{ inset: "0.5rem", width: "calc(100% - 1rem)", height: "calc(100% - 1rem)" }}
        color="#B08A4F"
      />
      <StarField className="pointer-events-none absolute right-3 top-4 h-24 w-40 text-[#D9C08F] opacity-70" />
      <div className="relative mx-auto max-w-xl">
        <SunriseEmblem className="mx-auto w-44 text-[#B08A4F] sm:w-52" />
        <p className="mt-6 text-xs font-medium tracking-[0.12em] text-[#8A6A3B]">SASA MAGDALENA SUPERVISED</p>
        <h1 className="mt-5 text-balance text-4xl font-bold tracking-[0.12em] text-[#B08A4F] [text-shadow:0_1px_0_rgba(138,106,59,0.18)] sm:text-5xl">
          鑑定書
        </h1>
        <p className="mt-8 text-xl font-bold tracking-[0.12em] text-[#B08A4F]">あなたへ</p>
        <p className="mt-5 text-sm leading-7 text-[#8A6A3B]">自分の感覚へ、静かに還るための一葉</p>
      </div>
    </section>
  );
}

function PageCard({ children }: Readonly<{ children: ReactNode }>) {
  const cornerClassName = "pointer-events-none absolute size-14 text-[#B08A4F] sm:size-16";

  return (
    <section className="relative min-w-0 overflow-hidden bg-[#FDFBF7] px-6 py-16 sm:px-12 sm:py-20">
      <DoubleLineFrame
        className="pointer-events-none absolute"
        style={{ inset: "0.5rem", width: "calc(100% - 1rem)", height: "calc(100% - 1rem)" }}
        color="#D9C08F"
      />
      <CornerFan corner="top-left" className={`${cornerClassName} left-3 top-3`} />
      <CornerFan corner="top-right" className={`${cornerClassName} right-3 top-3`} />
      <CornerFan corner="bottom-right" className={`${cornerClassName} bottom-3 right-3`} />
      <CornerFan corner="bottom-left" className={`${cornerClassName} bottom-3 left-3`} />
      <div className="relative mx-auto min-w-0 max-w-[34em]">{children}</div>
    </section>
  );
}

function FreeSection({ title, body }: { title: string; body: string }) {
  return (
    <PageCard>
      <h2 className="text-center text-2xl font-bold tracking-[0.12em] text-[#B08A4F]">{title}</h2>
      <p className="mt-10 whitespace-pre-wrap break-words text-base leading-8 text-[#4A3F3B] [overflow-wrap:anywhere]">{body}</p>
    </PageCard>
  );
}

function HealingWordSection({ phrase, body }: { phrase: string; body: string }) {
  return (
    <PageCard>
      <h2 className="text-center text-2xl font-bold tracking-[0.12em] text-[#B08A4F]">あなたを癒す言葉</h2>
      <p className="mt-10 break-words text-center text-2xl font-medium leading-10 text-[#4A3F3B] [overflow-wrap:anywhere]">
        「{phrase}」
      </p>
      <div className="mx-auto mt-7 h-px w-24 bg-[#B7848C]" aria-hidden="true" />
      <p className="mt-9 whitespace-pre-wrap break-words text-base leading-8 text-[#4A3F3B] [overflow-wrap:anywhere]">{body}</p>
    </PageCard>
  );
}

function SealedPages() {
  return (
    <PageCard>
      <MoonLock className="mx-auto h-20 w-16 text-[#B7848C]" />
      <h2 className="mt-7 text-balance text-center text-2xl font-bold tracking-[0.12em] text-[#B08A4F]">まだ開かれていない頁</h2>
      <p className="mx-auto mt-6 max-w-[30em] text-center text-base leading-8 text-[#4A3F3B]">
        恋愛や仕事、来年の流れまで、さらに深く読み解くための頁です。
      </p>

      <div className="mt-12 divide-y divide-[#D9C08F] border-y border-[#D9C08F]">
        {sealedSections.map((title) => (
          <SealedSection key={title} title={title} />
        ))}
      </div>

      <p className="mt-10 text-center text-base leading-8 text-[#4A3F3B]">詳細鑑定書の価格は ¥2,000 です。</p>
    </PageCard>
  );
}

function SealedSection({ title }: { title: string }) {
  return (
    <section className="min-w-0 overflow-hidden py-7">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h3 className="text-xl font-bold tracking-[0.12em] text-[#B08A4F]">{title}</h3>
        {title === "金運" ? <StarRating /> : null}
      </div>
      <div className="mt-5 space-y-2.5 overflow-hidden opacity-60 blur-[5px]" aria-hidden="true">
        <div className="h-2 w-11/12 bg-[#D9C08F]" />
        <div className="h-2 w-full bg-[#D9C08F] opacity-70" />
        <div className="h-2 w-4/5 bg-[#D9C08F] opacity-85" />
      </div>
    </section>
  );
}

function StarRating() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1" role="img" aria-label="5段階中4">
      {[0, 1, 2, 3].map((star) => (
        <FilledStar key={star} className="size-5 text-[#B08A4F]" />
      ))}
      <OutlineStar className="size-5 text-[#D9C08F]" />
    </span>
  );
}

function Closing() {
  return (
    <section className="px-4 py-8 text-center sm:py-10">
      <CrescentMoon className="mx-auto size-10 text-[#B08A4F]" />
      <p className="mt-5 text-base leading-8 text-[#4A3F3B]">〜 紗々・マグダレナより愛を込めて 〜</p>
    </section>
  );
}

function ResultTracking({ locked }: { locked: boolean }) {
  const eventScript = locked
    ? "window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'kantei_result_view'});window.dataLayer.push({event:'kantei_locked_view'});"
    : "window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'kantei_result_view'});";

  return <Script id={locked ? "kantei-result-tracking" : "kantei-result-status-tracking"} strategy="afterInteractive">{eventScript}</Script>;
}
