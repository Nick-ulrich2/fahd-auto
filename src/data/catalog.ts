import { CARS } from "./cars";
import { MOTOS } from "./motos";
import type { Body, Car, CarBody, Color, Drivetrain, Fuel, Kind, MotoBody, Transmission } from "./types";

export { CARS, MOTOS };

/** Tous les véhicules publiés (voitures puis motos). */
export const VEHICLES: Car[] = [...CARS, ...MOTOS];

export const BODIES: CarBody[] = ["suv", "pickup", "sedan", "hatchback", "estate", "van"];
export const MOTO_BODIES: MotoBody[] = ["commuter", "tricycle", "roadster", "adventure", "sport", "touring", "scooter", "custom"];
export const FUELS: Fuel[] = ["petrol", "diesel", "hybrid", "phev", "electric"];
export const TRANSMISSIONS: Transmission[] = ["automatic", "manual"];
export const DRIVETRAINS: Drivetrain[] = ["4x4", "awd", "fwd", "rwd"];
export const COLORS: Color[] = ["white", "black", "silver", "grey", "blue", "red", "green", "beige", "brown"];
export const COLOR_HEX: Record<Color, string> = {
  white: "#f8f8f6",
  black: "#151515",
  silver: "#c0c4c8",
  grey: "#6f747a",
  blue: "#1f4e8c",
  red: "#b3182c",
  green: "#2f5d3a",
  beige: "#d8c7a6",
  brown: "#6b4a2f",
};

export function listOf(kind: Kind) {
  return kind === "moto" ? MOTOS : CARS;
}

export function bodiesOf(kind: Kind): Body[] {
  return kind === "moto" ? MOTO_BODIES : BODIES;
}

/** Chemin de la fiche : /voiture/<slug> ou /moto/<slug>. */
export function vehiclePath(v: Pick<Car, "kind" | "slug">) {
  return `${v.kind === "moto" ? "/moto" : "/voiture"}/${v.slug}`;
}

/** Chemin de la liste : /voitures ou /motos. */
export function listPath(kind: Kind) {
  return kind === "moto" ? "/motos" : "/voitures";
}

export function getCar(slug: string, kind?: Kind) {
  return VEHICLES.find((c) => c.slug === slug && (!kind || c.kind === kind));
}

export function makes(list: Car[] = CARS) {
  const counts = new Map<string, number>();
  for (const c of list) counts.set(c.make, (counts.get(c.make) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([make, count]) => ({ make, count }));
}

export function modelsOf(make: string, list: Car[] = CARS) {
  return [...new Set(list.filter((c) => c.make === make).map((c) => c.model))].sort();
}

export interface Filters {
  q?: string;
  make?: string;
  model?: string;
  body?: string;
  fuel?: string;
  tr?: string;
  dt?: string;
  ymin?: string;
  ymax?: string;
  pmin?: string;
  pmax?: string;
  kmax?: string;
  seats?: string;
  color?: string;
  /** Motos : « A2 » = accessibles avec le permis A2. */
  lic?: string;
  /** « new » ou « used ». */
  cond?: string;
  sort?: string;
}

export const FILTER_KEYS: (keyof Filters)[] = [
  "q", "make", "model", "body", "fuel", "tr", "dt", "ymin", "ymax", "pmin", "pmax", "kmax", "seats", "color", "lic", "cond", "sort",
];

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function filterCars(f: Filters, list: Car[] = CARS) {
  const words = f.q ? norm(f.q).split(/\s+/).filter(Boolean) : [];
  const num = (v?: string) => (v ? Number(v) : undefined);
  const [ymin, ymax, pmin, pmax, kmax, seats] = [f.ymin, f.ymax, f.pmin, f.pmax, f.kmax, f.seats].map(num);
  const res = list.filter((c) => {
    if (f.make && c.make !== f.make) return false;
    if (f.model && c.model !== f.model) return false;
    if (f.body && c.body !== f.body) return false;
    if (f.fuel && c.fuel !== f.fuel) return false;
    if (f.tr && c.transmission !== f.tr) return false;
    if (f.dt && c.drivetrain !== f.dt) return false;
    if (f.color && c.colorExt !== f.color) return false;
    if (f.lic === "A2" && c.moto?.licence !== "A2" && c.moto?.licence !== "A1") return false;
    if (f.cond && (c.condition ?? "used") !== f.cond) return false;
    if (ymin && c.year < ymin) return false;
    if (ymax && c.year > ymax) return false;
    if (pmin && c.priceFrom < pmin) return false;
    if (pmax && c.priceFrom > pmax) return false;
    if (kmax && c.mileage > kmax) return false;
    if (seats && c.seats < seats) return false;
    if (words.length) {
      const hay = norm(`${c.make} ${c.model} ${c.trim} ${c.generation} ${c.year} ${c.ref} ${c.body} ${c.fuel} ${c.kind}`);
      if (!words.every((w) => hay.includes(w))) return false;
    }
    return true;
  });
  const sorters: Record<string, (a: Car, b: Car) => number> = {
    priceAsc: (a, b) => a.priceFrom - b.priceFrom,
    priceDesc: (a, b) => b.priceFrom - a.priceFrom,
    yearDesc: (a, b) => b.year - a.year || a.mileage - b.mileage,
    mileageAsc: (a, b) => a.mileage - b.mileage,
  };
  const sorter = sorters[f.sort ?? ""];
  return sorter ? [...res].sort(sorter) : [...res].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
}

export function similarCars(car: Car, n = 4) {
  return listOf(car.kind)
    .filter((c) => c.slug !== car.slug)
    .map((c) => ({
      c,
      score:
        (c.body === car.body ? 3 : 0) +
        (c.make === car.make ? 2 : 0) +
        (Math.abs(c.priceFrom - car.priceFrom) < car.priceFrom * 0.3 ? 2 : 0) +
        (c.fuel === car.fuel ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.c);
}

export const PRICE_STEPS = [10000, 15000, 20000, 25000, 30000, 40000, 50000, 60000, 80000, 100000, 150000];
export const MOTO_PRICE_STEPS = [1000, 1500, 2000, 3000, 4000, 5000, 6000, 8000, 10000, 12000, 15000, 20000];
export const MILEAGE_STEPS = [10000, 25000, 50000, 75000, 100000, 150000];
export const MOTO_MILEAGE_STEPS = [5000, 10000, 15000, 20000, 30000];

export const PORTS = [
  "Douala", "Abidjan", "Dakar", "Lomé", "Cotonou", "Conakry", "Libreville", "Pointe-Noire", "Matadi", "Lagos",
  "Tema", "Casablanca", "Tanger Med", "Nouakchott",
];
