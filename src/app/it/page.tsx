// src/app/it/page.tsx — İtalyanca versiya (/it)
import type { Metadata } from "next";
import Calculator from "@/components/Calculator";

export const metadata: Metadata = {
  title: "Calcolatore tariffa oraria per artigiani",
  description: "Calcola in 2 minuti la tua vera tariffa oraria minima.",
};

export default function ItalianPage() {
  return <Calculator locale="it" />;
}