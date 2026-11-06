// src/lib/calculator.ts
// Handwerker üçün real saatlıq qiyməti hesablayan "təmiz" funksiya.
// UI-dan asılı deyil: rəqəm alır, rəqəm qaytarır.

export type CalculatorInput = {
  // --- İllik xərclər (€/il) ---
  ownerSalary: number;          // Unternehmerlohn
  employeeWages: number;        // İşçilərin brutto maaşları (cəmi)
  wageOverheadPercent: number;  // Lohnnebenkosten, %
  vehicleCosts: number;         // Avtomobil
  insuranceCosts: number;       // Sığorta
  toolCosts: number;            // Alətlər, avadanlıq
  otherCosts: number;           // Ofis, icarə, proqram, Steuerberater

  // --- Vaxt ---
  workers: number;              // Produktiv işləyən adam sayı (sahibkar daxil)
  vacationDays: number;         // Məzuniyyət günləri / il
  sickDays: number;             // Xəstəlik günləri / il
  holidays: number;             // Bayram günləri / il
  hoursPerDay: number;          // Gündəlik iş saatı
  billableSharePercent: number; // Vaxtın neçə %-i müştəriyə yazılır

  // --- Mənfəət ---
  profitPercent: number;        // Gewinn & Wagnis, %
};

export type CalculatorResult = {
  totalCosts: number;    // İllik bütün xərclər
  workDays: number;      // Bir nəfər üçün real iş günləri
  billableHours: number; // Bütün komanda üçün hesablana bilən saatlar
  costPerHour: number;   // Xərcləri ödəmək üçün minimum qiymət
  netRate: number;       // Mənfəətlə tövsiyə olunan qiymət (netto)
  grossRate: number;     // + 19% MwSt.
};

const WORKDAYS_PER_YEAR = 52 * 5; // 260
const VAT = 0.19;

// Default dəyərlər: tək işləyən Handwerker nümunəsi
export const DEFAULT_INPUT: CalculatorInput = {
  ownerSalary: 50000,
  employeeWages: 0,
  wageOverheadPercent: 21,
  vehicleCosts: 8000,
  insuranceCosts: 4000,
  toolCosts: 3000,
  otherCosts: 6000,
  workers: 1,
  vacationDays: 30,
  sickDays: 10,
  holidays: 10,
  hoursPerDay: 8,
  billableSharePercent: 75,
  profitPercent: 15,
};

// 2 rəqəm vergüldən sonra yuvarlaqlaşdırma
const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculateHourlyRate(input: CalculatorInput): CalculatorResult {
  // 1) İllik xərclər
  const wageCosts = input.employeeWages * (1 + input.wageOverheadPercent / 100);
  const totalCosts =
    input.ownerSalary +
    wageCosts +
    input.vehicleCosts +
    input.insuranceCosts +
    input.toolCosts +
    input.otherCosts;

  // 2) Hesablana bilən saatlar
  const workDays = Math.max(
    0,
    WORKDAYS_PER_YEAR - input.vacationDays - input.sickDays - input.holidays
  );
  const billableHours =
    input.workers * workDays * input.hoursPerDay * (input.billableSharePercent / 100);

  // 0-a bölmənin qarşısını alırıq (məs. istifadəçi saatı 0 yazsa)
  if (billableHours <= 0) {
    return {
      totalCosts: round2(totalCosts),
      workDays,
      billableHours: 0,
      costPerHour: 0,
      netRate: 0,
      grossRate: 0,
    };
  }

  // 3) Qiymətlər
  const costPerHour = totalCosts / billableHours;
  const netRate = costPerHour * (1 + input.profitPercent / 100);
  const grossRate = netRate * (1 + VAT);

  return {
    totalCosts: round2(totalCosts),
    workDays,
    billableHours: round2(billableHours),
    costPerHour: round2(costPerHour),
    netRate: round2(netRate),
    grossRate: round2(grossRate),
  };
}