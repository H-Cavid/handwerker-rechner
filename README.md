# Stundensatz-Rechner – AI-powered lead magnet for tradespeople

**Live:** https://handwerker-rechner-brown.vercel.app · [Italiano](https://handwerker-rechner-brown.vercel.app/it) · [English](https://handwerker-rechner-brown.vercel.app/en) · [Español](https://handwerker-rechner-brown.vercel.app/es) · [Nederlands](https://handwerker-rechner-brown.vercel.app/nl)

A free hourly-rate calculator for craft businesses. Owners enter their yearly costs and working time and instantly see the **minimum hourly rate** they need to cover costs and make a profit, plus how much revenue they lose per year at their current price. A personalized AI recommendation and a PDF report turn the result into a qualified lead in HubSpot.

I built it as a self-initiated growth experiment to practise the full loop of AI-powered acquisition: ship a working tool, connect it to the CRM, measure the funnel, and define what to test next.

> Personal demo project – not affiliated with any software vendor.

---

## Funnel

```
calc_started → ai_advice_requested → lead_form_opened → lead_submitted → report_downloaded
   (input)         (Gemini advice)        (PDF offer)       (HubSpot lead)       (value delivered)
```

| Step | What happens | Tracking |
|---|---|---|
| Calculation | Rate is calculated live in the browser (`src/lib/calculator.ts`) | `calc_started` |
| AI advice | Short, personalized recommendation via Gemini API (`/api/advice`) | `ai_advice_requested` |
| Lead capture | Email in exchange for a detailed PDF report (`/api/lead`) | `lead_form_opened`, `lead_submitted` |
| Report | PDF generated client-side with jsPDF | `report_downloaded` |

All events go through one typed `track()` function to **GA4 and Mixpanel (EU)**. Analytics only load after **opt-in consent** (GDPR/TTDSG); no personal data (email, name) is sent to analytics.

## Lead qualification (HubSpot)

The lead route **recalculates the result on the server** (the client is never trusted) and sends these fields to HubSpot together with email and first name:

| Property | Meaning |
|---|---|
| `hr_net_rate` | Required net hourly rate |
| `hr_current_rate` | What the business charges today |
| `hr_annual_gap` | (required rate − current rate) × billable hours per year |
| `hr_team_size` | Productive people in the business |
| `hr_language` | de / it / en / es / nl |
| `hr_lead_tier` | **A** = gap ≥ €10,000 or team ≥ 3 · **B** = gap > 0 · **C** = otherwise |

If HubSpot rejects the extra fields, the lead is re-sent with the basic fields only, so no lead is lost.

**Bug found while testing:** submissions from the live `vercel.app` domain returned `200 OK` but never appeared in HubSpot. I isolated the cause by sending identical test submissions that differed only in `pageUri` – HubSpot silently dropped the ones with the `vercel.app` URL. Removing `pageUri` from the submission context fixed it. Lesson: verify tracking end-to-end in the destination tool, not only the API response.

## Internationalization

German, Italian, English, Spanish and Dutch – each with its own copy, number format and VAT (DE 19 %, IT 22 %, ES 21 %, NL 21 %). Texts, VAT rates and AI language instructions live in one dictionary (`src/lib/i18n.ts`), so adding a market means adding one config block. The Spanish and Dutch versions were added this way after the first three; their texts are AI-assisted translations and would be reviewed by a native speaker before a real launch.

## AI layer

- Model: Gemini Flash-Lite via `@google/genai` (configurable with `GEMINI_MODEL`)
- Prompt keeps answers short, concrete and in the user's language
- **Graceful degradation:** model fallback → rule-based advice, so users still get a recommendation when the free-tier rate limit is hit

---

## Experiment brief

**Hypothesis:** Showing tradespeople their *yearly revenue gap* (not just a recommended hourly rate) creates enough urgency that they exchange their email for a detailed report.

**Primary metric:** calculation-to-lead conversion = `lead_submitted` / `calc_started`

**Secondary metrics:** share of A/B leads, `report_downloaded` / `lead_submitted`, AI advice usage

**Segments:** country/language (DE/IT/EN/ES/NL), lead tier, team size

**Success criteria (first 4 weeks or 300 calculations):** ≥ 8 % calculation-to-lead conversion and ≥ 50 % of leads in tier A or B

**Kill criteria:** < 3 % conversion after 300 calculations, or leads mostly tier C (not relevant for sales) → stop or change the offer

**Status:** built and tested end-to-end; no real traffic yet (portfolio demo).

## Next experiments (ICE-prioritized)

| # | Experiment | Impact | Confidence | Ease | ICE |
|---|---|---|---|---|---|
| 1 | Show the yearly revenue gap *before* the email form vs. only after (A/B test) | 8 | 6 | 8 | 7.3 |
| 2 | Trade-specific defaults (electrician, plumber, painter) via URL, e.g. `?trade=elektro` | 7 | 6 | 7 | 6.7 |
| 3 | Automated follow-up email in HubSpot for tier-A leads with a software trial offer | 9 | 6 | 5 | 6.7 |
| 4 | Polish version + market-specific defaults (wages, holidays) per country | 6 | 6 | 7 | 6.3 |
| 5 | "Quote checker": upload a quote, AI flags missing or underpriced items | 9 | 5 | 3 | 5.7 |

ICE = average of Impact, Confidence and Ease (1–10).

---

## Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS · Gemini API · HubSpot Forms API (EU) · GA4 · Mixpanel (EU) · jsPDF · Vercel

## Run locally

```bash
npm install
npm run dev
```

Create `.env.local`:

```
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.1-flash-lite
HUBSPOT_PORTAL_ID=...
HUBSPOT_FORM_ID=...
NEXT_PUBLIC_GA_ID=...
NEXT_PUBLIC_MIXPANEL_TOKEN=...
```

Secrets (Gemini, HubSpot) are only used in server routes; `NEXT_PUBLIC_*` values are public by design.

---

Javid Hasanov · [javidhasanov.com](https://javidhasanov.com) · [LinkedIn](https://www.linkedin.com/in/javidhasanov-tech/)
