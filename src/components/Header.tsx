import { GitCompareArrows, Globe, Heart, Mail, Menu, Phone, Search, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { SITE } from "../config";
import { CURRENCIES, useCurrency } from "../contexts/CurrencyContext";
import { useSaved } from "../contexts/SavedContext";
import { LANGS, useI18n } from "../i18n/I18nContext";
import { emailLink, whatsappLink } from "../lib/contact";
import { WhatsAppIcon } from "./icons";
import { Logo } from "./Logo";

function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="flex items-center gap-1" role="group" aria-label={t("nav.language")}>
      <Globe className={`h-3.5 w-3.5 ${dark ? "text-brand-100" : "text-muted"}`} aria-hidden="true" />
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          title={l.label}
          className={`rounded px-1.5 py-0.5 text-xs font-bold transition ${
            lang === l.code
              ? dark
                ? "bg-white text-brand-900"
                : "bg-brand-800 text-white"
              : dark
                ? "text-brand-100 hover:text-white"
                : "text-muted hover:text-ink"
          }`}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}

export function CurrencySwitcher({ dark = false }: { dark?: boolean }) {
  const { currency, setCurrency } = useCurrency();
  const { t } = useI18n();
  return (
    <label className="flex items-center gap-1">
      <span className="sr-only">{t("nav.currency")}</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as typeof currency)}
        className={`rounded border px-1.5 py-0.5 text-xs font-bold ${dark ? "border-white/20 bg-brand-900 text-white" : "border-line bg-white text-ink"}`}
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Header() {
  const { t } = useI18n();
  const { favorites, compare } = useSaved();
  const [location, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    setOpen(false);
  }, [location]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/voitures?q=${encodeURIComponent(q.trim())}` : "/voitures");
  };

  const nav = [
    { href: "/voitures", label: t("nav.cars") },
    { href: "/motos", label: t("nav.motos") },
    { href: "/comment-ca-marche", label: t("nav.how") },
    { href: "/export", label: t("nav.export") },
    { href: "/contact", label: t("nav.contact") },
  ];
  const isActive = (href: string) => (href === "/" ? location === "/" : location.startsWith(href));

  return (
    <header className="sticky top-0 z-50">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">
        {t("nav.skip")}
      </a>
      <div className="hidden bg-brand-900 text-xs text-brand-100 md:block">
        <div className="container-x flex h-9 items-center justify-between">
          <div className="flex items-center gap-5">
            <a href={whatsappLink(t("msg.general"))} target="_blank" rel="noopener" className="flex items-center gap-1.5 hover:text-white">
              <WhatsAppIcon className="h-3.5 w-3.5" />
              <span dir="ltr">{SITE.phoneDisplay}</span>
            </a>
            <a href={emailLink(SITE.name, t("msg.general"))} className="flex items-center gap-1.5 hover:text-white">
              <Mail className="h-3.5 w-3.5" /> {SITE.email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <CurrencySwitcher dark />
            <LanguageSwitcher dark />
          </div>
        </div>
      </div>

      <div className="border-b border-line bg-white/95 backdrop-blur">
        <div className="container-x flex h-16 items-center gap-4 lg:h-[72px]">
          <Logo />
          <nav className="ms-2 hidden items-center gap-0.5 lg:flex" aria-label="Navigation">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-semibold transition ${
                  isActive(n.href) ? "bg-brand-50 text-brand-800" : "text-ink hover:text-brand-800"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <form onSubmit={submit} className="ms-auto hidden max-w-xs flex-1 md:block lg:max-w-[200px] xl:max-w-xs" role="search">
            <label className="relative block">
              <span className="sr-only">{t("search.placeholder")}</span>
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("search.placeholder")}
                className="field rounded-full bg-canvas ps-9"
                type="search"
              />
            </label>
          </form>

          <div className="ms-auto flex items-center gap-1 md:ms-0">
            <Link href="/comparer" className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-canvas" aria-label={t("nav.compare")}>
              <GitCompareArrows className="h-5 w-5" />
              {compare.length > 0 && <Badge n={compare.length} />}
            </Link>
            <Link href="/favoris" className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-canvas" aria-label={t("nav.favorites")}>
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && <Badge n={favorites.length} />}
            </Link>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-canvas lg:hidden"
              onClick={() => setOpen(true)}
              aria-label={t("nav.menu")}
              aria-expanded={open}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 end-0 flex w-[min(86vw,360px)] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-line p-4">
              <Logo />
              <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-canvas" aria-label={t("nav.close")}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={submit} className="p-4" role="search">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search.placeholder")} className="field" type="search" />
            </form>
            <nav className="flex flex-col px-2">
              {[{ href: "/", label: t("nav.home") }, ...nav, { href: "/recherche-vehicule", label: t("nav.sourcing") }, { href: "/favoris", label: t("nav.favorites") }, { href: "/comparer", label: t("nav.compare") }].map((n) => (
                <Link key={n.href} href={n.href} className={`rounded-lg px-3 py-3 font-semibold ${isActive(n.href) ? "bg-brand-50 text-brand-800" : ""}`}>
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto space-y-3 border-t border-line p-4">
              <div className="flex items-center justify-between">
                <LanguageSwitcher />
                <CurrencySwitcher />
              </div>
              <a href={whatsappLink(t("msg.general"))} target="_blank" rel="noopener" className="btn-whatsapp w-full">
                <WhatsAppIcon className="h-4 w-4" /> <span dir="ltr">{SITE.phoneDisplay}</span>
              </a>
              <a href={`tel:+${SITE.whatsapp}`} className="btn-outline w-full">
                <Phone className="h-4 w-4" /> {t("car.call")}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span className="absolute -end-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent-600 px-1 text-[11px] font-bold text-white">
      {n}
    </span>
  );
}
