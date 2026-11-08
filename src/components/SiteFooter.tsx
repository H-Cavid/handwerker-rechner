// src/components/SiteFooter.tsx
import type { Locale } from "@/lib/i18n";

const CONTACT_EMAIL = "javid.hasanov22@outlook.com"; // ← dəyiş
const GITHUB_URL = "https://github.com/H-Cavid/handwerker-rechner";

const TEXT: Record<Locale, string> = {
  de: "Demo-Projekt von Javid Hasanov · keine Verbindung zu einem Softwareanbieter. Ihre E-Mail-Adresse wird nur in HubSpot (EU-Rechenzentrum) gespeichert. Löschung jederzeit per E-Mail an",
  it: "Progetto demo di Javid Hasanov · nessun legame con un fornitore di software. Il tuo indirizzo e-mail viene salvato solo in HubSpot (data center UE). Cancellazione in qualsiasi momento scrivendo a",
  en: "Demo project by Javid Hasanov · not affiliated with any software vendor. Your email address is stored only in HubSpot (EU data center). Request deletion anytime at",
  es: "Proyecto demo de Javid Hasanov · sin relación con ningún proveedor de software. Tu correo electrónico solo se guarda en HubSpot (centro de datos en la UE). Puedes solicitar su eliminación en cualquier momento escribiendo a",
  nl: "Demoproject van Javid Hasanov · niet verbonden aan een softwareleverancier. Je e-mailadres wordt alleen opgeslagen in HubSpot (EU-datacenter). Verwijdering kun je altijd aanvragen via",
};

export default function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="mx-auto max-w-5xl px-4 pb-28 pt-4 text-xs leading-relaxed text-slate-500">
      {TEXT[locale]}{" "}
      <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-slate-700">
        {CONTACT_EMAIL}
      </a>
      {" · "}
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-700">
        GitHub
      </a>
    </footer>
  );
}

