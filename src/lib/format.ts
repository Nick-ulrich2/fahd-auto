import type { Car } from "../data/types";

export function formatPrice(value: number, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

export function formatNumber(value: number, locale: string, digits = 0) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}

/** « 2022-03 » → « mars 2022 » dans la langue courante. */
export function formatMonth(ym: string, locale: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(new Date(y, m - 1, 1));
}

export function carTitle(car: Car) {
  return `${car.make} ${car.model}`;
}

export function carFullTitle(car: Car) {
  return `${car.make} ${car.model} ${car.trim} ${car.year}`;
}
