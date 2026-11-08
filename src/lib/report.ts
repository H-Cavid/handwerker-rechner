// src/lib/report.ts
// İstifadəçinin öz rəqəmləri ilə PDF hesabat yaradır (brauzerdə, serversiz).

import type { CalculatorInput, CalculatorResult } from "@/lib/calculator";
import { DICTIONARIES, type Locale } from "@/lib/i18n";

const TEXT: Record<Locale, {
  title: string; created: string; result: string; inputs: string;
  current: string; advice: string; disclaimer: string; file: string;
}> = {
  de: {
    title: "Ihr persönlicher Stundensatz-Report",
    created: "Erstellt am",
    result: "Ergebnis",
    inputs: "Ihre Eingaben",
    current: "Ihr aktueller Stundensatz",
    advice: "Empfehlung",
    disclaimer: "Alle Angaben ohne Gewähr. Dieser Report ersetzt keine Steuer- oder Unternehmensberatung.",
    file: "Stundensatz-Report.pdf",
  },
  it: {
    title: "Il tuo report personale sulla tariffa oraria",
    created: "Creato il",
    result: "Risultato",
    inputs: "I tuoi dati",
    current: "La tua tariffa attuale",
    advice: "Consiglio",
    disclaimer: "Informazioni senza garanzia. Questo report non sostituisce una consulenza fiscale o aziendale.",
    file: "Report-tariffa-oraria.pdf",
  },
  en: {
    title: "Your personal hourly rate report",
    created: "Created on",
    result: "Result",
    inputs: "Your inputs",
    current: "Your current hourly rate",
    advice: "Recommendation",
    disclaimer: "No guarantee of accuracy. This report does not replace tax or business advice.",
    file: "Hourly-rate-report.pdf",
  },
  es: {
    title: "Tu informe personal de tarifa por hora",
    created: "Creado el",
    result: "Resultado",
    inputs: "Tus datos",
    current: "Tu tarifa actual por hora",
    advice: "Recomendación",
    disclaimer: "Información sin garantía. Este informe no sustituye el asesoramiento fiscal o empresarial.",
    file: "Informe-tarifa-por-hora.pdf",
  },
  nl: {
    title: "Je persoonlijke uurtariefrapport",
    created: "Gemaakt op",
    result: "Resultaat",
    inputs: "Je invoer",
    current: "Je huidige uurtarief",
    advice: "Advies",
    disclaimer: "Alle informatie zonder garantie. Dit rapport vervangt geen fiscaal of bedrijfsadvies.",
    file: "Uurtarief-rapport.pdf",
  },
};

// PDF-in standart şrifti emoji və bəzi xüsusi simvolları dəstəkləmir, onları təmizləyirik
function clean(s: string): string {
  return s
    .replace(/[\u00A0\u202F]/g, " ")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^\x00-\xFF€]/g, "")
    .trim();
}

export async function downloadReport(opts: {
  locale: Locale;
  input: CalculatorInput;
  result: CalculatorResult;
  currentRate: number;
  advice?: string;
}) {
  // Kitabxananı yalnız lazım olanda yükləyirik (səhifə daha sürətli açılır)
  const { jsPDF } = await import("jspdf");
  const { locale, input, result, currentRate, advice } = opts;
  const t = DICTIONARIES[locale];
  const r = TEXT[locale];
  const euro = new Intl.NumberFormat(t.numberLocale, { style: "currency", currency: "EUR" });
  const num = new Intl.NumberFormat(t.numberLocale, { maximumFractionDigits: 0 });

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const M = 18; // kənar boşluq
  let y = 0;

  const ensureSpace = (needed: number) => {
    if (y + needed > 280) {
      doc.addPage();
      y = 20;
    }
  };

  const heading = (text: string) => {
    ensureSpace(16);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(clean(text), M, y);
    y += 2;
    doc.setDrawColor(226, 232, 240);
    doc.line(M, y, W - M, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
  };

  const row = (label: string, value: string) => {
    ensureSpace(6);
    doc.setTextColor(71, 85, 105);
    doc.text(clean(label), M, y);
    doc.setTextColor(15, 23, 42);
    doc.text(clean(value), W - M, y, { align: "right" });
    y += 6;
  };

  // --- Başlıq zolağı ---
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, W, 34, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(251, 146, 60);
  doc.text(clean(t.eyebrow.toUpperCase()), M, 12);
  doc.setFontSize(17);
  doc.setTextColor(255, 255, 255);
  doc.text(clean(r.title), M, 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text(clean(`${r.created} ${new Date().toLocaleDateString(t.numberLocale)}`), M, 29);

  // --- Əsas nəticə ---
  y = 48;
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(clean(t.netLabel), M, y);
  y += 11;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(234, 88, 12);
  doc.text(clean(euro.format(result.netRate)), M, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(clean(`${euro.format(result.grossRate)} ${t.grossSuffix}`), M, y);
  y += 4;

  // --- Nəticə cədvəli ---
  heading(r.result);
  row(t.rowCostOnly, euro.format(result.costPerHour));
  row(t.rowAnnualCosts, euro.format(result.totalCosts));
  row(t.rowBillableHours, num.format(result.billableHours));
  row(t.rowWorkDays, num.format(result.workDays));
  row(r.current, euro.format(currentRate));

  // Fərq mesajı (qırmızı / yaşıl)
  const gapPerHour = result.netRate - currentRate;
  const gapText =
    gapPerHour > 0
      ? `${t.gapPrefix}${euro.format(gapPerHour)}${t.gapMid}${euro.format(gapPerHour * result.billableHours)}${t.gapSuffix}`
      : t.okText;
  y += 2;
  const gapLines = doc.splitTextToSize(clean(gapText), W - 2 * M);
  ensureSpace(gapLines.length * 5 + 4);
  doc.setTextColor(gapPerHour > 0 ? 185 : 21, gapPerHour > 0 ? 28 : 128, gapPerHour > 0 ? 28 : 61);
  doc.text(gapLines, M, y);
  y += gapLines.length * 5;

  // --- AI tövsiyəsi (varsa) ---
  if (advice) {
    heading(r.advice);
    const lines = doc.splitTextToSize(clean(advice), W - 2 * M);
    ensureSpace(lines.length * 5);
    doc.setTextColor(51, 65, 85);
    doc.text(lines, M, y);
    y += lines.length * 5;
  }

  // --- İstifadəçinin daxil etdiyi rəqəmlər ---
  heading(r.inputs);
  for (const f of [...t.costFields, ...t.timeFields]) {
    row(f.label, `${num.format(input[f.key])} ${f.unit}`);
  }

  // --- Alt qeyd ---
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(clean(r.disclaimer), M, 290);

  doc.save(r.file);
}