// src/components/ConsentBanner.tsx
"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getConsent, setConsent } from "@/lib/consent";

const TEXT: Record<Locale, { text: string; accept: string; decline: string }> = {
  de: {
    text: "Wir verwenden Google Analytics und Mixpanel, um zu verstehen, wie der Rechner genutzt wird. Ihre Eingaben und Ihre E-Mail-Adresse werden dabei nicht an diese Dienste übermittelt.",
    accept: "Akzeptieren",
    decline: "Ablehnen",
  },
  it: {
    text: "Usiamo Google Analytics e Mixpanel per capire come viene utilizzato il calcolatore. I dati inseriti e il tuo indirizzo e-mail non vengono inviati a questi servizi.",
    accept: "Accetta",
    decline: "Rifiuta",
  },
  en: {
    text: "We use Google Analytics and Mixpanel to understand how the calculator is used. Your inputs and email address are not sent to these services.",
    accept: "Accept",
    decline: "Decline",
  },
  es: {
    text: "Usamos Google Analytics y Mixpanel para entender cómo se utiliza la calculadora. Los datos que introduces y tu correo electrónico no se envían a estos servicios.",
    accept: "Aceptar",
    decline: "Rechazar",
  },
  nl: {
    text: "We gebruiken Google Analytics en Mixpanel om te begrijpen hoe de calculator wordt gebruikt. Je invoer en je e-mailadres worden niet naar deze diensten gestuurd.",
    accept: "Accepteren",
    decline: "Weigeren",
  },
};

export default function ConsentBanner({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);

  // Yalnız seçim edilməyibsə göstər
  useEffect(() => {
    setVisible(getConsent() === null);
  }, []);

  if (!visible) return null;
  const t = TEXT[locale];

  function choose(value: "granted" | "denied") {
    setConsent(value);
    setVisible(false);
  }

  return (
    <div role="dialog" aria-live="polite" className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-slate-200 sm:flex-row sm:items-center">
        <p className="flex-1 text-sm text-slate-700">{t.text}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 sm:flex-none"
          >
            {t.decline}
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="flex-1 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 sm:flex-none"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}