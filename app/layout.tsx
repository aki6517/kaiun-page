import type { Metadata } from "next";
import Link from "next/link";
import { TrackingTagInjector } from "@/components/tracking-tag-injector";
import "./globals.css";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "開運カレンダー アプリ【ルナ】運がいい日がわかるカレンダー2026",
    template: "%s | 開運ルナカレンダー"
  },
  description: siteConfig.description
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-[#0D0B14] text-[#E8E4F0] antialiased">
        <TrackingTagInjector />
        <header className="border-b border-white/10">
          <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="font-semibold tracking-wide text-[#C8A87C]">
              開運ルナカレンダー
            </Link>
            <div className="flex items-center gap-5 text-sm text-[#B8B3C4]">
              <Link href="/">ホーム</Link>
              <Link href="/blog">ブログ</Link>
              <Link href="/privacy-policy">プライバシー</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t border-white/10">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-[#B8B3C4]">
            <p>© 2026 開運ルナカレンダー</p>
            <p>月の満ち欠け × タロットカードで毎日の意思決定をサポート。</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
