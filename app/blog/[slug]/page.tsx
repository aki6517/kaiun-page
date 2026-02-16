import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { isValidElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BLOG_CATEGORY_LABELS,
  extractHeadings,
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  slugifyHeading
} from "@/lib/blog";
import { getSiteUrl } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const siteUrl = getSiteUrl();

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${siteUrl}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${siteUrl}/blog/${post.slug}`
    }
  };
}

function getTextFromNode(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextFromNode).join("");
  if (isValidElement(node)) {
    return getTextFromNode((node.props as { children?: ReactNode }).children ?? "");
  }
  return "";
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/blog/${post.slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(`${post.title} | 開運ルナカレンダー`);
  const tableOfContents = extractHeadings(post.body);
  const relatedPosts = getRelatedPosts(post, 3);
  const headingIdState = new Map<string, number>();
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated,
    author: {
      "@type": "Organization",
      name: "開運ルナカレンダー編集部"
    },
    publisher: {
      "@type": "Organization",
      name: "開運ルナカレンダー"
    },
    mainEntityOfPage: url
  };

  const resolveHeadingId = (headingText: string) => {
    const baseId = slugifyHeading(headingText);
    const count = headingIdState.get(baseId) ?? 0;
    headingIdState.set(baseId, count + 1);
    return count === 0 ? baseId : `${baseId}-${count + 1}`;
  };

  return (
    <article className="space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <header className="space-y-3">
        <Link href="/blog" className="text-sm text-[#C8A87C]">
          ← ブログ一覧へ戻る
        </Link>
        <p className="text-xs uppercase tracking-wide text-[#C8A87C]">
          {BLOG_CATEGORY_LABELS[post.category]}
        </p>
        <h1 className="text-3xl font-bold leading-tight">{post.title}</h1>
        <p className="text-[#B8B3C4]">{post.description}</p>
        <p className="text-xs text-[#B8B3C4]">
          公開日: {post.date} / 更新日: {post.updated}
        </p>
      </header>

      {tableOfContents.length > 0 ? (
        <aside className="rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-semibold text-[#E8E4F0]">目次</p>
          <ul className="mt-2 space-y-2 text-sm text-[#B8B3C4]">
            {tableOfContents.map((heading) => (
              <li key={heading.id} className={heading.level === 3 ? "pl-4" : ""}>
                <a href={`#${heading.id}`} className="hover:text-[#E8E4F0]">
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}

      <div className="rounded-lg border border-white/10 bg-white/5 p-6">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children }) => {
              const text = getTextFromNode(children);
              const id = resolveHeadingId(text);
              return (
                <h2 id={id} className="mt-10 text-2xl font-bold text-[#E8E4F0]">
                  {children}
                </h2>
              );
            },
            h3: ({ children }) => {
              const text = getTextFromNode(children);
              const id = resolveHeadingId(text);
              return (
                <h3 id={id} className="mt-8 text-xl font-semibold text-[#E8E4F0]">
                  {children}
                </h3>
              );
            },
            p: ({ children }) => <p className="mt-4 leading-8 text-[#E8E4F0]">{children}</p>,
            ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6">{children}</ul>,
            ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6">{children}</ol>,
            a: ({ href, children }) => (
              <a href={href} className="text-[#C8A87C] underline underline-offset-2">
                {children}
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote className="mt-4 border-l-2 border-[#C8A87C]/50 pl-4 italic text-[#D1CCDF]">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className="rounded bg-[#19142A] px-1.5 py-0.5 text-sm text-[#E8E4F0]">{children}</code>
            )
          }}
        >
          {post.body}
        </ReactMarkdown>
      </div>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-semibold text-[#E8E4F0]">この記事をシェア</p>
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-[#C8A87C]">
          <a href={`https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
            Xでシェア
          </a>
          <a
            href={`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            LINEでシェア
          </a>
        </div>
      </section>

      {relatedPosts.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">関連記事</h2>
          <ul className="grid gap-3 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <li key={relatedPost.slug} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="mb-1 text-xs text-[#C8A87C]">{BLOG_CATEGORY_LABELS[relatedPost.category]}</p>
                <h3 className="text-base font-semibold">
                  <Link href={`/blog/${relatedPost.slug}`}>{relatedPost.title}</Link>
                </h3>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
