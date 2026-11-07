// src/lib/consent.ts
// İstifadəçinin cookie seçimini saxlayır və dəyişəndə xəbər verir.

export type Consent = "granted" | "denied" | null;

const KEY = "hr_consent";
export const CONSENT_EVENT = "consent-change";

export function getConsent(): Consent {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: "granted" | "denied") {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // localStorage bloklanıbsa, seçim yalnız bu səhifə üçün qüvvədədir
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}