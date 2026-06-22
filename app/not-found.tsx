import Link from "next/link";

export default function NotFound() {
  return (
    <section className="space-y-4">
      <p className="text-sm tracking-[0.15em] text-[#E8D9C3]">404</p>
      <h1 className="text-3xl font-bold">ページが見つかりませんでした</h1>
      <p className="text-[#C7B0B0]">
        URLが変更されたか、入力されたリンクに誤りがある可能性があります。
      </p>
      <div className="flex gap-3">
        <Link href="/" className="rounded-full border border-[#E8D9C3]/40 px-5 py-2 text-sm">
          ホームへ戻る
        </Link>
        <Link href="/blog" className="rounded-full border border-white/20 px-5 py-2 text-sm">
          ブログへ
        </Link>
      </div>
    </section>
  );
}
