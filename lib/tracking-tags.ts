export const TRACKING_STORAGE_KEY = "kaiun-tracking-tags";
export const TRACKING_UPDATED_EVENT = "kaiun-tracking-updated";

export type TrackingTagConfig = {
  headTags: string;
  bodyStartTags: string;
  bodyEndTags: string;
  updatedAt?: string;
};

export const EMPTY_TRACKING_TAG_CONFIG: TrackingTagConfig = {
  headTags: "",
  bodyStartTags: "",
  bodyEndTags: ""
};

export function normalizeTrackingTagConfig(
  value: Partial<TrackingTagConfig> | null | undefined
): TrackingTagConfig {
  return {
    headTags: value?.headTags?.trim() ?? "",
    bodyStartTags: value?.bodyStartTags?.trim() ?? "",
    bodyEndTags: value?.bodyEndTags?.trim() ?? "",
    updatedAt: value?.updatedAt
  };
}

export function getEnvTrackingTagConfig(): TrackingTagConfig {
  return normalizeTrackingTagConfig({
    headTags: process.env.NEXT_PUBLIC_TRACKING_HEAD_TAGS,
    bodyStartTags: process.env.NEXT_PUBLIC_TRACKING_BODY_START_TAGS,
    bodyEndTags: process.env.NEXT_PUBLIC_TRACKING_BODY_END_TAGS
  });
}

export function getGa4Preset(measurementId: string): TrackingTagConfig {
  const id = measurementId.trim().toUpperCase();
  if (!id) return EMPTY_TRACKING_TAG_CONFIG;

  return {
    headTags: `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${id}');
</script>`,
    bodyStartTags: "",
    bodyEndTags: ""
  };
}

export function getGtmPreset(containerId: string): TrackingTagConfig {
  const id = containerId.trim().toUpperCase();
  if (!id) return EMPTY_TRACKING_TAG_CONFIG;

  return {
    headTags: `<script>
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${id}');
</script>`,
    bodyStartTags: `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${id}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`,
    bodyEndTags: ""
  };
}
