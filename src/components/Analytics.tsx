/**
 * Mesure d'audience facultative :
 *  - Plausible (VITE_PLAUSIBLE_DOMAIN) : sans cookie, conforme RGPD sans bandeau ;
 *  - Google Analytics 4 (VITE_GA_ID) : chargé seulement après accord du visiteur.
 * Chaque clic WhatsApp / email / appel est enregistré comme événement, avec la page d'origine (donc l'annonce).
 */
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ANALYTICS } from "../config";
import { useI18n } from "../i18n/I18nContext";

const CONSENT_KEY = "fahd-consent";

type W = Window & {
  plausible?: (e: string, o?: { props?: Record<string, string> }) => void;
  gtag?: (...a: unknown[]) => void;
  dataLayer?: unknown[];
};

export function track(event: string, props: Record<string, string> = {}) {
  const w = window as W;
  w.plausible?.(event, { props });
  w.gtag?.("event", event, props);
}

function loadScript(src: string, attrs: Record<string, string> = {}) {
  const s = document.createElement("script");
  s.src = src;
  s.defer = true;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
}

function loadGa(id: string) {
  const w = window as W;
  if (w.gtag) return;
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${id}`);
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", id, { anonymize_ip: true });
}

export function Analytics() {
  const { t } = useI18n();
  const [location] = useLocation();
  const [consent, setConsent] = useState<string | null>("pending");

  useEffect(() => {
    if (ANALYTICS.plausibleDomain) loadScript("https://plausible.io/js/script.js", { "data-domain": ANALYTICS.plausibleDomain });
    if (!ANALYTICS.gaId) return;
    let c: string | null = null;
    try {
      c = localStorage.getItem(CONSENT_KEY);
    } catch {
      /* stockage indisponible */
    }
    setConsent(c);
    if (c === "yes") loadGa(ANALYTICS.gaId);
  }, []);

  // Pages vues pour GA (Plausible les suit tout seul).
  useEffect(() => {
    (window as W).gtag?.("event", "page_view", { page_path: window.location.pathname });
  }, [location]);

  // Clics de contact : WhatsApp, email, téléphone.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const page = window.location.pathname;
      if (href.startsWith("https://wa.me/")) track("WhatsApp", { page });
      else if (href.startsWith("mailto:")) track("Email", { page });
      else if (href.startsWith("tel:")) track("Appel", { page });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!ANALYTICS.gaId || consent !== null) return null;
  const answer = (v: "yes" | "no") => {
    try {
      localStorage.setItem(CONSENT_KEY, v);
    } catch {
      /* stockage indisponible */
    }
    setConsent(v);
    if (v === "yes") loadGa(ANALYTICS.gaId);
  };
  return (
    <div role="dialog" aria-live="polite" className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-xl rounded-2xl bg-ink p-4 text-sm text-white shadow-2xl sm:inset-x-auto sm:start-4">
      <p>{t("consent.text")}</p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => answer("yes")} className="btn bg-white text-ink">
          {t("consent.accept")}
        </button>
        <button type="button" onClick={() => answer("no")} className="btn bg-white/10 text-white">
          {t("consent.refuse")}
        </button>
      </div>
    </div>
  );
}
