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
  de: "German",
  it: "Italian",
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


    const prompt = `Data of a trade business (Handwerk):
- Annual costs: ${euro(r.totalCosts)} (owner salary ${euro(input.ownerSalary)}, vehicle ${euro(input.vehicleCosts)}, insurance ${euro(input.insuranceCosts)}, tools ${euro(input.toolCosts)}, other ${euro(input.otherCosts)}, employee wages ${euro(input.employeeWages)})
- Productive people: ${input.workers}
- Working days per person: ${r.workDays}, ${input.hoursPerDay} h/day
- Billable share of time: ${input.billableSharePercent} %
- Billable hours per year: ${Math.round(r.billableHours)}
- Minimum net hourly rate (incl. ${input.profitPercent} % profit): ${euro(r.netRate)}
- Current hourly rate: ${euro(currentRate)}

Give a short, personal assessment: where is the biggest lever (price, billable time or costs)? Name one concrete action for the next 30 days.

IMPORTANT: Write your entire answer in ${LANGUAGE_NAMES[locale]} only.`;



        // Əsas model alınmasa (429 limit / 503 yüklənmə), ehtiyat modelə keçirik
    const models = [MODEL, "gemini-2.5-flash-lite"];
    let advice = "";
    let lastError: unknown;

    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { systemInstruction: INSTRUCTIONS[locale] },
        });
        // Markdown simvollarını təmizləyirik
        advice = (response.text ?? "").replace(/[*_#]/g, "").trim();
        if (advice) break;
      } catch (err) {
        lastError = err;
        console.warn(`Model ${model} failed, trying next`, err);
      }
    }

    if (!advice) throw lastError ?? new Error("Empty response");
    return NextResponse.json({ advice });
  } catch (error) {
    console.error("AI advice error:", error);
    return NextResponse.json({ error: "AI unavailable" }, { status: 500 });
  }
}