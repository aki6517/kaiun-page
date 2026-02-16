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
import { createBreadcrumbListJsonLd, createWebPageJsonLd } from "@/lib/structured-data";

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
  const siteUrl = getSiteUrl();
  const baseCategoryUrl = `${siteUrl}/blog/category/${category}`;
  const currentCategoryUrl = paginated.page > 1 ? `${baseCategoryUrl}?page=${paginated.page}` : baseCategoryUrl;
  const categoryLabel = BLOG_CATEGORY_LABELS[category];
  const webPageJsonLd = createWebPageJsonLd({
    name: `カテゴリ: ${categoryLabel}`,
    description: BLOG_CATEGORY_DESCRIPTIONS[category],
    url: currentCategoryUrl
  });
  const breadcrumbJsonLd = createBreadcrumbListJsonLd([
    { name: "ホーム", url: siteUrl },
    { name: "ブログ", url: `${siteUrl}/blog` },
    { name: categoryLabel, url: baseCategoryUrl }
  ]);

  return (
    <section className="luna-blog-shell space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <header className="luna-blog-card space-y-3">
        <Link href="/blog" className="inline-block text-sm text-[#C8A87C] hover:text-[#E5C44B]">
          ← ブログ一覧へ戻る
        </Link>
        <p className="text-xs tracking-[0.28em] text-[#C8A87C]/85">CATEGORY</p>
        <h1 className="text-3xl font-bold leading-tight text-[#F5F3F0] md:text-4xl">
          {BLOG_CATEGORY_LABELS[category]}
        </h1>
        <p className="max-w-3xl text-base leading-8 text-[#D9D5E5]">
          {BLOG_CATEGORY_DESCRIPTIONS[category]}
        </p>
      </header>

      {paginated.totalItems === 0 ? (
        <p className="luna-blog-card text-[#B8B3C4]">このカテゴリの記事はまだありません。</p>
      ) : (
        <>
          <ul className="grid gap-5 md:grid-cols-2">
            {paginated.posts.map((post) => (
              <li
                key={post.slug}
                className="luna-blog-card transition-transform duration-300 hover:-translate-y-0.5"
              >
                <h2 className="mb-2 text-xl font-semibold leading-8 text-[#F5F3F0]">
                  <Link href={`/blog/${post.slug}`} className="hover:text-[#E5C44B]">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-sm leading-7 text-[#D0CADF]">{post.description}</p>
              </li>
            ))}
          </ul>
          <div className="luna-blog-card flex flex-wrap items-center justify-between gap-3 text-sm text-[#C4BED2]">
            <p>
              {paginated.totalItems}件中 {(paginated.page - 1) * BLOG_PAGE_SIZE + 1}-
              {Math.min(paginated.page * BLOG_PAGE_SIZE, paginated.totalItems)}件を表示
            </p>
            <div className="flex items-center gap-3">
              {paginated.page > 1 ? (
                <Link
                  href={getPaginationLink(category, paginated.page - 1)}
                  className="text-[#C8A87C] hover:text-[#E5C44B]"
                >
                  ← 前へ
                </Link>
              ) : (
                <span className="text-[#6F6A80]">← 前へ</span>
              )}
              <span>
                {paginated.page} / {paginated.totalPages}
              </span>
              {paginated.page < paginated.totalPages ? (
                <Link
                  href={getPaginationLink(category, paginated.page + 1)}
                  className="text-[#C8A87C] hover:text-[#E5C44B]"
                >
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
