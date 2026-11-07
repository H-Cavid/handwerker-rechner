// src/app/api/lead/route.ts
// Lead-i HubSpot-a göndərir + kalkulyator nəticələri ilə "qualify" edir.

import { NextResponse } from "next/server";
import {
  calculateHourlyRate,
  DEFAULT_INPUT,
  type CalculatorInput,
} from "@/lib/calculator";
import { DICTIONARIES, type Locale } from "@/lib/i18n";

const PORTAL_ID = process.env.HUBSPOT_PORTAL_ID;
const FORM_ID = process.env.HUBSPOT_FORM_ID;

// Hesab EU data mərkəzindədir → api-eu1 host-u
const HUBSPOT_URL = `https://api-eu1.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PAGE_NAMES: Record<Locale, string> = {
  de: "Stundensatz-Rechner",
  it: "Calcolatore tariffa oraria",
  en: "Hourly Rate Calculator",
};

type Field = { objectTypeId: string; name: string; value: string };
const field = (name: string, value: string | number): Field => ({
  objectTypeId: "0-1",
  name,
  value: String(value),
});

function isValidInput(value: unknown): value is CalculatorInput {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return Object.keys(DEFAULT_INPUT).every(
    (key) => typeof obj[key] === "number" && Number.isFinite(obj[key])
  );
}

// Satış üçün prioritet: A = isti lead, B = orta, C = soyuq
function leadTier(annualGap: number, teamSize: number): "A" | "B" | "C" {
  if (annualGap >= 10000 || teamSize >= 3) return "A";
  if (annualGap > 0) return "B";
  return "C";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName, pageUri, input, currentRate } = body ?? {};
    const locale: Locale = ["de", "it", "en"].includes(body?.locale) ? body.locale : "de";

    if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (!PORTAL_ID || !FORM_ID) throw new Error("HubSpot env variables missing");

    // Əsas sahələr
    const base: Field[] = [field("email", email.trim())];
    if (typeof firstName === "string" && firstName.trim()) {
      base.push(field("firstname", firstName.trim().slice(0, 100)));
    }

    // Qualification sahələri: rəqəmləri serverdə YENİDƏN hesablayırıq
    const qualification: Field[] = [];
    if (isValidInput(input) && typeof currentRate === "number" && Number.isFinite(currentRate)) {
      const r = calculateHourlyRate(input, DICTIONARIES[locale].vatRate);
      const annualGap = Math.max(0, Math.round((r.netRate - currentRate) * r.billableHours));
      qualification.push(
        field("hr_net_rate", r.netRate),
        field("hr_current_rate", currentRate),
        field("hr_annual_gap", annualGap),
        field("hr_team_size", input.workers),
        field("hr_language", locale),
        field("hr_lead_tier", leadTier(annualGap, input.workers))
      );
    }

    const submit = (fields: Field[]) =>
      fetch(HUBSPOT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields,
          context: {
            pageUri: typeof pageUri === "string" ? pageUri : undefined,
            pageName: PAGE_NAMES[locale],
          },
        }),
      });

    let res = await submit([...base, ...qualification]);

    // HubSpot əlavə sahələri rədd etsə: lead itməsin, yalnız əsas sahələrlə təkrar göndər
    if (!res.ok && qualification.length > 0) {
      console.warn("HubSpot rejected qualification fields, retrying basic:", res.status, await res.text());
      res = await submit(base);
    }

    if (!res.ok) {
      console.error("HubSpot error:", res.status, await res.text());
      return NextResponse.json({ error: "Submission failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lead error:", error);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}