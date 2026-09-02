import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
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

const lockedSections = ["恋愛運", "金運", "仕事運", "人間関係", "来年の運勢", "月リズム", "開運アイテム"] as const;

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
        <p className="text-center text-lg leading-8 text-[#E0CFCB]">
          鑑定結果を読み込めませんでした。時間をおいて、このページを開き直してください。
        </p>
      </KanteiResultShell>
    );
  }
  if (!result) notFound();

  if (result.status === "pending") {
    return <KanteiResultShell><p className="text-center text-lg leading-8 text-[#E0CFCB]">鑑定書を作成中です。完成しだいメールでお知らせします。</p></KanteiResultShell>;
  }

  if (result.status === "failed") {
    return (
      <KanteiResultShell>
        <p className="text-center text-lg leading-8 text-[#E0CFCB]">
          申し訳ありません。鑑定書の作成で問題が発生しました。お手数ですが、再度お申込みいただくか pugwriting@gmail.com までご連絡ください
        </p>
      </KanteiResultShell>
    );
  }

  return <GeneratedResult freeResult={result.free} />;
}

function KanteiResultShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <section className="mx-auto max-w-3xl rounded-[2rem] border border-[#E8D9C3]/30 bg-[radial-gradient(circle_at_top,rgba(183,132,140,0.25),transparent_48%),#33292e] px-6 py-14 shadow-[0_24px_70px_rgba(7,4,6,0.35)] md:px-12">
      <p className="text-center text-xs font-bold tracking-[0.22em] text-[#E8D9C3]">FREE AI READING</p>
      <h1 className="mt-3 text-center text-3xl font-bold">鑑定結果</h1>
      <div className="mt-8">{children}</div>
      <ResultTracking locked={false} />
    </section>
  );
}

function GeneratedResult({ freeResult }: { freeResult: KanteiFreeResult }) {
  return (
    <div className="mx-auto max-w-3xl space-y-6" style={{ fontFamily: '"Zen Maru Gothic", sans-serif' }}>
      <section className="rounded-[2rem] border border-[#E8D9C3]/30 bg-[radial-gradient(circle_at_top,rgba(183,132,140,0.25),transparent_48%),#33292e] px-6 py-10 shadow-[0_24px_70px_rgba(7,4,6,0.35)] md:px-12">
        <p className="text-center text-xs font-bold tracking-[0.22em] text-[#E8D9C3]">FREE AI READING</p>
        <h1 className="mt-3 text-center text-3xl font-bold">あなたへの無料鑑定</h1>
        <div className="mt-8 space-y-5">
          <FreeSection title="あなたの本質" body={freeResult.essence} />
          <HealingWordSection phrase={freeResult.healing_word.phrase} body={freeResult.healing_word.body} />
          <FreeSection title="今年の流れ" body={freeResult.this_year_digest} />
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#B7848C]/45 bg-[#3A3035] p-6 md:p-8">
        <p className="text-xs font-bold tracking-[0.2em] text-[#E8D9C3]">DETAILED READING</p>
        <h2 className="mt-3 text-2xl font-bold">もっと詳しく知りたいあなたへ</h2>
        <p className="mt-3 text-sm leading-7 text-[#E0CFCB]">恋愛や仕事、来年の流れまで。詳細鑑定書は¥2,000で解放予定です。現在は準備中です。</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {lockedSections.map((title) => <LockedSection key={title} title={title} />)}
        </div>
        <div className="mt-6 rounded-xl border border-[#E8D9C3]/25 bg-[#2D2428]/75 px-5 py-4 text-center text-sm font-semibold text-[#E8D9C3]">
          詳細鑑定書 ¥2,000（準備中）
        </div>
      </section>
      <ResultTracking locked />
    </div>
  );
}

function FreeSection({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#2D2428]/55 p-5">
      <h2 className="text-lg font-bold text-[#E8D9C3]">{title}</h2>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-8 text-[#F7F1E8]">{body}</p>
    </section>
  );
}

function HealingWordSection({ phrase, body }: { phrase: string; body: string }) {
  return (
    <section className="rounded-2xl border border-[#B7848C]/45 bg-[#B7848C]/10 p-5">
      <h2 className="text-lg font-bold text-[#E8D9C3]">あなたを癒す言葉</h2>
      <h3 className="mt-4 text-xl font-bold leading-8 text-[#F7F1E8]">「{phrase}」</h3>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-8 text-[#F7F1E8]">{body}</p>
    </section>
  );
}

function LockedSection({ title }: { title: string }) {
  return (
    <section className="overflow-hidden rounded-xl border border-white/10 bg-[#2D2428]/70 p-4" aria-label={`${title}は準備中です`}>
      <h3 className="font-bold text-[#E8D9C3]">{title}</h3>
      <div className="mt-4 space-y-2 opacity-60 blur-[5px]" aria-hidden="true">
        <div className="h-3 w-11/12 rounded-full bg-[#E0CFCB]/65" />
        <div className="h-3 w-full rounded-full bg-[#E0CFCB]/45" />
        <div className="h-3 w-4/5 rounded-full bg-[#E0CFCB]/55" />
      </div>
    </section>
  );
}

function ResultTracking({ locked }: { locked: boolean }) {
  const eventScript = locked
    ? "window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'kantei_result_view'});window.dataLayer.push({event:'kantei_locked_view'});"
    : "window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'kantei_result_view'});";

  return <Script id={locked ? "kantei-result-tracking" : "kantei-result-status-tracking"} strategy="afterInteractive">{eventScript}</Script>;
}
