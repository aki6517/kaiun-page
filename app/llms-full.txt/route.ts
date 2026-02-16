import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const siteUrl = getSiteUrl();
  const posts = getAllPosts();
  const postLines = posts
    .map((post) => `- [${post.title}](${siteUrl}/blog/${post.slug}): ${post.description}`)
    .join("\n");

  const body = `# 開運ルナカレンダー (Full)

## サイト概要
月の満ち欠け × タロットカードで、毎日の運勢や過ごし方のヒントを提供するサービスサイト。

## 固定ページ
- [サービスページ](${siteUrl}/)
- [プライバシーポリシー](${siteUrl}/privacy-policy)

## ブログ記事
${postLines || "- 記事はまだありません"}
`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
