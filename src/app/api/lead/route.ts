// src/app/api/lead/route.ts
// Lead-i HubSpot formasına göndərir → HubSpot avtomatik kontakt yaradır.

import { NextResponse } from "next/server";

const PORTAL_ID = process.env.HUBSPOT_PORTAL_ID;
const FORM_ID = process.env.HUBSPOT_FORM_ID;

// Hesab EU data mərkəzindədir → api-eu1 host-u
const HUBSPOT_URL = `https://api-eu1.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { email, firstName, pageUri, locale } = await request.json();

    if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json(
        { error: "Bitte geben Sie eine gültige E-Mail-Adresse ein." },
        { status: 400 }
      );
    }
    if (!PORTAL_ID || !FORM_ID) throw new Error("HubSpot env variables missing");

    const fields = [{ objectTypeId: "0-1", name: "email", value: email.trim() }];
    if (typeof firstName === "string" && firstName.trim()) {
      fields.push({ objectTypeId: "0-1", name: "firstname", value: firstName.trim().slice(0, 100) });
    }

    const res = await fetch(HUBSPOT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields,
        context: {
          pageUri: typeof pageUri === "string" ? pageUri : undefined,
          pageName:
            locale === "it" ? "Calcolatore tariffa oraria"
            : locale === "en" ? "Hourly Rate Calculator"
            : "Stundensatz-Rechner",
        },
      }),
    });

    if (!res.ok) {
      console.error("HubSpot error:", res.status, await res.text());
      return NextResponse.json({ error: "Übermittlung fehlgeschlagen" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lead error:", error);
    return NextResponse.json({ error: "Übermittlung fehlgeschlagen" }, { status: 500 });
  }
}