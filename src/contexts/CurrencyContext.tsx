import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { RATES, type Currency } from "../config";
import type { Car } from "../data/types";

export const CURRENCIES: { code: Currency; label: string }[] = [
  { code: "EUR", label: "€ EUR" },
  { code: "XAF", label: "FCFA" },
  { code: "USD", label: "$ USD" },
  { code: "AED", label: "AED" },
];
const STORAGE_KEY = "fahd-currency";

/** Devise courante, lisible hors React (messages WhatsApp / email). */
let current: Currency = "EUR";
export const getCurrency = () => current;

/** Devise proposée par défaut selon le fuseau horaire du visiteur. */
function detect(): Currency {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Currency | null;
    if (saved && saved in RATES) return saved;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    // Zone franc CFA (Afrique centrale et de l'Ouest).
    if (/^Africa\/(Douala|Libreville|Brazzaville|Bangui|Ndjamena|Malabo|Abidjan|Dakar|Bamako|Ouagadougou|Niamey|Lome|Porto-Novo|Bissau)$/.test(tz)) return "XAF";
    if (tz === "Asia/Dubai" || tz === "Asia/Muscat") return "AED";
    if (tz.startsWith("America/")) return "USD";
  } catch {
    /* stockage ou Intl indisponible */
  }
  return "EUR";
}

export function convert(eur: number, currency: Currency) {
  return eur * RATES[currency];
}

export function formatMoney(amount: number, currency: Currency, locale: string) {
  const step = currency === "XAF" ? 1000 : currency === "EUR" ? 1 : 10;
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(
    Math.round(amount / step) * step,
  );
}

/** Prix d'un véhicule dans une devise (le prix FCFA saisi est utilisé tel quel s'il existe). */
export function vehiclePrice(car: Car, currency: Currency) {
  if (currency === "XAF" && car.priceXaf) return car.priceXaf;
  return convert(car.priceFrom, currency);
}

/** Prix principal dans la devise choisie, et équivalent secondaire (euro, ou FCFA pour les modèles vendus en FCFA). */
export function priceParts(car: Car, locale: string, currency: Currency = current): { main: string; secondary?: string } {
  const main = formatMoney(vehiclePrice(car, currency), currency, locale);
  if (currency !== "EUR") return { main, secondary: formatMoney(car.priceFrom, "EUR", locale) };
  if (car.priceXaf) return { main, secondary: formatMoney(car.priceXaf, "XAF", locale) };
  return { main };
}

/** Prix sur une ligne, pour les messages. */
export function priceText(car: Car, locale: string, currency: Currency = current) {
  const p = priceParts(car, locale, currency);
  return p.secondary ? `${p.main} (≈ ${p.secondary})` : p.main;
}

interface CurrencyApi {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  /** Formate un montant exprimé en euros dans la devise choisie. */
  money: (eur: number, locale: string) => string;
}

const Ctx = createContext<CurrencyApi | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setState] = useState<Currency>("EUR");
  current = currency;

  useEffect(() => {
    setState(detect());
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      /* stockage indisponible */
    }
  }, []);

  const value = useMemo<CurrencyApi>(
    () => ({ currency, setCurrency, money: (eur, locale) => formatMoney(convert(eur, currency), currency, locale) }),
    [currency, setCurrency],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCurrency() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}
