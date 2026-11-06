// src/app/api/advice/route.ts
// Bu kod YALNIZ serverdə işləyir. API açarı brauzerə heç vaxt getmir.

import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import {
  calculateHourlyRate,
  DEFAULT_INPUT,
  type CalculatorInput,
} from "@/lib/calculator";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  apiVersion: "v1beta",
});
const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

// Gələn məlumatı yoxlayırıq: bütün sahələr rəqəm olmalıdır
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

    if (!isValidInput(input) || typeof currentRate !== "number") {
      return NextResponse.json({ error: "Ungültige Eingabe" }, { status: 400 });
    }

    // Nəticəni serverdə yenidən hesablayırıq
    const r = calculateHourlyRate(input);

    const prompt = `Daten eines Handwerksbetriebs:
- Jährliche Kosten: ${euro(r.totalCosts)} (davon Unternehmerlohn ${euro(input.ownerSalary)}, Fahrzeug ${euro(input.vehicleCosts)}, Versicherungen ${euro(input.insuranceCosts)}, Werkzeug ${euro(input.toolCosts)}, Sonstiges ${euro(input.otherCosts)}, Mitarbeiterlöhne ${euro(input.employeeWages)})
- Produktive Personen: ${input.workers}
- Arbeitstage pro Person: ${r.workDays}, ${input.hoursPerDay} Std./Tag
- Abrechenbarer Zeitanteil: ${input.billableSharePercent} %
- Abrechenbare Stunden/Jahr: ${Math.round(r.billableHours)}
- Mindest-Stundensatz netto (inkl. ${input.profitPercent} % Gewinn): ${euro(r.netRate)}
- Aktueller Stundensatz: ${euro(currentRate)}

Gib eine kurze, persönliche Einschätzung: Wo liegt der größte Hebel (Preis, abrechenbare Zeit oder Kosten)? Nenne eine konkrete Maßnahme für die nächsten 30 Tage.`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        systemInstruction:
          "Du bist ein erfahrener Betriebsberater für Handwerksbetriebe in Deutschland. " +
          "Antworte auf Deutsch, in der Sie-Form, in höchstens 3 kurzen Sätzen (maximal 60 Wörter). " +
          "Konkret und ehrlich, keine Floskeln, kein Markdown, keine Aufzählungen. " +
          "Keine Steuer- oder Rechtsberatung.",
      },
    });

    // Markdown simvollarını (*, _, #) təmizləyirik: model bəzən təlimata baxmayaraq yazır
    const advice = (response.text ?? "").replace(/[*_#]/g, "").trim();
    if (!advice) throw new Error("Leere Antwort");

    return NextResponse.json({ advice });
  } catch (error) {
    console.error("AI advice error:", error);
    return NextResponse.json({ error: "KI nicht verfügbar" }, { status: 500 });
  }
}