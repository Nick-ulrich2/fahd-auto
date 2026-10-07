/**
 * Mise à jour du stock sans toucher au code : une feuille Google Sheets publiée en CSV
 * (Fichier → Partager → Publier sur le Web → CSV) dont l'URL est donnée dans VITE_STOCK_SHEET_CSV.
 *
 * Colonnes reconnues (1re ligne = en-têtes) : slug, status, priceFrom, priceXaf
 *   - status : available, reserved ou sold
 *   - priceFrom : prix en euros ; priceXaf : prix en FCFA (facultatif)
 */
import { STOCK_SHEET_CSV } from "../config";
import { VEHICLES } from "./catalog";
import type { Car } from "./types";

const CACHE_KEY = "fahd-stock-sheet";

function parseCsv(text: string) {
  const rows = text.trim().split(/\r?\n/).map((l) => l.split(",").map((c) => c.trim().replace(/^"|"$/g, "")));
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), r[i] ?? ""])));
}

function apply(text: string) {
  for (const row of parseCsv(text)) {
    const car = VEHICLES.find((c) => c.slug === row.slug) as Car | undefined;
    if (!car) continue;
    if (row.status === "available" || row.status === "reserved" || row.status === "sold") car.status = row.status;
    const eur = Number(row.priceFrom);
    if (eur > 0) car.priceFrom = eur;
    const xaf = Number(row.priceXaf);
    if (xaf > 0) car.priceXaf = xaf;
  }
}

export async function loadStockOverrides() {
  if (!STOCK_SHEET_CSV) return;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) apply(cached);
  } catch {
    /* stockage indisponible */
  }
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch(STOCK_SHEET_CSV, { signal: ctrl.signal, cache: "no-store" });
    clearTimeout(timer);
    if (!res.ok) return;
    const text = await res.text();
    apply(text);
    try {
      localStorage.setItem(CACHE_KEY, text);
    } catch {
      /* stockage indisponible */
    }
  } catch {
    /* hors ligne ou feuille indisponible : on garde les données du site */
  }
}
