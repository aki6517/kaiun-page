"use client";

import { useEffect } from "react";
import {
  EMPTY_TRACKING_TAG_CONFIG,
  getEnvTrackingTagConfig,
  TRACKING_UPDATED_EVENT,
  TRACKING_STORAGE_KEY,
  type TrackingTagConfig
} from "@/lib/tracking-tags";

type TrackingSlot = "head" | "bodyStart" | "bodyEnd";

const SLOT_ATTRIBUTE = "data-kaiun-tracking-slot";

function cloneNodeWithExecutableScripts(node: Element, slot: TrackingSlot): Node {
  if (node.tagName.toLowerCase() === "script") {
    const source = node as HTMLScriptElement;
    const script = document.createElement("script");
    for (const { name, value } of Array.from(source.attributes)) {
      script.setAttribute(name, value);
    }
    script.text = source.textContent ?? "";
    script.setAttribute(SLOT_ATTRIBUTE, slot);
    return script;
  }

  const cloned = node.cloneNode(false) as Element;
  cloned.setAttribute(SLOT_ATTRIBUTE, slot);

  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      cloned.appendChild(cloneNodeWithExecutableScripts(child as Element, slot));
      continue;
    }
    cloned.appendChild(child.cloneNode(true));
  }

  return cloned;
}

function parseNodes(html: string, slot: TrackingSlot): Node[] {
  const trimmed = html.trim();
  if (!trimmed) return [];

  const template = document.createElement("template");
  template.innerHTML = trimmed;

  return Array.from(template.content.childNodes)
    .map((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        return cloneNodeWithExecutableScripts(node as Element, slot);
      }
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        return document.createTextNode(node.textContent);
      }
      return null;
    })
    .filter((node): node is Node => node !== null);
}

function removeSlotNodes(slot: TrackingSlot): void {
  document.querySelectorAll(`[${SLOT_ATTRIBUTE}="${slot}"]`).forEach((node) => node.remove());
}

function applySlot(slot: TrackingSlot, html: string): void {
  removeSlotNodes(slot);
  const nodes = parseNodes(html, slot);
  if (nodes.length === 0) return;

  if (slot === "head") {
    nodes.forEach((node) => document.head.appendChild(node));
    return;
  }

  if (slot === "bodyStart") {
    for (let index = nodes.length - 1; index >= 0; index -= 1) {
      document.body.insertBefore(nodes[index], document.body.firstChild);
    }
    return;
  }

  nodes.forEach((node) => document.body.appendChild(node));
}

function parseStoredConfig(value: string | null): TrackingTagConfig {
  if (!value) return EMPTY_TRACKING_TAG_CONFIG;
  try {
    return JSON.parse(value) as TrackingTagConfig;
  } catch {
    return EMPTY_TRACKING_TAG_CONFIG;
  }
}

function getEffectiveConfig(): TrackingTagConfig {
  const envConfig = getEnvTrackingTagConfig();
  const stored = parseStoredConfig(localStorage.getItem(TRACKING_STORAGE_KEY));

  return {
    headTags: stored.headTags || envConfig.headTags,
    bodyStartTags: stored.bodyStartTags || envConfig.bodyStartTags,
    bodyEndTags: stored.bodyEndTags || envConfig.bodyEndTags
  };
}

function applyTrackingTags(): void {
  const config = getEffectiveConfig();
  applySlot("head", config.headTags);
  applySlot("bodyStart", config.bodyStartTags);
  applySlot("bodyEnd", config.bodyEndTags);
}

export function TrackingTagInjector() {
  useEffect(() => {
    applyTrackingTags();

    const handleUpdate = () => applyTrackingTags();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === TRACKING_STORAGE_KEY) applyTrackingTags();
    };

    window.addEventListener(TRACKING_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(TRACKING_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return null;
}
