import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";
import { ar } from "./ar";
import { en } from "./en";
import { fr, type Dict, type TKey } from "./fr";

export type Lang = "fr" | "en" | "ar";
export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: "fr", label: "Français", short: "FR" },
  { code: "en", label: "English", short: "EN" },
  { code: "ar", label: "العربية", short: "ع" },
];
const DICTS: Record<Lang, Dict> = { fr, en, ar };
export const LOCALES: Record<Lang, string> = { fr: "fr-BE", en: "en-GB", ar: "ar" };

/** Préfixe d'URL de chaque langue : le français est à la racine, /en et /ar pour les autres. */
export function langBase(lang: Lang) {
  return lang === "fr" ? "" : `/${lang}`;
}

/** Langue déduite d'un chemin d'URL (« /en/voitures » → en). */
export function langFromPath(pathname: string): Lang {
  const m = pathname.match(/^\/(en|ar)(\/|$)/);
  return (m?.[1] as Lang) ?? "fr";
}

/** Chemin sans le préfixe de langue (« /en/voitures » → « /voitures »). */
export function stripLang(pathname: string) {
  return pathname.replace(/^\/(en|ar)(?=\/|$)/, "") || "/";
}

/** Même page dans une autre langue. */
export function pathForLang(lang: Lang, path: string) {
  const p = stripLang(path);
  return `${langBase(lang)}${p === "/" && lang !== "fr" ? "" : p}` || "/";
}

type Vars = Record<string, string | number>;
interface I18n {
  lang: Lang;
  locale: string;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  t: (key: TKey, vars?: Vars) => string;
}

const Ctx = createContext<I18n | null>(null);

export function interpolate(str: string, vars?: Vars) {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

export function translate(lang: Lang, key: TKey, vars?: Vars) {
  return interpolate(DICTS[lang][key] ?? fr[key], vars);
}

export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  // Changer de langue = aller sur la même page avec l'autre préfixe d'URL (chaque langue a ses propres pages pour Google).
  const setLang = useCallback((l: Lang) => {
    const { pathname, search, hash } = window.location;
    window.location.assign(`${pathForLang(l, pathname)}${search}${hash}`);
  }, []);
  const t = useCallback((key: TKey, vars?: Vars) => translate(lang, key, vars), [lang]);
  const value = useMemo(() => ({ lang, locale: LOCALES[lang], dir, setLang, t }), [lang, dir, setLang, t]) as I18n;
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
