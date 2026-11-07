// src/app/api/advice/route.ts
// Bu kod YALNIZ serverdə işləyir. API açarı brauzerə heç vaxt getmir.

import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import {
  calculateHourlyRate,
  DEFAULT_INPUT,
  type CalculatorInput,
} from "@/lib/calculator";
import { DICTIONARIES, type Locale } from "@/lib/i18n";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  apiVersion: "v1beta",
});
const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

// Hər dil üçün öz təlimatı
const LANGUAGE_NAMES: Record<Locale, string> = {
  de: "Deutsch",
  it: "Italiano",
  en: "English",
};
const INSTRUCTIONS: Record<Locale, string> = {
  de:
    "Du bist ein erfahrener Betriebsberater für Handwerksbetriebe in Deutschland. " +
    "Antworte auf Deutsch, in der Sie-Form, in höchstens 3 kurzen Sätzen (maximal 60 Wörter). " +
    "Konkret und ehrlich, keine Floskeln, kein Markdown, keine Aufzählungen. " +
    "Keine Steuer- oder Rechtsberatung.",
  it:
    "Sei un consulente esperto per imprese artigiane in Italia. " +
    "Rispondi in italiano, dando del tu, in massimo 3 frasi brevi (massimo 60 parole). " +
    "Concreto e onesto, niente frasi fatte, niente Markdown, niente elenchi. " +
    "Nessuna consulenza fiscale o legale.",
  en:
    "You are an experienced business consultant for trade businesses (Handwerk) in Germany. " +
    "Answer in English, in at most 3 short sentences (max. 60 words). " +
    "Concrete and honest, no filler, no Markdown, no bullet points. " +
    "No tax or legal advice.",
};

function isValidInput(value: unknown): value is CalculatorInput {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return Object.keys(DEFAULT_INPUT).every(
    (key) => typeof obj[key] === "number" && Number.isFinite(obj[key])
  );
}

const euro = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { input, currentRate } = body ?? {};

    const locale: Locale = body?.locale === "it" || body?.locale === "en" ? body.locale : "de";

    if (!isValidInput(input) || typeof currentRate !== "number") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const r = calculateHourlyRate(input, DICTIONARIES[locale].vatRate);

    const prompt = `Daten eines Handwerksbetriebs:
- Jährliche Kosten: ${euro(r.totalCosts)} (davon Unternehmerlohn ${euro(input.ownerSalary)}, Fahrzeug ${euro(input.vehicleCosts)}, Versicherungen ${euro(input.insuranceCosts)}, Werkzeug ${euro(input.toolCosts)}, Sonstiges ${euro(input.otherCosts)}, Mitarbeiterlöhne ${euro(input.employeeWages)})
- Produktive Personen: ${input.workers}
- Arbeitstage pro Person: ${r.workDays}, ${input.hoursPerDay} Std./Tag
- Abrechenbarer Zeitanteil: ${input.billableSharePercent} %
- Abrechenbare Stunden/Jahr: ${Math.round(r.billableHours)}
- Mindest-Stundensatz netto (inkl. ${input.profitPercent} % Gewinn): ${euro(r.netRate)}
- Aktueller Stundensatz: ${euro(currentRate)}

Gib eine kurze, persönliche Einschätzung: Wo liegt der größte Hebel (Preis, abrechenbare Zeit oder Kosten)? Nenne eine konkrete Maßnahme für die nächsten 30 Tage. Answer language: ${LANGUAGE_NAMES[locale]}.`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { systemInstruction: INSTRUCTIONS[locale] },
    });

    // Markdown simvollarını təmizləyirik
    const advice = (response.text ?? "").replace(/[*_#]/g, "").trim();
    if (!advice) throw new Error("Empty response");

    return NextResponse.json({ advice });
  } catch (error) {
    console.error("AI advice error:", error);
    return NextResponse.json({ error: "AI unavailable" }, { status: 500 });
  }
}