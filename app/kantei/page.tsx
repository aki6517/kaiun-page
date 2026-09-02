import type { Metadata } from "next";
import { KanteiForm } from "@/components/kantei/kantei-form";
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
    <div className="mx-auto max-w-4xl space-y-12 pb-8" style={{ fontFamily: '"Zen Maru Gothic", sans-serif' }}>
      <section className="relative overflow-hidden rounded-[2rem] border border-[#E8D9C3]/30 bg-[radial-gradient(circle_at_88%_12%,rgba(183,132,140,0.42),transparent_32%),radial-gradient(circle_at_12%_100%,rgba(232,217,195,0.18),transparent_42%),linear-gradient(145deg,#44343b,#2D2428_68%)] px-6 py-12 shadow-[0_24px_70px_rgba(7,4,6,0.38)] md:px-12 md:py-16">
        <div className="absolute right-[-2rem] top-[-2rem] size-36 rounded-full border border-[#E8D9C3]/20 bg-[#E8D9C3]/10" aria-hidden="true" />
        <div className="relative max-w-2xl space-y-6">
          <p className="text-xs font-bold tracking-[0.24em] text-[#E8D9C3]">SASA MAGDALENA SUPERVISED</p>
          <h1 className="text-3xl font-bold leading-tight text-[#F7F1E8] md:text-5xl">
            あなたの中にある答えを、
            <br />
            そっと見つける無料AI鑑定
          </h1>
          <p className="text-base leading-8 text-[#E0CFCB] md:text-lg">
            紗々・マグダレナが大切にしてきたのは、誰かの正解に合わせることではなく、自分の感覚に戻ること。
            鑑定を通して、他人軸から自分軸へ向かうための小さな灯りをお渡しします。
          </p>
          <a
            href="#kantei-form"
            className="inline-flex rounded-full bg-[#E8D9C3] px-6 py-3 text-sm font-bold text-[#2D2428] transition hover:bg-[#F7F1E8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8D9C3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2D2428]"
          >
            無料で鑑定を申し込む
          </a>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <p className="text-xs font-bold tracking-[0.2em] text-[#E8D9C3]">FREE READING</p>
          <h2 className="mt-3 text-2xl font-bold">無料鑑定でわかること</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-[#E0CFCB]">
            <li>・あなたが元々持っている強みと、本質のダイジェスト</li>
            <li>・今のあなたに寄り添う「癒しの言葉」</li>
            <li>・今年の流れを整えるためのヒント</li>
          </ul>
        </div>
        <aside className="rounded-2xl border border-[#B7848C]/35 bg-[#B7848C]/10 p-6 md:p-8">
          <p className="text-xs font-bold tracking-[0.2em] text-[#E8D9C3]">AI DISCLOSURE</p>
          <p className="mt-4 text-base font-semibold leading-8 text-[#F7F1E8]">
            本鑑定はAI鑑定システムが生成しています（紗々・マグダレナ監修）
          </p>
          <p className="mt-3 text-sm leading-7 text-[#E0CFCB]">
            未来を断定するものではなく、日々の選択を見つめ直すための参考情報としてお楽しみください。
          </p>
        </aside>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#3A3035] p-6 md:p-8">
        <p className="text-xs font-bold tracking-[0.2em] text-[#E8D9C3]">OUR PROMISE</p>
        <h2 className="mt-3 text-2xl font-bold">安心して受け取っていただくために</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {reassuranceItems.map((item, index) => (
            <div key={item.title} className="rounded-xl border border-white/10 bg-[#2D2428]/70 p-5">
              <p className="text-sm font-bold text-[#B7848C]">0{index + 1}</p>
              <h3 className="mt-2 text-lg font-bold text-[#F7F1E8]">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#C7B0B0]">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="kantei-form" className="scroll-mt-6 rounded-[2rem] border border-[#E8D9C3]/35 bg-[linear-gradient(160deg,rgba(183,132,140,0.2),rgba(45,36,40,0.96)_42%)] p-6 shadow-[0_20px_52px_rgba(7,4,6,0.3)] md:p-10">
        <div className="mx-auto max-w-xl">
          <p className="text-center text-xs font-bold tracking-[0.2em] text-[#E8D9C3]">FREE APPLICATION</p>
          <h2 className="mt-3 text-center text-2xl font-bold md:text-3xl">無料AI鑑定を申し込む</h2>
          <p className="mt-4 text-center text-sm leading-7 text-[#E0CFCB]">
            鑑定書は24時間以内を目安にメールでお届けします。順次作成のため前後する場合があります。
          </p>
          <div className="mt-7 rounded-2xl border border-white/10 bg-[#2D2428]/65 p-5 md:p-6">
            <KanteiForm />
          </div>
        </div>
      </section>
    </div>
  );
}
