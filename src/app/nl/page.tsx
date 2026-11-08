// src/app/nl/page.tsx — Nederlandse versie (/nl)
import type { Metadata } from "next";
import Calculator from "@/components/Calculator";

export const metadata: Metadata = {
  title: "Uurtarief-calculator voor vakmensen",
  description: "Bereken in 2 minuten je echte minimale uurtarief.",
};

export default function DutchPage() {
  return <Calculator locale="nl" />;
}
