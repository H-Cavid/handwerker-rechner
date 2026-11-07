// src/lib/track.ts
// Bütün event-ləri BİR yerdən həm Mixpanel-ə, həm GA4-ə göndəririk.

import mixpanel from "mixpanel-browser";
import { sendGAEvent } from "@next/third-parties/google";
import { getConsent } from "@/lib/consent";

const MP_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
let mpReady = false;

export function initTracking() {
  if (typeof window === "undefined" || mpReady || !MP_TOKEN) return;
  mixpanel.init(MP_TOKEN, {
    api_host: "https://api-eu.mixpanel.com", // EU data residency
    track_pageview: true,
    persistence: "localStorage",
  });
  mpReady = true;
}

// Funnel addımları: yalnız bu adlara icazə var
export type TrackEvent =
  | "calc_started"
  | "ai_advice_requested"
  | "lead_form_opened"
  | "lead_submitted"
  | "report_downloaded";

export function track(
  event: TrackEvent,
  props: Record<string, string | number | boolean> = {}
) {
  if (typeof window === "undefined") return;
  const data = { ...props, locale: document.documentElement.lang || "de" };

  if (mpReady) mixpanel.track(event, data);
  if (GA_ID && getConsent() === "granted") sendGAEvent("event", event, data);

  if (process.env.NODE_ENV === "development") console.log("[track]", event, data);
}