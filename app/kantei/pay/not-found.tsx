import type { Metadata } from "next";
import { SunriseEmblem } from "@/components/kantei/ornaments";
import { PrayerPage } from "@/components/kantei/prayer-page";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default function KanteiPayNotFound() {
  return (
    <div className="mx-auto max-w-2xl">
      <PrayerPage>
        <div className="text-center">
          <SunriseEmblem className="mx-auto w-36 text-[#B08A4F]" />
          <h1 className="mt-6 text-balance text-3xl font-bold leading-[1.6] tracking-[0.12em] text-[#B08A4F]">
            このページは見つかりませんでした
          </h1>
          <p className="mx-auto mt-10 max-w-[34em] text-left text-base leading-8 text-[#4A3F3B]">
            リンクの有効期限が切れているか、URLに誤りがある可能性があります。お手数ですが、メールに記載のリンクをもう一度お試しください。
          </p>
          <p className="mt-10 text-center text-sm leading-7">
            {/* token 付きURLへSPA復帰させないため、意図的に hard navigation にする。 */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="text-[#8A6A3B] underline decoration-[#D9C08F] underline-offset-4 transition-colors hover:text-[#4A3F3B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8A6A3B]"
            >
              開運ルナカレンダーのトップへ
            </a>
          </p>
        </div>
      </PrayerPage>
    </div>
  );
}
