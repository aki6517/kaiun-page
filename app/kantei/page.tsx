import type { Metadata } from "next";
import { KanteiForm } from "@/components/kantei/kantei-form";
import { DoubleLineFrame, StarField, SunriseEmblem } from "@/components/kantei/ornaments";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "無料AI鑑定",
  description: "紗々・マグダレナ監修の無料AI鑑定。あなたらしい毎日へ向かうための小さなヒントをお届けします。",
  alternates: {
    canonical: `${getSiteUrl()}/kantei`
  }
};

const reassuranceItems = [
  {
    title: "煽らない",
    description: "不安を大きくする言葉や、急かす表現は使いません。"
  },
  {
    title: "依存させない",
    description: "答えを押しつけず、ご自身で選べる視点を大切にします。"
  },
  {
    title: "明朗会計",
    description: "有料のご案内は内容と価格をわかりやすくお伝えします。"
  }
] as const;

export default function KanteiPage() {
  return (
    <div className="mx-auto min-w-0 max-w-4xl space-y-16 pb-8 text-[#4A3F3B]">
      <section className="relative min-w-0 overflow-hidden bg-[#FDFBF7] px-6 py-14 sm:px-10 sm:py-20 md:px-14">
        <DoubleLineFrame
          className="pointer-events-none absolute"
          style={{ inset: "0.5rem", width: "calc(100% - 1rem)", height: "calc(100% - 1rem)" }}
          color="#B08A4F"
        />
        <StarField className="pointer-events-none absolute right-2 top-3 h-24 w-40 text-[#D9C08F] opacity-60" />
        <div className="relative mx-auto max-w-2xl text-center">
          <SunriseEmblem className="mx-auto w-40 text-[#B08A4F] sm:w-48" />
          <p className="mt-5 text-xs font-medium tracking-[0.12em] text-[#8A6A3B]">SASA MAGDALENA SUPERVISED</p>
          <h1 className="mt-5 text-balance text-2xl font-bold leading-[1.55] tracking-[0.12em] text-[#B08A4F] [text-shadow:0_1px_0_rgba(138,106,59,0.18)] sm:text-3xl md:text-5xl md:leading-[1.45]">
            あなたの中にある答えを、
            <br className="hidden sm:block" />
            そっと見つける無料AI鑑定
          </h1>
          <p className="mx-auto mt-7 max-w-[34em] text-left text-base leading-8 text-[#4A3F3B] sm:text-center">
            紗々・マグダレナが大切にしてきたのは、誰かの正解に合わせることではなく、自分の感覚に戻ること。
            鑑定を通して、他人軸から自分軸へ向かうための小さな灯りをお渡しします。
          </p>
          <a
            href="#kantei-form"
            className="mt-8 inline-flex min-h-11 touch-manipulation items-center justify-center bg-[#B08A4F] px-6 py-3 text-base font-bold text-[#2D2428] transition-colors hover:bg-[#D9C08F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8A6A3B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7]"
          >
            無料で鑑定を申し込む
          </a>
        </div>
      </section>

      <section className="grid min-w-0 gap-10 border-y border-[#D9C08F] py-12 md:grid-cols-[1.1fr_0.9fr] md:gap-0 md:py-16">
        <div className="min-w-0 md:pr-10">
          <p className="text-xs font-medium tracking-[0.12em] text-[#8A6A3B]">FREE READING</p>
          <h2 className="mt-3 text-balance text-2xl font-bold tracking-[0.12em] text-[#B08A4F]">無料鑑定でわかること</h2>
          <ul className="mt-6 space-y-3 text-base leading-8 text-[#4A3F3B]">
            <li>・あなたが元々持っている強みと、本質のダイジェスト</li>
            <li>・今のあなたに寄り添う「癒しの言葉」</li>
            <li>・今年の流れを整えるためのヒント</li>
          </ul>
        </div>
        <aside className="min-w-0 border-t border-[#D9C08F] pt-10 md:border-l md:border-t-0 md:pl-10 md:pt-0">
          <p className="text-xs font-medium tracking-[0.12em] text-[#8A6A3B]">AI DISCLOSURE</p>
          <div className="mt-4 h-px w-16 bg-[#B7848C]" aria-hidden="true" />
          <p className="mt-5 text-base font-medium leading-8 text-[#4A3F3B]">
            本鑑定はAI鑑定システムが生成しています（紗々・マグダレナ監修）
          </p>
          <p className="mt-3 text-base leading-8 text-[#4A3F3B]">
            未来を断定するものではなく、日々の選択を見つめ直すための参考情報としてお楽しみください。
          </p>
        </aside>
      </section>

      <section className="py-2 sm:py-4">
        <p className="text-center text-xs font-medium tracking-[0.12em] text-[#8A6A3B]">OUR PROMISE</p>
        <h2 className="mt-4 text-balance text-center text-2xl font-bold tracking-[0.12em] text-[#B08A4F]">安心して受け取っていただくために</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-0">
          {reassuranceItems.map((item, index) => (
            <div key={item.title} className="border-t border-[#D9C08F] pt-6 md:border-l md:border-t-0 md:px-7 md:pt-0 md:first:border-l-0">
              <p className="text-sm font-medium text-[#8A6A3B]">0{index + 1}</p>
              <h3 className="mt-3 text-xl font-bold tracking-[0.12em] text-[#B08A4F]">{item.title}</h3>
              <p className="mt-3 text-base leading-8 text-[#4A3F3B]">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="kantei-form" className="relative min-w-0 scroll-mt-6 overflow-hidden bg-[#FDFBF7] px-6 py-14 sm:px-10 sm:py-16">
        <DoubleLineFrame
          className="pointer-events-none absolute"
          style={{ inset: "0.5rem", width: "calc(100% - 1rem)", height: "calc(100% - 1rem)" }}
          color="#D9C08F"
        />
        <div className="relative mx-auto min-w-0 max-w-xl">
          <p className="text-center text-xs font-medium tracking-[0.12em] text-[#8A6A3B]">FREE APPLICATION</p>
          <h2 className="mt-4 text-balance text-center text-2xl font-bold tracking-[0.12em] text-[#B08A4F] md:text-3xl">無料AI鑑定を申し込む</h2>
          <p className="mt-5 text-center text-base leading-8 text-[#4A3F3B]">
            鑑定書は24時間以内を目安にメールでお届けします。順次作成のため前後する場合があります。
          </p>
          <div className="mt-9 border-t border-[#D9C08F] pt-8 sm:px-3">
            <KanteiForm />
          </div>
        </div>
      </section>
    </div>
  );
}
