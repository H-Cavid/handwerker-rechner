// src/components/Analytics.tsx
"use client";

import { useEffect } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { initTracking } from "@/lib/track";

export default function Analytics() {
  useEffect(() => {
    initTracking();
  }, []);

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return gaId ? <GoogleAnalytics gaId={gaId} /> : null;
}