import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const categorySchema = z.enum(["tarot", "kaiun", "koyomi", "moon", "guide"]);
const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category: categorySchema,
  tags: z.array(z.string()).optional().default([]),
  image: z.string().optional(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
});

export type BlogCategory = z.infer<typeof categorySchema>;

export const BLOG_PAGE_SIZE = 12;

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  tarot: "タロット",
  kaiun: "開運",
  koyomi: "暦・吉日",
  moon: "月の満ち欠け",
  guide: "使い方ガイド"
};

export const BLOG_CATEGORY_DESCRIPTIONS: Record<BlogCategory, string> = {
  tarot: "タロットカードの意味・読み方を解説します。",
  kaiun: "日々の運気を整える習慣や開運アクションを紹介します。",
  koyomi: "吉日・凶日など暦情報をわかりやすく解説します。",
  moon: "新月・満月の過ごし方や月のリズム活用法を紹介します。",
  guide: "アプリの使い方や活用のコツをまとめます。"
};

export type BlogPost = {
  title: string;
  description: string;
  date: string;
  updated: string;
  category: BlogCategory;
  tags: string[];
  image?: string;
  slug: string;
  body: string;
  sourceFile: string;
};

export type BlogHeading = {
  id: string;
  level: 2 | 3;
  text: string;
};

export type PaginatedPosts = {
  posts: BlogPost[];
  page: number;
  totalPages: number;
  totalItems: number;
};

function parseBlogFile(filePath: string): BlogPost {
  const content = fs.readFileSync(filePath, "utf8");
  const parsed = matter(content);
  const frontmatter = frontmatterSchema.parse(parsed.data);

  return {
    ...frontmatter,
    body: parsed.content.trim(),
    sourceFile: path.basename(filePath)
  };
}

function getBlogFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith(".mdx"))
    .filter((name) => !name.startsWith("_"))
    .map((name) => path.join(BLOG_DIR, name));
}

export function getAllPosts(): BlogPost[] {
  const posts = getBlogFiles().map(parseBlogFile);
  const slugSet = new Set<string>();

  for (const post of posts) {
    if (slugSet.has(post.slug)) {
      throw new Error(`Duplicate slug detected: ${post.slug}`);
    }
    slugSet.add(post.slug);
  }

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getAllCategories(): BlogCategory[] {
  return categorySchema.options;
}

export function parsePageParam(value: string | undefined): number {
  const numeric = Number.parseInt(value ?? "1", 10);
  if (!Number.isFinite(numeric) || numeric <= 0) return 1;
  return numeric;
}

export function paginatePosts(posts: BlogPost[], pageParam: string | undefined): PaginatedPosts {
  if (posts.length === 0) {
    return {
      posts: [],
      page: 1,
      totalPages: 1,
      totalItems: 0
    };
  }

  const totalPages = Math.max(1, Math.ceil(posts.length / BLOG_PAGE_SIZE));
  const requestedPage = parsePageParam(pageParam);
  const page = Math.min(requestedPage, totalPages);
  const start = (page - 1) * BLOG_PAGE_SIZE;
  const end = start + BLOG_PAGE_SIZE;

  return {
    posts: posts.slice(start, end),
    page,
    totalPages,
    totalItems: posts.length
  };
}

export function getRelatedPosts(basePost: BlogPost, limit = 3): BlogPost[] {
  const posts = getAllPosts().filter((post) => post.slug !== basePost.slug);
  const sameCategoryPosts = posts.filter((post) => post.category === basePost.category);
  const restPosts = posts.filter((post) => post.category !== basePost.category);

  return [...sameCategoryPosts, ...restPosts].slice(0, limit);
}

function normalizeHeadingText(text: string): string {
  return text
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

export function slugifyHeading(text: string): string {
  const normalized = text
    .trim()
    .toLowerCase()
    .replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return normalized || "section";
}

export function extractHeadings(markdown: string): BlogHeading[] {
  const headingPattern = /^(##|###)\s+(.+)$/gm;
  const headings: BlogHeading[] = [];
  const idCountMap = new Map<string, number>();

  for (const match of markdown.matchAll(headingPattern)) {
    const marker = match[1];
    const text = normalizeHeadingText(match[2]);
    if (!text) continue;

    const level = marker === "##" ? 2 : 3;
    const baseId = slugifyHeading(text);
    const currentCount = idCountMap.get(baseId) ?? 0;
    idCountMap.set(baseId, currentCount + 1);
    const id = currentCount === 0 ? baseId : `${baseId}-${currentCount + 1}`;

    headings.push({
      id,
      level,
      text
    });
  }

  return headings;
}
