import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const siteUrl = getSiteUrl();
  const body = `# 開運ルナカレンダー

> 月の満ち欠け × タロットカードで「今日の運勢」がわかるiOS向けアプリのサービスサイト。

## アプリ情報
- [サービスページ](${siteUrl}/): 機能紹介・料金プラン・ダウンロード
- [ブログ一覧](${siteUrl}/blog): 開運・暦・タロットの記事一覧
- [プライバシーポリシー](${siteUrl}/privacy-policy): 個人情報の取り扱い
`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
