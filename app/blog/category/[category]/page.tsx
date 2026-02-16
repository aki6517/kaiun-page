import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BLOG_CATEGORY_DESCRIPTIONS,
  BLOG_CATEGORY_LABELS,
  BLOG_PAGE_SIZE,
  getAllCategories,
  getPostsByCategory,
  paginatePosts,
  parsePageParam,
  type BlogCategory
} from "@/lib/blog";
import { getSiteUrl } from "@/lib/site";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }));
}

function isBlogCategory(category: string): category is BlogCategory {
  return getAllCategories().includes(category as BlogCategory);
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { category } = await params;
  const { page } = await searchParams;
  if (!isBlogCategory(category)) {
    return {};
  }

  const pageNumber = parsePageParam(page);
  const siteUrl = getSiteUrl();
  return {
    title: `カテゴリ: ${BLOG_CATEGORY_LABELS[category]}`,
    description: BLOG_CATEGORY_DESCRIPTIONS[category],
    alternates: {
      canonical:
        pageNumber > 1
          ? `${siteUrl}/blog/category/${category}?page=${pageNumber}`
          : `${siteUrl}/blog/category/${category}`
    }
  };
}

function getPaginationLink(category: string, page: number): string {
  return page <= 1 ? `/blog/category/${category}` : `/blog/category/${category}?page=${page}`;
}

export default async function BlogCategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const { page } = await searchParams;
  if (!isBlogCategory(category)) {
    notFound();
  }

  const paginated = paginatePosts(getPostsByCategory(category), page);

  return (
    <section className="space-y-6">
      <Link href="/blog" className="text-sm text-[#C8A87C]">
        ← ブログ一覧へ戻る
      </Link>
      <h1 className="text-3xl font-bold">カテゴリ: {BLOG_CATEGORY_LABELS[category]}</h1>
      <p className="text-[#B8B3C4]">{BLOG_CATEGORY_DESCRIPTIONS[category]}</p>
      {paginated.totalItems === 0 ? (
        <p className="text-[#B8B3C4]">このカテゴリの記事はまだありません。</p>
      ) : (
        <>
          <ul className="grid gap-4 md:grid-cols-2">
            {paginated.posts.map((post) => (
              <li key={post.slug} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <h2 className="mb-1 text-xl font-semibold">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-sm text-[#B8B3C4]">{post.description}</p>
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
                <Link href={getPaginationLink(category, paginated.page - 1)} className="text-[#C8A87C]">
                  ← 前へ
                </Link>
              ) : (
                <span className="text-[#6F6A80]">← 前へ</span>
              )}
              <span>
                {paginated.page} / {paginated.totalPages}
              </span>
              {paginated.page < paginated.totalPages ? (
                <Link href={getPaginationLink(category, paginated.page + 1)} className="text-[#C8A87C]">
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
