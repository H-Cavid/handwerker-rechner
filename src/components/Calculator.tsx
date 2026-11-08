// src/components/Calculator.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  calculateHourlyRate,
  DEFAULT_INPUT,
  type CalculatorInput,
} from "@/lib/calculator";
import { DICTIONARIES, type Field, type Locale } from "@/lib/i18n";
import { track } from "@/lib/track";
import AiAdvice from "@/components/AiAdvice";
import LeadForm from "@/components/LeadForm";
import ConsentBanner from "@/components/ConsentBanner";
import SiteFooter from "@/components/SiteFooter";


export default function Calculator({ locale }: { locale: Locale }) {
  const t = DICTIONARIES[locale];
  const euro = new Intl.NumberFormat(t.numberLocale, { style: "currency", currency: "EUR" });
  const num = new Intl.NumberFormat(t.numberLocale, { maximumFractionDigits: 0 });

  const [input, setInput] = useState<CalculatorInput>(DEFAULT_INPUT);
  const [currentRate, setCurrentRate] = useState(50);
  const [advice, setAdvice] = useState(""); // AI tövsiyəsi PDF üçün
  const startedRef = useRef(false); // calc_started yalnız bir dəfə

  // <html lang> dilə uyğunlaşsın (track() locale-i buradan oxuyur)
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const result = calculateHourlyRate(input, t.vatRate);
  const gapPerHour = result.netRate - currentRate;
  const gapPerYear = gapPerHour * result.billableHours;

  function markStarted(field: string) {
    if (startedRef.current) return;
    startedRef.current = true;
    track("calc_started", { field });
  }

  function update(key: keyof CalculatorInput, value: string) {
    markStarted(key);
    const n = Number(value);
    setInput((prev) => ({ ...prev, [key]: Number.isFinite(n) && n >= 0 ? n : 0 }));
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
              {t.eyebrow}
            </p>
            <nav className="flex gap-1 text-sm font-semibold" aria-label={t.switchLabel}>
              <LangLink href="/" active={locale === "de"}>DE</LangLink>
              <LangLink href="/it" active={locale === "it"}>IT</LangLink>
              <LangLink href="/en" active={locale === "en"}>EN</LangLink>
              <LangLink href="/es" active={locale === "es"}>ES</LangLink>
              <LangLink href="/nl" active={locale === "nl"}>NL</LangLink>
            </nav>
          </div>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{t.title}</h1>
          <p className="mt-3 max-w-2xl text-slate-600">{t.intro}</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Section title={t.costsTitle} fields={t.costFields} input={input} onChange={update} />
            <Section title={t.timeTitle} fields={t.timeFields} input={input} onChange={update} />
          </div>

          <aside className="h-fit rounded-2xl bg-slate-900 p-6 text-white lg:sticky lg:top-6">
            <p className="text-sm text-slate-300">{t.netLabel}</p>
            <p className="mt-1 text-5xl font-bold text-orange-400">{euro.format(result.netRate)}</p>
            <p className="mt-1 text-sm text-slate-400">
              {euro.format(result.grossRate)} {t.grossSuffix}
            </p>

            <dl className="mt-6 space-y-2 border-t border-slate-700 pt-4 text-sm">
              <Row label={t.rowCostOnly} value={euro.format(result.costPerHour)} />
              <Row label={t.rowAnnualCosts} value={euro.format(result.totalCosts)} />
              <Row label={t.rowBillableHours} value={num.format(result.billableHours)} />
              <Row label={t.rowWorkDays} value={num.format(result.workDays)} />
            </dl>

            <div className="mt-6 border-t border-slate-700 pt-4">
              <label className="block text-sm text-slate-300">
                {t.currentRateLabel}
                <div className="mt-1 flex items-center rounded-lg bg-slate-800 ring-1 ring-slate-600 focus-within:ring-2 focus-within:ring-orange-400">
                  <NumberInput
                    value={currentRate}
                    onChange={(raw) => {
                      markStarted("currentRate");
                      setCurrentRate(Math.max(0, Number(raw) || 0));
                    }}
                    className="w-full bg-transparent px-3 py-2 text-white outline-none"
                  />
                  <span className="pr-3 text-slate-400">€</span>
                </div>
              </label>

              {gapPerHour > 0 ? (
                <p className="mt-3 rounded-lg bg-red-500/15 p-3 text-sm text-red-200">
                  {t.gapPrefix}
                  <strong>{euro.format(gapPerHour)}</strong>
                  {t.gapMid}
                  <strong>{euro.format(gapPerYear)}</strong>
                  {t.gapSuffix}
                </p>
              ) : (
                <p className="mt-3 rounded-lg bg-green-500/15 p-3 text-sm text-green-200">
                  {t.okText}
                </p>
              )}
            </div>

            <AiAdvice input={input} currentRate={currentRate} locale={locale} onAdvice={setAdvice} />
            <LeadForm
              locale={locale}
              input={input}
              result={result}
              currentRate={currentRate}
              advice={advice}
            />
          </aside>
        </div>
      </div>
            <SiteFooter locale={locale} />
    <ConsentBanner locale={locale} />
    </main>
  );
}

// ---- Kiçik köməkçi komponentlər ----

function LangLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "rounded-md bg-slate-900 px-2 py-1 text-white"
          : "rounded-md px-2 py-1 text-slate-500 hover:text-slate-900"
      }
    >
      {children}
    </Link>
  );
}

function Section({
  title,
  fields,
  input,
  onChange,
}: {
  title: string;
  fields: Field[];
  input: CalculatorInput;
  onChange: (key: keyof CalculatorInput, value: string) => void;
}) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.key} className="block">
            <span className="text-sm text-slate-600">{f.label}</span>
            <div className="mt-1 flex items-center rounded-lg ring-1 ring-slate-300 focus-within:ring-2 focus-within:ring-orange-500">
              <NumberInput
                value={input[f.key]}
                step={f.step}
                onChange={(raw) => onChange(f.key, raw)}
                className="w-full rounded-lg bg-transparent px-3 py-2 outline-none"
              />
              <span className="whitespace-nowrap pr-3 text-sm text-slate-400">{f.unit}</span>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-400">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

// Rəqəm sahəsi: yazılan mətni ayrıca saxlayır (boşaltmaq mümkün olsun, "088" olmasın)
function NumberInput({
  value,
  onChange,
  step,
  className,
}: {
  value: number;
  onChange: (raw: string) => void;
  step?: number;
  className?: string;
}) {
  const [text, setText] = useState(String(value));

  return (
    <input
      type="number"
      inputMode="decimal"
      min={0}
      step={step ?? 1}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onChange(e.target.value);
      }}
      onBlur={() => setText(text === "" ? "0" : String(Number(text)))}
      className={className}
    />
  );
}