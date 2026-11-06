// src/components/AiAdvice.tsx
"use client";

import { useState } from "react";
import type { CalculatorInput } from "@/lib/calculator";

type Props = {
  input: CalculatorInput;
  currentRate: number;
};

export default function AiAdvice({ input, currentRate }: Props) {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getAdvice() {
    setLoading(true);
    setError("");
    setAdvice("");
    try {
      const res = await fetch("/api/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, currentRate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAdvice(data.advice);
    } catch {
      setError("Die KI-Empfehlung ist gerade nicht verfügbar. Bitte versuchen Sie es später erneut.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 border-t border-slate-700 pt-4">
      <button
        type="button"
        onClick={getAdvice}
        disabled={loading}
        className="w-full rounded-lg border border-orange-400 px-4 py-3 font-semibold text-orange-300 hover:bg-orange-400/10 disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? "KI analysiert Ihre Zahlen…" : "✨ Persönliche KI-Empfehlung"}
      </button>

      {advice && (
        <p className="mt-3 rounded-lg bg-slate-800 p-3 text-sm leading-relaxed text-slate-200">
          {advice}
        </p>
      )}
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
    </div>
  );
}