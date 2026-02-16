export const siteConfig = {
  name: "開運ルナカレンダー",
  description:
    "月の満ち欠け × タロットカードで毎日の運勢がわかる開運カレンダーアプリのサービスサイト。",
  defaultUrl: "https://www.kaiun-calendar.com"
};

export function getSiteUrl(): string {
  const envValue = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (!envValue) return siteConfig.defaultUrl;
  return envValue.replace(/\/$/, "");
}
