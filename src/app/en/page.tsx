// src/app/en/page.tsx — English version (/en)
import type { Metadata } from "next";
import Calculator from "@/components/Calculator";

export const metadata: Metadata = {
  title: "Hourly Rate Calculator for Tradespeople",
  description: "Find your real minimum hourly rate in 2 minutes.",
};

export default function EnglishPage() {
  return <Calculator locale="en" />;
}