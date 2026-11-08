// src/app/es/page.tsx — Versión en español (/es)
import type { Metadata } from "next";
import Calculator from "@/components/Calculator";

export const metadata: Metadata = {
  title: "Calculadora de tarifa por hora para profesionales de oficios",
  description: "Calcula en 2 minutos tu tarifa por hora mínima real.",
};

export default function SpanishPage() {
  return <Calculator locale="es" />;
}
