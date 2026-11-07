// src/lib/i18n.ts
// Bütün mətnlər bir yerdə. Yeni dil = yeni lüğət.

import type { CalculatorInput } from "@/lib/calculator";

export type Locale = "de" | "it" | "en";

export type Field = {
  key: keyof CalculatorInput;
  label: string;
  unit: string;
  step?: number;
};

export type Dictionary = {
  numberLocale: string;
  vatRate: number;
  switchLabel: string;
  eyebrow: string;
  title: string;
  intro: string;
  costsTitle: string;
  timeTitle: string;
  costFields: Field[];
  timeFields: Field[];
  netLabel: string;
  grossSuffix: string;
  rowCostOnly: string;
  rowAnnualCosts: string;
  rowBillableHours: string;
  rowWorkDays: string;
  currentRateLabel: string;
  gapPrefix: string;
  gapMid: string;
  gapSuffix: string;
  okText: string;
  ai: { button: string; loading: string; error: string };
  lead: {
    cta: string;
    firstName: string;
    email: string;
    submit: string;
    sending: string;
    thanks: string;
    received: string;
    consent: string;
    error: string;
  };
};

const de: Dictionary = {
  numberLocale: "de-DE",
  vatRate: 0.19,
  switchLabel: "Sprache",
  eyebrow: "Kostenloser Rechner für Handwerker",
  title: "Welcher Stundensatz deckt wirklich Ihre Kosten?",
  intro:
    "Viele Betriebe kalkulieren nach Gefühl – und verschenken jedes Jahr tausende Euro. Tragen Sie Ihre Zahlen ein und sehen Sie sofort Ihren echten Mindest-Stundensatz.",
  costsTitle: "1. Ihre Kosten pro Jahr",
  timeTitle: "2. Ihre Arbeitszeit",
  costFields: [
    { key: "ownerSalary", label: "Unternehmerlohn (Ihr Wunschgehalt)", unit: "€/Jahr", step: 1000 },
    { key: "employeeWages", label: "Bruttolöhne Mitarbeiter", unit: "€/Jahr", step: 1000 },
    { key: "wageOverheadPercent", label: "Lohnnebenkosten", unit: "%" },
    { key: "vehicleCosts", label: "Fahrzeugkosten", unit: "€/Jahr", step: 500 },
    { key: "insuranceCosts", label: "Versicherungen", unit: "€/Jahr", step: 500 },
    { key: "toolCosts", label: "Werkzeug & Maschinen", unit: "€/Jahr", step: 500 },
    { key: "otherCosts", label: "Büro, Miete, Software, Steuerberater", unit: "€/Jahr", step: 500 },
  ],
  timeFields: [
    { key: "workers", label: "Produktive Personen (inkl. Ihnen)", unit: "Pers." },
    { key: "hoursPerDay", label: "Arbeitsstunden pro Tag", unit: "Std." },
    { key: "vacationDays", label: "Urlaubstage", unit: "Tage" },
    { key: "sickDays", label: "Krankheitstage", unit: "Tage" },
    { key: "holidays", label: "Feiertage", unit: "Tage" },
    { key: "billableSharePercent", label: "Davon abrechenbare Zeit", unit: "%" },
    { key: "profitPercent", label: "Gewinn & Wagnis", unit: "%" },
  ],
  netLabel: "Ihr Mindest-Stundensatz (netto)",
  grossSuffix: "inkl. 19 % MwSt.",
  rowCostOnly: "Nur Kostendeckung (ohne Gewinn)",
  rowAnnualCosts: "Jährliche Kosten",
  rowBillableHours: "Abrechenbare Stunden / Jahr",
  rowWorkDays: "Arbeitstage pro Person",
  currentRateLabel: "Was berechnen Sie aktuell pro Stunde?",
  gapPrefix: "Sie liegen ",
  gapMid: " pro Stunde unter Ihrem Mindestsatz – das sind ca. ",
  gapSuffix: " im Jahr.",
  okText: "Ihr aktueller Satz deckt Kosten und Gewinn. 👍",
  ai: {
    button: "✨ Persönliche KI-Empfehlung",
    loading: "KI analysiert Ihre Zahlen…",
    error: "Die KI-Empfehlung ist gerade nicht verfügbar. Bitte versuchen Sie es später erneut.",
  },
  lead: {
    cta: "Ausführlichen PDF-Report per E-Mail erhalten",
    firstName: "Vorname",
    email: "E-Mail-Adresse *",
    submit: "Report anfordern",
    sending: "Wird gesendet…",
    thanks: "Danke",
    received: "Ihre Anfrage ist eingegangen.",
    consent: "Mit dem Absenden stimmen Sie zu, dass wir Sie per E-Mail kontaktieren. Abmeldung jederzeit möglich.",
    error: "Übermittlung fehlgeschlagen. Bitte versuchen Sie es später erneut.",
  },
};

