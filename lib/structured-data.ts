export type BreadcrumbItem = {
  name: string;
  url: string;
};

export function createBreadcrumbListJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function createWebPageJsonLd(params: {
  name: string;
  description: string;
  url: string;
}) {
  const { name, description, url } = params;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url
  };
}

export function createBlogJsonLd(params: {
  name: string;
  description: string;
  url: string;
}) {
  const { name, description, url } = params;
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name,
    description,
    url
  };
}

