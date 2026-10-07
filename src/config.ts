/**
 * Coordonnées et réglages de la plateforme.
 * Modifiez ce fichier pour changer le numéro WhatsApp, l'email, les taux de change ou les informations légales.
 */
const env = import.meta.env as Record<string, string | undefined>;

export const SITE = {
  name: "Fahd Auto",
  tagline: "Trirex Motors Transit",
  /** Numéro WhatsApp au format international, chiffres uniquement (sans +, sans espaces). */
  whatsapp: "32466902148",
  /** Numéro affiché aux visiteurs. */
  phoneDisplay: "+32 466 90 21 48",
  email: "fahdauto.transit@gmail.com",
  /** URL publique du site (ex. https://www.fahdauto.com), sans « / » final. Indispensable pour Google : à définir via VITE_SITE_URL au build. */
  url: (env.VITE_SITE_URL ?? "").replace(/\/$/, ""),
  country: "Belgique",
};

/**
 * Informations légales de l'entreprise. Laissez vide ce que vous n'avez pas encore :
 * les lignes vides ne s'affichent pas sur le site.
 */
export const COMPANY = {
  legalName: "",
  /** Numéro d'entreprise BCE (Belgique), ex. « BE 0123.456.789 ». */
  companyNumber: "",
  vatNumber: "",
  address: "",
  /** Responsable de la publication. */
  publisher: "",
  /** Hébergeur du site, ex. « Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA ». */
  host: "",
};

export type Currency = "EUR" | "XAF" | "USD" | "AED";

/**
 * Taux de conversion depuis l'euro. Le FCFA (XAF) a une parité fixe ;
 * dollar et dirham sont indicatifs : mettez-les à jour de temps en temps.
 */
export const RATES: Record<Currency, number> = {
  EUR: 1,
  XAF: 655.957,
  USD: 1.08,
  AED: 3.97,
};

/** Mesure d'audience (facultatif). Plausible : sans cookie, aucun bandeau nécessaire. Google Analytics : bandeau de consentement affiché. */
export const ANALYTICS = {
  plausibleDomain: env.VITE_PLAUSIBLE_DOMAIN ?? "",
  gaId: env.VITE_GA_ID ?? "",
};

/**
 * Feuille Google Sheets publiée en CSV (facultatif) pour changer prix et statuts sans toucher au code.
 * Colonnes : slug, status (available / reserved / sold), priceFrom (€), priceXaf (FCFA).
 */
export const STOCK_SHEET_CSV = env.VITE_STOCK_SHEET_CSV ?? "";
