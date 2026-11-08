// src/lib/i18n.ts
// Bütün mətnlər bir yerdə. Yeni dil = yeni lüğət.

import type { CalculatorInput } from "@/lib/calculator";

export type Locale = "de" | "it" | "en" | "es" | "nl";

export const LOCALES: Locale[] = ["de", "it", "en", "es", "nl"];

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
    download: string;
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
    cta: "Ausführlichen PDF-Report herunterladen",
    firstName: "Vorname",
    email: "E-Mail-Adresse *",
    submit: "Report anfordern",
    sending: "Wird gesendet…",
    thanks: "Danke",
    received: "Ihre Anfrage ist eingegangen.",
    download: "📄 PDF-Report herunterladen",
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
    cta: "Scarica il report PDF dettagliato",
    firstName: "Nome",
    email: "Indirizzo e-mail *",
    submit: "Richiedi il report",
    sending: "Invio in corso…",
    thanks: "Grazie",
    received: "La tua richiesta è stata ricevuta.",
    download: "📄 Scarica il report PDF",
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
    cta: "Download the detailed PDF report",
    firstName: "First name",
    email: "Email address *",
    submit: "Request report",
    sending: "Sending…",
    thanks: "Thank you",
    received: "Your request has been received.",
    download: "📄 Download PDF report",
    consent: "By submitting, you agree that we may contact you by email. You can unsubscribe at any time.",
    error: "Submission failed. Please try again later.",
  },
};

const es: Dictionary = {
  numberLocale: "es-ES",
  vatRate: 0.21, // IVA en España: 21 %
  switchLabel: "Idioma",
  eyebrow: "Calculadora gratuita para profesionales de oficios",
  title: "¿Qué tarifa por hora cubre de verdad tus costes?",
  intro:
    "Muchas empresas calculan a ojo y pierden miles de euros cada año. Introduce tus números y descubre al instante tu tarifa por hora mínima real.",
  costsTitle: "1. Tus costes anuales",
  timeTitle: "2. Tu tiempo de trabajo",
  costFields: [
    { key: "ownerSalary", label: "Sueldo del titular (ingreso deseado)", unit: "€/año", step: 1000 },
    { key: "employeeWages", label: "Salarios brutos de empleados", unit: "€/año", step: 1000 },
    { key: "wageOverheadPercent", label: "Cargas sociales sobre salarios", unit: "%" },
    { key: "vehicleCosts", label: "Costes del vehículo", unit: "€/año", step: 500 },
    { key: "insuranceCosts", label: "Seguros", unit: "€/año", step: 500 },
    { key: "toolCosts", label: "Herramientas y maquinaria", unit: "€/año", step: 500 },
    { key: "otherCosts", label: "Oficina, alquiler, software, gestoría", unit: "€/año", step: 500 },
  ],
  timeFields: [
    { key: "workers", label: "Personas productivas (incl. tú)", unit: "pers." },
    { key: "hoursPerDay", label: "Horas de trabajo al día", unit: "h" },
    { key: "vacationDays", label: "Días de vacaciones", unit: "días" },
    { key: "sickDays", label: "Días de baja por enfermedad", unit: "días" },
    { key: "holidays", label: "Días festivos", unit: "días" },
    { key: "billableSharePercent", label: "Tiempo facturable", unit: "%" },
    { key: "profitPercent", label: "Beneficio y riesgo", unit: "%" },
  ],
  netLabel: "Tu tarifa por hora mínima (sin IVA)",
  grossSuffix: "IVA 21 % incluido",
  rowCostOnly: "Solo cubrir costes (sin beneficio)",
  rowAnnualCosts: "Costes anuales",
  rowBillableHours: "Horas facturables / año",
  rowWorkDays: "Días laborables por persona",
  currentRateLabel: "¿Cuánto cobras actualmente por hora?",
  gapPrefix: "Estás ",
  gapMid: " por hora por debajo de tu tarifa mínima: unos ",
  gapSuffix: " al año.",
  okText: "Tu tarifa actual cubre costes y beneficio. 👍",
  ai: {
    button: "✨ Recomendación personalizada con IA",
    loading: "La IA está analizando tus números…",
    error: "La recomendación de IA no está disponible ahora. Inténtalo de nuevo más tarde.",
  },
  lead: {
    cta: "Descargar el informe PDF detallado",
    firstName: "Nombre",
    email: "Correo electrónico *",
    submit: "Solicitar informe",
    sending: "Enviando…",
    thanks: "Gracias",
    received: "Hemos recibido tu solicitud.",
    download: "📄 Descargar informe PDF",
    consent: "Al enviar, aceptas que te contactemos por correo electrónico. Puedes darte de baja en cualquier momento.",
    error: "No se pudo enviar. Inténtalo de nuevo más tarde.",
  },
};

