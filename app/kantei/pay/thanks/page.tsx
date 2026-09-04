import type { Metadata } from "next";
import { CrescentMoon, DoubleLineFrame, SunriseEmblem } from "@/components/kantei/ornaments";

export const metadata: Metadata = {
  title: "お支払いありがとうございます",
  robots: {
    index: false,
    follow: false
  }
};

export default function KanteiPayThanksPage() {
  return (
    <section className="relative mx-auto max-w-2xl overflow-hidden bg-[#FDFBF7] px-6 py-16 text-center sm:px-12 sm:py-20">
      <DoubleLineFrame
        className="pointer-events-none absolute"
        style={{ inset: "0.5rem", width: "calc(100% - 1rem)", height: "calc(100% - 1rem)" }}
        color="#B08A4F"
      />
      <div className="relative mx-auto max-w-[34em]">
        <SunriseEmblem className="mx-auto w-36 text-[#B08A4F]" />
        <p className="mt-5 text-xs font-medium tracking-[0.12em] text-[#8A6A3B]">THANK YOU</p>
        <h1 className="mt-4 text-balance text-3xl font-bold leading-[1.5] tracking-[0.12em] text-[#B08A4F] md:text-4xl">
          お支払いありがとうございます
        </h1>
        <p className="mt-7 text-base leading-8 text-[#4A3F3B]">詳細鑑定書をメールでお届けします。</p>
        <p className="mt-4 text-sm leading-7 text-[#4A3F3B]">メールが見当たらない場合は、迷惑メールフォルダもご確認ください。</p>
        <CrescentMoon className="mx-auto mt-8 size-9 text-[#B08A4F]" />
      </div>
    </section>
  );
}
