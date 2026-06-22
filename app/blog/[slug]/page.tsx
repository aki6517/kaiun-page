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
import { createBreadcrumbListJsonLd } from "@/lib/structured-data";

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

function getVideoEmbedUrl(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl.trim());
    const host = url.hostname.toLowerCase();

    if (host === "youtu.be") {
      const id = url.pathname.slice(1);
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
      return null;
    }

    if (host.includes("youtube.com")) {
      const videoId = url.searchParams.get("v");
      if (videoId) return `https://www.youtube-nocookie.com/embed/${videoId}`;

      const embedMatch = url.pathname.match(/^\/(?:embed|shorts)\/([^/?#]+)/);
      if (embedMatch?.[1]) {
        return `https://www.youtube-nocookie.com/embed/${embedMatch[1]}`;
      }
      return null;
    }

    if (host.includes("vimeo.com")) {
      const vimeoId = url.pathname.match(/\/(\d+)/)?.[1];
      if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`;
    }
  } catch {
    return null;
  }

  return null;
}

function isExternalLink(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
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
  const categoryUrl = `${siteUrl}/blog/category/${post.category}`;
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
    image: post.image ? `${siteUrl}${post.image.startsWith("/") ? post.image : `/${post.image}`}` : undefined,
    mainEntityOfPage: url
  };
  const breadcrumbJsonLd = createBreadcrumbListJsonLd([
    { name: "ホーム", url: siteUrl },
    { name: "ブログ", url: `${siteUrl}/blog` },
    { name: BLOG_CATEGORY_LABELS[post.category], url: categoryUrl },
    { name: post.title, url }
  ]);

  const resolveHeadingId = (headingText: string) => {
    const baseId = slugifyHeading(headingText);
    const count = headingIdState.get(baseId) ?? 0;
    headingIdState.set(baseId, count + 1);
    return count === 0 ? baseId : `${baseId}-${count + 1}`;
  };

  return (
    <article className="luna-blog-shell space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <header className="luna-blog-card space-y-3">
        <Link href="/blog" className="inline-block text-sm text-[#E8D9C3] hover:text-[#F2E9DA]">
          ← ブログ一覧へ戻る
        </Link>
        <p className="text-xs uppercase tracking-wide text-[#E8D9C3]">
          {BLOG_CATEGORY_LABELS[post.category]}
        </p>
        <h1 className="text-3xl font-bold leading-tight text-[#F7F1E8] md:text-4xl">{post.title}</h1>
        <p className="text-base leading-8 text-[#E8DAD6]">{post.description}</p>
        <p className="text-xs text-[#C7B0B0]">
          公開日: {post.date} / 更新日: {post.updated}
        </p>
      </header>

      {tableOfContents.length > 0 ? (
        <aside className="luna-blog-card">
          <p className="text-sm font-semibold text-[#F7F1E8]">目次（H2 / H3）</p>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-[#C7B0B0]">
            {tableOfContents.map((heading) => (
              <li key={heading.id} className={heading.level === 3 ? "pl-5 text-[#C7B0B0]" : ""}>
                <a href={`#${heading.id}`} className="hover:text-[#F7F1E8] hover:underline">
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}

      <div className="luna-blog-card">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children }) => {
              const text = getTextFromNode(children);
              const id = resolveHeadingId(text);
              return (
                <h2 id={id} className="mt-12 scroll-mt-28 text-2xl font-bold leading-relaxed text-[#F7F1E8]">
                  {children}
                </h2>
              );
            },
            h3: ({ children }) => {
              const text = getTextFromNode(children);
              const id = resolveHeadingId(text);
              return (
                <h3 id={id} className="mt-10 scroll-mt-28 text-xl font-semibold leading-relaxed text-[#F7F1E8]">
                  {children}
                </h3>
              );
            },
            p: ({ children }) => <p className="mt-5 text-[1.03rem] leading-[2.05] text-[#F7F1E8]">{children}</p>,
            ul: ({ children }) => <ul className="mt-5 list-disc space-y-2 pl-6 text-[1.01rem] leading-[2.0]">{children}</ul>,
            ol: ({ children }) => <ol className="mt-5 list-decimal space-y-2 pl-6 text-[1.01rem] leading-[2.0]">{children}</ol>,
            a: ({ href, children }) => (
              <a
                href={href}
                target={href && isExternalLink(href) ? "_blank" : undefined}
                rel={href && isExternalLink(href) ? "noopener noreferrer" : undefined}
                className="text-[#F2E9DA] underline underline-offset-4 hover:text-[#F2E9DA]"
              >
                {children}
              </a>
            ),
            img: ({ src, alt }) => {
              if (!src) return null;
              return (
                <figure className="my-8 overflow-hidden rounded-2xl border border-[#E8D9C3]/30 bg-[#241D21] p-3">
                  <img
                    src={src}
                    alt={alt ?? ""}
                    loading="lazy"
                    className="w-full rounded-xl object-cover shadow-[0_12px_40px_rgba(5,4,12,0.55)]"
                  />
                  {alt ? <figcaption className="mt-3 text-sm text-[#C7B0B0]">{alt}</figcaption> : null}
                </figure>
              );
            },
            blockquote: ({ children }) => (
              <blockquote className="mt-6 rounded-r-xl border-l-2 border-[#E8D9C3]/50 bg-[#2A2226] px-4 py-3 italic text-[#E0CFCB]">
                {children}
              </blockquote>
            ),
            code: ({ className, children }) => {
              const text = getTextFromNode(children).trim();
              if (className?.includes("language-video")) {
                const embedUrl = getVideoEmbedUrl(text);
                if (!embedUrl) {
                  return (
                    <p className="mt-4 rounded-lg border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                      動画URLを読み取れませんでした。YouTubeまたはVimeoのURLを1行で入力してください。
                    </p>
                  );
                }

                return (
                  <div className="my-8 overflow-hidden rounded-2xl border border-[#E8D9C3]/30 bg-[#211A1E] p-3">
                    <div className="relative w-full overflow-hidden rounded-xl pt-[56.25%]">
                      <iframe
                        src={embedUrl}
                        title="Embedded video"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                      />
                    </div>
                  </div>
                );
              }

              if (className) {
                return (
                  <pre className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-[#241D21] p-4 text-sm text-[#F7F1E8]">
                    <code className={className}>{children}</code>
                  </pre>
                );
              }

              return <code className="rounded bg-[#3A3035] px-1.5 py-0.5 text-sm text-[#F7F1E8]">{children}</code>;
            }
          }}
        >
          {post.body}
        </ReactMarkdown>
      </div>

      <section className="luna-blog-card">
        <p className="text-sm font-semibold text-[#F7F1E8]">この記事をシェア</p>
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-[#E8D9C3]">
          <a
            href={`https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#F2E9DA]"
          >
            Xでシェア
          </a>
          <a
            href={`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#F2E9DA]"
          >
            LINEでシェア
          </a>
        </div>
      </section>

      {relatedPosts.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-[#F7F1E8]">関連記事</h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <li key={relatedPost.slug} className="luna-blog-card">
                <p className="mb-1 text-xs text-[#E8D9C3]">{BLOG_CATEGORY_LABELS[relatedPost.category]}</p>
                <h3 className="text-base font-semibold">
                  <Link href={`/blog/${relatedPost.slug}`} className="hover:text-[#F2E9DA]">
                    {relatedPost.title}
                  </Link>
                </h3>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
