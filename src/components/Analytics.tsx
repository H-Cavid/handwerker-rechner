// src/components/Analytics.tsx
"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { initTracking } from "@/lib/track";
import { getConsent, CONSENT_EVENT } from "@/lib/consent";

export default function Analytics() {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    // Razılıq varsa tracking-i işə sal; seçim dəyişəndə yenidən yoxla
    const check = () => {
      const ok = getConsent() === "granted";
      setGranted(ok);
      if (ok) initTracking();
    };
    check();
    window.addEventListener(CONSENT_EVENT, check);
    return () => window.removeEventListener(CONSENT_EVENT, check);
  }, []);

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  // GA4 skripti YALNIZ razılıqdan sonra yüklənir
  return granted && gaId ? <GoogleAnalytics gaId={gaId} /> : null;
}