import type { Metadata } from "next";
import Link from "next/link";
import {
  BLOG_PAGE_SIZE,
  BLOG_CATEGORY_LABELS,
  getAllCategories,
  getAllPosts,
  paginatePosts,
  parsePageParam
} from "@/lib/blog";
import { getSiteUrl } from "@/lib/site";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { page } = await searchParams;
  const pageNumber = parsePageParam(page);
  const canonical =
    pageNumber > 1 ? `${getSiteUrl()}/blog?page=${pageNumber}` : `${getSiteUrl()}/blog`;

  return {
    title: "ブログ",
    description: "開運・暦・タロットの知識をまとめた記事一覧です。",
    alternates: { canonical }
  };
}

function getPaginationLink(page: number): string {
  return page <= 1 ? "/blog" : `/blog?page=${page}`;
}

export default async function BlogIndexPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const posts = getAllPosts();
  const categories = getAllCategories();
  const paginated = paginatePosts(posts, page);

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">ブログ</h1>
      <p className="text-[#B8B3C4]">開運・暦・タロットに関する記事を掲載しています。</p>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/blog/category/${category}`}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-[#B8B3C4] hover:border-[#C8A87C]/40 hover:text-[#E8E4F0]"
          >
            {BLOG_CATEGORY_LABELS[category]}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-[#B8B3C4]">
          まだ記事がありません。`content/blog/` に `.mdx` を追加すると表示されます。
        </div>
      ) : (
        <>
          <ul className="grid gap-4 md:grid-cols-2">
            {paginated.posts.map((post) => (
              <li key={post.slug} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="mb-1 text-xs uppercase tracking-wide text-[#C8A87C]">
                  {BLOG_CATEGORY_LABELS[post.category]}
                </p>
                <h2 className="mb-2 text-xl font-semibold">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-sm text-[#B8B3C4]">{post.description}</p>
                <p className="mt-3 text-xs text-[#B8B3C4]">
                  公開日: {post.date} / 更新日: {post.updated}
                </p>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#B8B3C4]">
            <p>
              {paginated.totalItems}件中 {(paginated.page - 1) * BLOG_PAGE_SIZE + 1}-
              {Math.min(paginated.page * BLOG_PAGE_SIZE, paginated.totalItems)}件を表示
            </p>
            <div className="flex items-center gap-3">
              {paginated.page > 1 ? (
                <Link href={getPaginationLink(paginated.page - 1)} className="text-[#C8A87C]">
                  ← 前へ
                </Link>
              ) : (
                <span className="text-[#6F6A80]">← 前へ</span>
              )}
              <span>
                {paginated.page} / {paginated.totalPages}
              </span>
              {paginated.page < paginated.totalPages ? (
                <Link href={getPaginationLink(paginated.page + 1)} className="text-[#C8A87C]">
                  次へ →
                </Link>
              ) : (
                <span className="text-[#6F6A80]">次へ →</span>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