const nl: Dictionary = {
  numberLocale: "nl-NL",
  vatRate: 0.21, // btw in Nederland: 21 %
  switchLabel: "Taal",
  eyebrow: "Gratis calculator voor vakmensen",
  title: "Welk uurtarief dekt echt je kosten?",
  intro:
    "Veel bedrijven rekenen op gevoel – en laten elk jaar duizenden euro's liggen. Vul je cijfers in en zie direct je echte minimale uurtarief.",
  costsTitle: "1. Je jaarlijkse kosten",
  timeTitle: "2. Je werktijd",
  costFields: [
    { key: "ownerSalary", label: "Ondernemersloon (gewenst inkomen)", unit: "€/jaar", step: 1000 },
    { key: "employeeWages", label: "Brutolonen medewerkers", unit: "€/jaar", step: 1000 },
    { key: "wageOverheadPercent", label: "Werkgeverslasten", unit: "%" },
    { key: "vehicleCosts", label: "Voertuigkosten", unit: "€/jaar", step: 500 },
    { key: "insuranceCosts", label: "Verzekeringen", unit: "€/jaar", step: 500 },
    { key: "toolCosts", label: "Gereedschap & machines", unit: "€/jaar", step: 500 },
    { key: "otherCosts", label: "Kantoor, huur, software, boekhouder", unit: "€/jaar", step: 500 },
  ],
  timeFields: [
    { key: "workers", label: "Productieve personen (incl. jij)", unit: "pers." },
    { key: "hoursPerDay", label: "Werkuren per dag", unit: "uur" },
    { key: "vacationDays", label: "Vakantiedagen", unit: "dagen" },
    { key: "sickDays", label: "Ziektedagen", unit: "dagen" },
    { key: "holidays", label: "Feestdagen", unit: "dagen" },
    { key: "billableSharePercent", label: "Declarabel deel van de tijd", unit: "%" },
    { key: "profitPercent", label: "Winst & risico", unit: "%" },
  ],
  netLabel: "Je minimale uurtarief (excl. btw)",
  grossSuffix: "incl. 21% btw",
  rowCostOnly: "Alleen kostendekkend (zonder winst)",
  rowAnnualCosts: "Jaarlijkse kosten",
  rowBillableHours: "Declarabele uren / jaar",
  rowWorkDays: "Werkdagen per persoon",
  currentRateLabel: "Wat reken je nu per uur?",
  gapPrefix: "Je zit ",
  gapMid: " per uur onder je minimale tarief – dat is ongeveer ",
  gapSuffix: " per jaar.",
  okText: "Je huidige tarief dekt kosten en winst. 👍",
  ai: {
    button: "✨ Persoonlijk AI-advies",
    loading: "AI analyseert je cijfers…",
    error: "Het AI-advies is nu niet beschikbaar. Probeer het later opnieuw.",
  },
  lead: {
    cta: "Download het uitgebreide PDF-rapport",
    firstName: "Voornaam",
    email: "E-mailadres *",
    submit: "Rapport aanvragen",
    sending: "Bezig met verzenden…",
    thanks: "Bedankt",
    received: "Je aanvraag is ontvangen.",
    download: "📄 PDF-rapport downloaden",
    consent: "Door te verzenden ga je ermee akkoord dat we per e-mail contact met je opnemen. Afmelden kan altijd.",
    error: "Verzenden mislukt. Probeer het later opnieuw.",
  },
};

export const DICTIONARIES: Record<Locale, Dictionary> = { de, it, en, es, nl };