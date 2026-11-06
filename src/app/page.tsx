"use client";

import { useState } from "react";
import {
  calculateHourlyRate,
  DEFAULT_INPUT,
  type CalculatorInput,
} from "@/lib/calculator";

// Hər input sahəsinin təsviri: hansı açar, hansı yazı, hansı vahid
type FieldConfig = {
  key: keyof CalculatorInput;
  label: string;
  unit: string;
  step?: number;
};

const COST_FIELDS: FieldConfig[] = [
  { key: "ownerSalary", label: "Unternehmerlohn (Ihr Wunschgehalt)", unit: "€/Jahr", step: 1000 },
  { key: "employeeWages", label: "Bruttolöhne Mitarbeiter", unit: "€/Jahr", step: 1000 },
  { key: "wageOverheadPercent", label: "Lohnnebenkosten", unit: "%" },
  { key: "vehicleCosts", label: "Fahrzeugkosten", unit: "€/Jahr", step: 500 },
  { key: "insuranceCosts", label: "Versicherungen", unit: "€/Jahr", step: 500 },
  { key: "toolCosts", label: "Werkzeug & Maschinen", unit: "€/Jahr", step: 500 },
  { key: "otherCosts", label: "Büro, Miete, Software, Steuerberater", unit: "€/Jahr", step: 500 },
];

const TIME_FIELDS: FieldConfig[] = [
  { key: "workers", label: "Produktive Personen (inkl. Ihnen)", unit: "Pers." },
  { key: "hoursPerDay", label: "Arbeitsstunden pro Tag", unit: "Std." },
  { key: "vacationDays", label: "Urlaubstage", unit: "Tage" },
  { key: "sickDays", label: "Krankheitstage", unit: "Tage" },
  { key: "holidays", label: "Feiertage", unit: "Tage" },
  { key: "billableSharePercent", label: "Davon abrechenbare Zeit", unit: "%" },
  { key: "profitPercent", label: "Gewinn & Wagnis", unit: "%" },
];

// Rəqəmləri alman formatında göstərmək üçün: 1.234,56 €
const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const num = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 });

export default function Home() {
  // State: istifadəçinin yazdığı dəyərlər. Dəyişəndə səhifə yenidən hesablanır.
  const [input, setInput] = useState<CalculatorInput>(DEFAULT_INPUT);
  const [currentRate, setCurrentRate] = useState(50); // Hazırda aldığı qiymət

  const result = calculateHourlyRate(input);
  const gapPerHour = result.netRate - currentRate;
  const gapPerYear = gapPerHour * result.billableHours;

  function update(key: keyof CalculatorInput, value: string) {
    const n = Number(value);
    setInput((prev) => ({ ...prev, [key]: Number.isFinite(n) && n >= 0 ? n : 0 }));
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
            Kostenloser Rechner für Handwerker
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Welcher Stundensatz deckt wirklich Ihre Kosten?
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Viele Betriebe kalkulieren nach Gefühl – und verschenken jedes Jahr tausende Euro.
            Tragen Sie Ihre Zahlen ein und sehen Sie sofort Ihren echten Mindest-Stundensatz.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Section title="1. Ihre Kosten pro Jahr" fields={COST_FIELDS} input={input} onChange={update} />
            <Section title="2. Ihre Arbeitszeit" fields={TIME_FIELDS} input={input} onChange={update} />
          </div>

          <aside className="h-fit rounded-2xl bg-slate-900 p-6 text-white lg:sticky lg:top-6">
            <p className="text-sm text-slate-300">Ihr Mindest-Stundensatz (netto)</p>
            <p className="mt-1 text-5xl font-bold text-orange-400">{euro.format(result.netRate)}</p>
            <p className="mt-1 text-sm text-slate-400">
              {euro.format(result.grossRate)} inkl. 19 % MwSt.
            </p>

            <dl className="mt-6 space-y-2 border-t border-slate-700 pt-4 text-sm">
              <Row label="Nur Kostendeckung (ohne Gewinn)" value={euro.format(result.costPerHour)} />
              <Row label="Jährliche Kosten" value={euro.format(result.totalCosts)} />
              <Row label="Abrechenbare Stunden / Jahr" value={num.format(result.billableHours)} />
              <Row label="Arbeitstage pro Person" value={num.format(result.workDays)} />
            </dl>

            <div className="mt-6 border-t border-slate-700 pt-4">
              <label className="block text-sm text-slate-300">
                Was berechnen Sie aktuell pro Stunde?
                <div className="mt-1 flex items-center rounded-lg bg-slate-800 ring-1 ring-slate-600 focus-within:ring-2 focus-within:ring-orange-400">
                  <input
                    type="number"
                    min={0}
                    value={currentRate}
                    onChange={(e) => setCurrentRate(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full bg-transparent px-3 py-2 text-white outline-none"
                  />
                  <span className="pr-3 text-slate-400">€</span>
                </div>
              </label>

              {gapPerHour > 0 ? (
                <p className="mt-3 rounded-lg bg-red-500/15 p-3 text-sm text-red-200">
                  Sie liegen <strong>{euro.format(gapPerHour)}</strong> pro Stunde unter Ihrem
                  Mindestsatz – das sind ca. <strong>{euro.format(gapPerYear)}</strong> im Jahr.
                </p>
              ) : (
                <p className="mt-3 rounded-lg bg-green-500/15 p-3 text-sm text-green-200">
                  Ihr aktueller Satz deckt Kosten und Gewinn. 👍
                </p>
              )}
            </div>

            {/* Addım 5-də bu düymə HubSpot formasını açacaq */}
            <button
              type="button"
              className="mt-6 w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Ausführlichen PDF-Report per E-Mail erhalten
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

// Təkrar istifadə olunan kiçik komponentlər

function Section({
  title,
  fields,
  input,
  onChange,
}: {
  title: string;
  fields: FieldConfig[];
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
              <input
                type="number"
                min={0}
                step={f.step ?? 1}
                value={input[f.key]}
                onChange={(e) => onChange(f.key, e.target.value)}
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