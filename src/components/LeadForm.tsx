// src/components/LeadForm.tsx
"use client";

import { useState } from "react";
import { track } from "@/lib/track";

type Status = "idle" | "loading" | "success" | "error";

export default function LeadForm() {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // Səhifənin yenidən yüklənməsinin qarşısını alır
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, pageUri: window.location.href }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus("success");
      track("lead_submitted");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error && err.message ? err.message : "Bitte später erneut versuchen.");
    }
  }

  // 1) Uğurlu göndərişdən sonra
  if (status === "success") {
    return (
      <p className="mt-6 rounded-lg bg-green-500/15 p-4 text-sm text-green-200">
        Danke{firstName ? `, ${firstName}` : ""}! Ihre Anfrage ist eingegangen. ✅
      </p>
    );
  }

  // 2) Forma bağlıdır → yalnız narıncı düymə
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
        Ausführlichen PDF-Report per E-Mail erhalten
      </button>
    );
  }

  // 3) Forma açıqdır
  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <input
        type="text"
        placeholder="Vorname"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="w-full rounded-lg bg-slate-800 px-3 py-2 text-white outline-none ring-1 ring-slate-600 focus:ring-2 focus:ring-orange-400"
      />
      <input
        type="email"
        required
        placeholder="E-Mail-Adresse *"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg bg-slate-800 px-3 py-2 text-white outline-none ring-1 ring-slate-600 focus:ring-2 focus:ring-orange-400"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
      >
        {status === "loading" ? "Wird gesendet…" : "Report anfordern"}
      </button>
      {status === "error" && <p className="text-sm text-red-300">{errorMsg}</p>}
      <p className="text-xs leading-snug text-slate-400">
        Mit dem Absenden stimmen Sie zu, dass wir Sie per E-Mail kontaktieren. Abmeldung jederzeit möglich.
      </p>
    </form>
  );
}