const it: Dictionary = {
  numberLocale: "it-IT",
  vatRate: 0.22, // IVA in Italia: 22 %
  switchLabel: "Lingua",
  eyebrow: "Calcolatore gratuito per artigiani",
  title: "Quale tariffa oraria copre davvero i tuoi costi?",
  intro:
    "Molte imprese calcolano a occhio – e perdono migliaia di euro ogni anno. Inserisci i tuoi numeri e scopri subito la tua vera tariffa oraria minima.",
  costsTitle: "1. I tuoi costi annuali",
  timeTitle: "2. Il tuo tempo di lavoro",
  costFields: [
    { key: "ownerSalary", label: "Compenso del titolare (stipendio desiderato)", unit: "€/anno", step: 1000 },
    { key: "employeeWages", label: "Retribuzioni lorde dei dipendenti", unit: "€/anno", step: 1000 },
    { key: "wageOverheadPercent", label: "Contributi e oneri sul personale", unit: "%" },
    { key: "vehicleCosts", label: "Costi del veicolo", unit: "€/anno", step: 500 },
    { key: "insuranceCosts", label: "Assicurazioni", unit: "€/anno", step: 500 },
    { key: "toolCosts", label: "Attrezzi e macchinari", unit: "€/anno", step: 500 },
    { key: "otherCosts", label: "Ufficio, affitto, software, commercialista", unit: "€/anno", step: 500 },
  ],
  timeFields: [
    { key: "workers", label: "Persone produttive (te incluso)", unit: "pers." },
    { key: "hoursPerDay", label: "Ore di lavoro al giorno", unit: "ore" },
    { key: "vacationDays", label: "Giorni di ferie", unit: "giorni" },
    { key: "sickDays", label: "Giorni di malattia", unit: "giorni" },
    { key: "holidays", label: "Giorni festivi", unit: "giorni" },
    { key: "billableSharePercent", label: "Quota di tempo fatturabile", unit: "%" },
    { key: "profitPercent", label: "Utile e rischio d'impresa", unit: "%" },
  ],
  netLabel: "La tua tariffa oraria minima (netta)",
  grossSuffix: "IVA 22 % inclusa",
  rowCostOnly: "Solo copertura dei costi (senza utile)",
  rowAnnualCosts: "Costi annuali",
  rowBillableHours: "Ore fatturabili / anno",
  rowWorkDays: "Giorni lavorativi per persona",
  currentRateLabel: "Quanto fatturi oggi all'ora?",
  gapPrefix: "Sei ",
  gapMid: " all'ora sotto la tua tariffa minima – circa ",
  gapSuffix: " all'anno.",
  okText: "La tua tariffa attuale copre costi e utile. 👍",
  ai: {
    button: "✨ Consiglio personalizzato dell'IA",
    loading: "L'IA sta analizzando i tuoi numeri…",
    error: "Il consiglio dell'IA non è disponibile al momento. Riprova più tardi.",
  },
  lead: {
    cta: "Ricevi il report PDF dettagliato via e-mail",
    firstName: "Nome",
    email: "Indirizzo e-mail *",
    submit: "Richiedi il report",
    sending: "Invio in corso…",
    thanks: "Grazie",
    received: "La tua richiesta è stata ricevuta.",
    consent: "Inviando il modulo accetti di essere contattato via e-mail. Puoi annullare l'iscrizione in qualsiasi momento.",
    error: "Invio non riuscito. Riprova più tardi.",
  },
};

const en: Dictionary = {
  numberLocale: "en-GB",
  vatRate: 0.19, // German market, German VAT
  switchLabel: "Language",
  eyebrow: "Free calculator for tradespeople",
  title: "What hourly rate really covers your costs?",
  intro:
    "Many trade businesses price by gut feeling – and lose thousands of euros every year. Enter your numbers and instantly see your real minimum hourly rate.",
  costsTitle: "1. Your annual costs",
  timeTitle: "2. Your working time",
  costFields: [
    { key: "ownerSalary", label: "Owner's salary (your target income)", unit: "€/year", step: 1000 },
    { key: "employeeWages", label: "Employee gross wages", unit: "€/year", step: 1000 },
    { key: "wageOverheadPercent", label: "Payroll overhead", unit: "%" },
    { key: "vehicleCosts", label: "Vehicle costs", unit: "€/year", step: 500 },
    { key: "insuranceCosts", label: "Insurance", unit: "€/year", step: 500 },
    { key: "toolCosts", label: "Tools & machinery", unit: "€/year", step: 500 },
    { key: "otherCosts", label: "Office, rent, software, accountant", unit: "€/year", step: 500 },
  ],
  timeFields: [
    { key: "workers", label: "Productive people (incl. you)", unit: "ppl" },
    { key: "hoursPerDay", label: "Working hours per day", unit: "hrs" },
    { key: "vacationDays", label: "Vacation days", unit: "days" },
    { key: "sickDays", label: "Sick days", unit: "days" },
    { key: "holidays", label: "Public holidays", unit: "days" },
    { key: "billableSharePercent", label: "Billable share of time", unit: "%" },
    { key: "profitPercent", label: "Profit & risk", unit: "%" },
  ],
  netLabel: "Your minimum hourly rate (net)",
  grossSuffix: "incl. 19% VAT",
  rowCostOnly: "Cost coverage only (no profit)",
  rowAnnualCosts: "Annual costs",
  rowBillableHours: "Billable hours / year",
  rowWorkDays: "Working days per person",
  currentRateLabel: "What do you currently charge per hour?",
  gapPrefix: "You are ",
  gapMid: " per hour below your minimum rate – that's about ",
  gapSuffix: " per year.",
  okText: "Your current rate covers costs and profit. 👍",
  ai: {
    button: "✨ Personal AI recommendation",
    loading: "AI is analysing your numbers…",
    error: "The AI recommendation is unavailable right now. Please try again later.",
  },
  lead: {
    cta: "Get the detailed PDF report by email",
    firstName: "First name",
    email: "Email address *",
    submit: "Request report",
    sending: "Sending…",
    thanks: "Thank you",
    received: "Your request has been received.",
    consent: "By submitting, you agree that we may contact you by email. You can unsubscribe at any time.",
    error: "Submission failed. Please try again later.",
  },
};

export const DICTIONARIES: Record<Locale, Dictionary> = { de, it, en };