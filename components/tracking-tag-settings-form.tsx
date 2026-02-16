"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getEnvTrackingTagConfig,
  getGa4Preset,
  getGtmPreset,
  normalizeTrackingTagConfig,
  TRACKING_STORAGE_KEY,
  TRACKING_UPDATED_EVENT,
  type TrackingTagConfig
} from "@/lib/tracking-tags";

const emptyConfig: TrackingTagConfig = {
  headTags: "",
  bodyStartTags: "",
  bodyEndTags: ""
};

function readStoredConfig(): TrackingTagConfig {
  const rawValue = localStorage.getItem(TRACKING_STORAGE_KEY);
  if (!rawValue) return emptyConfig;

  try {
    return normalizeTrackingTagConfig(JSON.parse(rawValue) as Partial<TrackingTagConfig>);
  } catch {
    return emptyConfig;
  }
}

function saveConfig(config: TrackingTagConfig): void {
  localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(config));
  window.dispatchEvent(new Event(TRACKING_UPDATED_EVENT));
}

export function TrackingTagSettingsForm() {
  const envConfig = useMemo(() => getEnvTrackingTagConfig(), []);
  const [isReady, setIsReady] = useState(false);
  const [ga4Id, setGa4Id] = useState("");
  const [gtmId, setGtmId] = useState("");
  const [headTags, setHeadTags] = useState("");
  const [bodyStartTags, setBodyStartTags] = useState("");
  const [bodyEndTags, setBodyEndTags] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = readStoredConfig();
    setHeadTags(stored.headTags || envConfig.headTags);
    setBodyStartTags(stored.bodyStartTags || envConfig.bodyStartTags);
    setBodyEndTags(stored.bodyEndTags || envConfig.bodyEndTags);
    setIsReady(true);
  }, [envConfig.bodyEndTags, envConfig.bodyStartTags, envConfig.headTags]);

  if (!isReady) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-[#B8B3C4]">
        設定を読み込み中です...
      </div>
    );
  }

  const currentConfig = normalizeTrackingTagConfig({
    headTags,
    bodyStartTags,
    bodyEndTags,
    updatedAt: new Date().toISOString()
  });

  const onSave = () => {
    saveConfig(currentConfig);
    setMessage("保存しました。現在のブラウザですぐ反映されています。");
  };

  const onClear = () => {
    localStorage.removeItem(TRACKING_STORAGE_KEY);
    window.dispatchEvent(new Event(TRACKING_UPDATED_EVENT));
    setHeadTags(envConfig.headTags);
    setBodyStartTags(envConfig.bodyStartTags);
    setBodyEndTags(envConfig.bodyEndTags);
    setMessage("ローカル設定を削除しました。環境変数設定に戻ります。");
  };

  const onPresetGa4 = () => {
    const preset = getGa4Preset(ga4Id);
    setHeadTags(preset.headTags);
    setBodyStartTags(preset.bodyStartTags);
    setBodyEndTags(preset.bodyEndTags);
    setMessage("GA4テンプレートを反映しました。IDを確認して保存してください。");
  };

  const onPresetGtm = () => {
    const preset = getGtmPreset(gtmId);
    setHeadTags(preset.headTags);
    setBodyStartTags(preset.bodyStartTags);
    setBodyEndTags(preset.bodyEndTags);
    setMessage("GTMテンプレートを反映しました。IDを確認して保存してください。");
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-[#B8B3C4]">
        <p className="font-semibold text-[#E8E4F0]">使い方</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>GA4/GTMのIDを入れてテンプレート作成、またはタグを直接貼り付ける</li>
          <li>「このブラウザに保存」で即時反映する</li>
          <li>本番へ共通反映する場合は、Vercel環境変数も設定する</li>
        </ol>
      </section>

      <section className="grid gap-4 rounded-xl border border-white/10 bg-white/5 p-5 md:grid-cols-2">
        <div className="space-y-3">
          <label className="text-sm text-[#B8B3C4]" htmlFor="ga4-id">
            GA4 Measurement ID
          </label>
          <input
            id="ga4-id"
            value={ga4Id}
            onChange={(event) => setGa4Id(event.target.value)}
            placeholder="G-XXXXXXXXXX"
            className="w-full rounded-lg border border-white/15 bg-[#141122] px-3 py-2 text-sm text-[#E8E4F0] outline-none focus:border-[#C8A87C]"
          />
          <button
            type="button"
            onClick={onPresetGa4}
            className="rounded-full border border-[#C8A87C]/40 bg-[#C8A87C]/15 px-4 py-2 text-sm text-[#E8E4F0]"
          >
            GA4テンプレート適用
          </button>
        </div>
        <div className="space-y-3">
          <label className="text-sm text-[#B8B3C4]" htmlFor="gtm-id">
            GTM Container ID
          </label>
          <input
            id="gtm-id"
            value={gtmId}
            onChange={(event) => setGtmId(event.target.value)}
            placeholder="GTM-XXXXXXX"
            className="w-full rounded-lg border border-white/15 bg-[#141122] px-3 py-2 text-sm text-[#E8E4F0] outline-none focus:border-[#C8A87C]"
          />
          <button
            type="button"
            onClick={onPresetGtm}
            className="rounded-full border border-[#C8A87C]/40 bg-[#C8A87C]/15 px-4 py-2 text-sm text-[#E8E4F0]"
          >
            GTMテンプレート適用
          </button>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
        <label className="flex flex-col gap-2 text-sm text-[#B8B3C4]" htmlFor="head-tags">
          <span className="font-medium text-[#E8E4F0]">headタグ挿入用</span>
          <textarea
            id="head-tags"
            rows={10}
            value={headTags}
            onChange={(event) => setHeadTags(event.target.value)}
            className="w-full rounded-lg border border-white/15 bg-[#141122] px-3 py-3 font-mono text-xs text-[#E8E4F0] outline-none focus:border-[#C8A87C]"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-[#B8B3C4]" htmlFor="body-start-tags">
          <span className="font-medium text-[#E8E4F0]">body開始直後に挿入</span>
          <textarea
            id="body-start-tags"
            rows={8}
            value={bodyStartTags}
            onChange={(event) => setBodyStartTags(event.target.value)}
            className="w-full rounded-lg border border-white/15 bg-[#141122] px-3 py-3 font-mono text-xs text-[#E8E4F0] outline-none focus:border-[#C8A87C]"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-[#B8B3C4]" htmlFor="body-end-tags">
          <span className="font-medium text-[#E8E4F0]">body閉じタグ直前に挿入</span>
          <textarea
            id="body-end-tags"
            rows={8}
            value={bodyEndTags}
            onChange={(event) => setBodyEndTags(event.target.value)}
            className="w-full rounded-lg border border-white/15 bg-[#141122] px-3 py-3 font-mono text-xs text-[#E8E4F0] outline-none focus:border-[#C8A87C]"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSave}
            className="rounded-full border border-[#C8A87C]/40 bg-[#C8A87C]/15 px-5 py-2 text-sm text-[#E8E4F0]"
          >
            このブラウザに保存
          </button>
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-white/20 px-5 py-2 text-sm text-[#B8B3C4]"
          >
            ローカル設定を削除
          </button>
        </div>
        {message ? <p className="text-sm text-[#C8A87C]">{message}</p> : null}
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-[#B8B3C4]">
        <p className="font-semibold text-[#E8E4F0]">本番共通で使う環境変数（Vercel）</p>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-white/15 bg-[#141122] p-3 font-mono text-xs text-[#E8E4F0]">
{`NEXT_PUBLIC_TRACKING_HEAD_TAGS="<script>...</script>"
NEXT_PUBLIC_TRACKING_BODY_START_TAGS="<noscript>...</noscript>"
NEXT_PUBLIC_TRACKING_BODY_END_TAGS="<script>...</script>"`}
        </pre>
      </section>
    </div>
  );
}
