// src/components/LeadForm.tsx
"use client";

import { useState } from "react";
import type { CalculatorInput, CalculatorResult } from "@/lib/calculator";
import { DICTIONARIES, type Locale } from "@/lib/i18n";
import { downloadReport } from "@/lib/report";
import { track } from "@/lib/track";

type Status = "idle" | "loading" | "success" | "error";

type Props = {
  locale: Locale;
  input: CalculatorInput;
  result: CalculatorResult;
  currentRate: number;
  advice: string;
};

export default function LeadForm({ locale, input, result, currentRate, advice }: Props) {
  const t = DICTIONARIES[locale].lead;
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, locale, pageUri: window.location.href, input, currentRate }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      track("lead_submitted");
    } catch {
      setStatus("error");
    }
  }

  function handleDownload() {
    track("report_downloaded");
    downloadReport({ locale, input, result, currentRate, advice: advice || undefined });
  }

  // Uğurlu göndərişdən sonra: təşəkkür + yükləmə düyməsi
  if (status === "success") {
    return (
      <div className="mt-6 space-y-3 rounded-lg bg-green-500/15 p-4">
        <p className="text-sm text-green-200">
          {t.thanks}
          {firstName ? `, ${firstName}` : ""}! {t.received} ✅
        </p>
        <button
          type="button"
          onClick={handleDownload}
          className="w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600"
        >
          {t.download}
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          track("lead_form_opened");
        }}
        className="mt-6 w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600"
      >
        {t.cta}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <input
        type="text"
        placeholder={t.firstName}
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="w-full rounded-lg bg-slate-800 px-3 py-2 text-white outline-none ring-1 ring-slate-600 focus:ring-2 focus:ring-orange-400"
      />
      <input
        type="email"
        required
        placeholder={t.email}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg bg-slate-800 px-3 py-2 text-white outline-none ring-1 ring-slate-600 focus:ring-2 focus:ring-orange-400"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
      >
        {status === "loading" ? t.sending : t.submit}
      </button>
      {status === "error" && <p className="text-sm text-red-300">{t.error}</p>}
      <p className="text-xs leading-snug text-slate-400">{t.consent}</p>
    </form>
  );
}