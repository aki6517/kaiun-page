import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "送信ありがとうございます",
  robots: {
    index: false,
    follow: false
  }
};

export default function KanteiThanksPage() {
  return (
    <section className="mx-auto max-w-2xl rounded-[2rem] border border-[#E8D9C3]/30 bg-[radial-gradient(circle_at_top,rgba(183,132,140,0.26),transparent_45%),#33292e] px-6 py-14 text-center shadow-[0_24px_70px_rgba(7,4,6,0.35)] md:px-12">
      <p className="text-xs font-bold tracking-[0.22em] text-[#E8D9C3]">THANK YOU</p>
      <h1 className="mt-4 text-3xl font-bold md:text-4xl">送信ありがとうございます</h1>
      <p className="mt-6 text-base leading-8 text-[#E0CFCB]">
        受付が完了している場合は、受付完了メールが届きます。鑑定書は24時間以内を目安に、順次メールでお届けします。
      </p>
      <p className="mt-4 text-sm leading-7 text-[#C7B0B0]">
        メールが見当たらない場合は、迷惑メールフォルダもご確認ください。
      </p>
    </section>
  );
}
