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
import { createBlogJsonLd, createBreadcrumbListJsonLd } from "@/lib/structured-data";

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
  const siteUrl = getSiteUrl();
  const currentUrl = paginated.page > 1 ? `${siteUrl}/blog?page=${paginated.page}` : `${siteUrl}/blog`;
  const blogJsonLd = createBlogJsonLd({
    name: "開運ルナカレンダー ブログ",
    description: "開運・暦・タロットの知識を、日々の判断に使える形でまとめた記事一覧。",
    url: currentUrl
  });
  const breadcrumbJsonLd = createBreadcrumbListJsonLd([
    { name: "ホーム", url: siteUrl },
    { name: "ブログ", url: `${siteUrl}/blog` }
  ]);

  return (
    <section className="luna-blog-shell space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <header className="luna-blog-card space-y-3">
        <p className="text-xs tracking-[0.28em] text-[#C8A87C]/85">MOONLIGHT BLOG</p>
        <h1 className="text-3xl font-bold leading-tight text-[#F5F3F0] md:text-4xl">
          ブログ
        </h1>
        <p className="max-w-3xl text-base leading-8 text-[#D9D5E5]">
          開運・暦・タロットの知識を、日々の判断に使える形でまとめています。
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/blog/category/${category}`}
            className="luna-chip"
          >
            {BLOG_CATEGORY_LABELS[category]}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="luna-blog-card text-sm text-[#B8B3C4]">
          まだ記事がありません。`content/blog/` に `.mdx` を追加すると表示されます。
        </div>
      ) : (
        <>
          <ul className="grid gap-5 md:grid-cols-2">
            {paginated.posts.map((post) => (
              <li
                key={post.slug}
                className="luna-blog-card transition-transform duration-300 hover:-translate-y-0.5"
              >
                <p className="mb-2 text-xs uppercase tracking-wide text-[#C8A87C]">
                  {BLOG_CATEGORY_LABELS[post.category]}
                </p>
                <h2 className="mb-3 text-xl font-semibold leading-8 text-[#F5F3F0]">
                  <Link href={`/blog/${post.slug}`} className="hover:text-[#E5C44B]">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-sm leading-7 text-[#D0CADF]">{post.description}</p>
                <p className="mt-4 text-xs text-[#AFA8BE]">
                  公開日: {post.date} / 更新日: {post.updated}
                </p>
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
                <Link href={getPaginationLink(paginated.page - 1)} className="text-[#C8A87C] hover:text-[#E5C44B]">
                  ← 前へ
                </Link>
              ) : (
                <span className="text-[#6F6A80]">← 前へ</span>
              )}
              <span>
                {paginated.page} / {paginated.totalPages}
              </span>
              {paginated.page < paginated.totalPages ? (
                <Link href={getPaginationLink(paginated.page + 1)} className="text-[#C8A87C] hover:text-[#E5C44B]">
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
