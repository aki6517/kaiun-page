import type { Metadata } from "next";
import Link from "next/link";
import { TrackingTagSettingsForm } from "@/components/tracking-tag-settings-form";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "計測タグ設定",
  description: "headタグとbodyタグに挿入する計測タグの設定画面です。",
  robots: {
    index: false,
    follow: false
  },
  alternates: {
    canonical: `${getSiteUrl()}/settings/tracking-tags`
  }
};

export default function TrackingTagsSettingsPage() {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <Link href="/" className="text-sm text-[#C8A87C]">
          ← ホームへ戻る
        </Link>
        <h1 className="text-3xl font-bold">計測タグ設定</h1>
        <p className="text-[#B8B3C4]">
          Google AnalyticsやGTMのタグを、head / body 開始 / body終了に設定できます。
        </p>
      </div>

      <TrackingTagSettingsForm />
    </section>
  );
}
