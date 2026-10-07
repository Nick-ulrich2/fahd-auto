import { SITE } from "../config";
import { vehiclePath } from "../data/catalog";
import type { Car } from "../data/types";
import type { Currency } from "../config";
import { formatMoney, priceText } from "../contexts/CurrencyContext";
import { carFullTitle, formatNumber } from "./format";
import type { TKey } from "../i18n/fr";

type T = (key: TKey, vars?: Record<string, string | number>) => string;

export function siteUrl() {
  return SITE.url || (typeof window !== "undefined" ? window.location.origin : "");
}

export function carUrl(car: Car) {
  return `${siteUrl()}${vehiclePath(car)}`;
}

export function whatsappLink(text: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function emailLink(subject: string, body: string) {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function phoneLink() {
  return `tel:+${SITE.whatsapp}`;
}

function carSummary(car: Car, t: T, locale: string) {
  return [
    `• ${carFullTitle(car)} — ${t("car.ref")} ${car.ref}`,
    `• ${formatNumber(car.mileage, locale)} ${t("unit.km")} · ${t(`fuel.${car.fuel}`)} · ${t(`transmission.${car.transmission}`)}`,
    `• ${t("msg.fromPrice", { v: priceText(car, locale) })}`,
    `• ${t("msg.link", { v: carUrl(car) })}`,
  ].join("\n");
}

/** Message « je veux plus d'infos / votre meilleur prix » pour un véhicule. */
export function carMessage(car: Car, t: T, locale: string) {
  return [t("msg.greeting"), "", t("msg.info"), carSummary(car, t, locale), "", t("msg.price")].join("\n");
}

export function carWhatsapp(car: Car, t: T, locale: string) {
  return whatsappLink(carMessage(car, t, locale));
}

export function carEmail(car: Car, t: T, locale: string) {
  return emailLink(t("msg.subject", { car: carFullTitle(car), ref: car.ref }), carMessage(car, t, locale));
}

export interface Offer {
  name: string;
  country: string;
  amount: number;
  /** Devise de l'offre : FCFA pour les véhicules affichés en FCFA. */
  currency: Currency;
  message: string;
}

export function offerMessage(car: Car, offer: Offer, t: T, locale: string) {
  return [
    t("msg.greeting"),
    "",
    t("msg.offer", { amount: formatMoney(offer.amount, offer.currency, locale) }),
    carSummary(car, t, locale),
    "",
    t("msg.name", { v: offer.name }),
    offer.country ? t("msg.country", { v: offer.country }) : "",
    offer.message ? `\n${offer.message}` : "",
  ]
    .filter((l) => l !== "")
    .join("\n");
}

export function offerSubject(car: Car, t: T) {
  return t("msg.subjectOffer", { car: carFullTitle(car), ref: car.ref });
}

export function favoritesMessage(cars: Car[], t: T) {
  return [t("msg.favorites"), "", ...cars.map((c) => `• ${carFullTitle(c)} (${t("car.ref")} ${c.ref}) — ${carUrl(c)}`)].join(
    "\n",
  );
}
