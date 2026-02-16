import type { MetadataRoute } from "next";
import { getAllCategories, getAllPosts } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const today = new Date();
  const posts = getAllPosts();
  const categories = getAllCategories();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: today, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/blog`, lastModified: today, changeFrequency: "daily", priority: 0.9 },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.4
    }
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteUrl}/blog/category/${category}`,
    lastModified: today,
    changeFrequency: "weekly",
    priority: 0.7
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated),
    changeFrequency: "monthly",
    priority: 0.8
  }));

  return [...staticPages, ...categoryPages, ...postPages];
}
