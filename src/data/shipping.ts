/**
 * Estimations pour le calculateur « prix livré ».
 * ⚠️ Ordres de grandeur à ajuster selon vos tarifs réels (transitaires, compagnies maritimes) et la réglementation de chaque pays.
 *
 * - shipping : coût de transport estimé en euros pour une voiture standard, par origine (null = non proposé) ;
 *   il est multiplié selon le type de véhicule (VEHICLE_FACTOR).
 * - customs : droits et taxes d'importation estimés, en % de la valeur CIF (prix + transport). Très variable selon l'âge,
 *   la cylindrée et la valeur retenue par la douane : ce n'est qu'une indication.
 */
import type { Car, Location } from "./types";

export type Origin = "europe" | "dubai";

export interface Destination {
  /** Code pays ISO (le nom du pays est affiché dans la langue du visiteur). */
  country: string;
  /** Port ou ville d'arrivée. */
  place: string;
  shipping: Record<Origin, number | null>;
  customs: number;
}

export const DESTINATIONS: Destination[] = [
  { country: "CM", place: "Douala", shipping: { europe: 1300, dubai: 1800 }, customs: 55 },
  { country: "CI", place: "Abidjan", shipping: { europe: 1100, dubai: 1700 }, customs: 45 },
  { country: "SN", place: "Dakar", shipping: { europe: 1000, dubai: 1800 }, customs: 50 },
  { country: "TG", place: "Lomé", shipping: { europe: 1100, dubai: 1700 }, customs: 45 },
  { country: "BJ", place: "Cotonou", shipping: { europe: 1100, dubai: 1700 }, customs: 45 },
  { country: "GN", place: "Conakry", shipping: { europe: 1200, dubai: 1800 }, customs: 45 },
  { country: "GA", place: "Libreville", shipping: { europe: 1400, dubai: 1800 }, customs: 50 },
  { country: "CG", place: "Pointe-Noire", shipping: { europe: 1400, dubai: 1800 }, customs: 50 },
  { country: "CD", place: "Matadi", shipping: { europe: 1600, dubai: 1900 }, customs: 45 },
  { country: "NG", place: "Lagos", shipping: { europe: 1300, dubai: 1700 }, customs: 70 },
  { country: "GH", place: "Tema", shipping: { europe: 1100, dubai: 1700 }, customs: 45 },
  { country: "KE", place: "Mombasa", shipping: { europe: 1800, dubai: 900 }, customs: 60 },
  { country: "TZ", place: "Dar es Salaam", shipping: { europe: 1800, dubai: 1000 }, customs: 50 },
  { country: "MA", place: "Casablanca", shipping: { europe: 900, dubai: 1600 }, customs: 40 },
  { country: "MR", place: "Nouakchott", shipping: { europe: 1100, dubai: 1800 }, customs: 40 },
  { country: "AE", place: "Dubaï", shipping: { europe: 1800, dubai: 250 }, customs: 5 },
  // Union européenne : livraison par camion, pas de droits de douane (la TVA dépend de votre situation).
  { country: "BE", place: "Belgique", shipping: { europe: 300, dubai: null }, customs: 0 },
  { country: "FR", place: "France", shipping: { europe: 700, dubai: null }, customs: 0 },
  { country: "NL", place: "Pays-Bas", shipping: { europe: 450, dubai: null }, customs: 0 },
  { country: "DE", place: "Allemagne", shipping: { europe: 700, dubai: null }, customs: 0 },
];

/** Multiplicateur de transport selon le type de véhicule. */
export function vehicleFactor(car: Car) {
  if (car.body === "tricycle") return 0.5;
  if (car.kind === "moto") return 0.3;
  if (car.body === "suv" || car.body === "pickup" || car.body === "van") return 1.3;
  return 1;
}

export function originOf(location: Location): Origin {
  return location === "dubai" ? "dubai" : "europe";
}

export function estimate(car: Car, dest: Destination, includeCustoms: boolean) {
  const base = dest.shipping[originOf(car.location)];
  if (base == null) return null;
  const shipping = Math.round((base * vehicleFactor(car)) / 50) * 50;
  const customs = includeCustoms ? Math.round(((car.priceFrom + shipping) * dest.customs) / 100 / 50) * 50 : 0;
  return { shipping, customs, total: car.priceFrom + shipping + customs };
}
