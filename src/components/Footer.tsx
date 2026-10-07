import { Mail, Phone, Search, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { SITE } from "../config";
import { BODIES, MOTOS, makes } from "../data/catalog";
import { LANGS, useI18n } from "../i18n/I18nContext";
import { emailLink, whatsappLink } from "../lib/contact";
import { WhatsAppIcon } from "./icons";
import { Logo } from "./Logo";

export function Footer() {
  const { t, lang, setLang } = useI18n();
  return (
    <footer className="mt-20 bg-brand-950 text-brand-100">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-100/80">{t("footer.about")}</p>
          <div className="mt-5 flex gap-1.5">
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold ${lang === l.code ? "bg-white text-brand-900" : "bg-white/10 hover:bg-white/20"}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">{t("footer.explore")}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {makes()
              .slice(0, 8)
              .map(({ make }) => (
                <li key={make}>
                  <Link href={`/voitures?make=${encodeURIComponent(make)}`} className="hover:text-white">
                    {make}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">{t("footer.bodies")}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {BODIES.map((b) => (
              <li key={b}>
                <Link href={`/voitures?body=${b}`} className="hover:text-white">
                  {t(`body.${b}`)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/motos" className="hover:text-white">
                {t("nav.motos")} ({MOTOS.length})
              </Link>
            </li>
            <li>
              <Link href="/export" className="hover:text-white">
                {t("nav.export")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">{t("footer.contact")}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={whatsappLink(t("msg.general"))} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-white">
                <WhatsAppIcon className="h-4 w-4" /> <span dir="ltr">{SITE.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a href={`tel:+${SITE.whatsapp}`} className="flex items-center gap-2 hover:text-white">
                <Phone className="h-4 w-4" /> <span dir="ltr">{SITE.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a href={emailLink(SITE.name, t("msg.general"))} className="flex items-center gap-2 break-all hover:text-white">
                <Mail className="h-4 w-4 shrink-0" /> {SITE.email}
              </a>
            </li>
            <li>
              <Link href="/comment-ca-marche" className="flex items-center gap-2 font-semibold text-white hover:underline">
                <ShieldCheck className="h-4 w-4" /> {t("nav.how")}
              </Link>
            </li>
            <li>
              <Link href="/recherche-vehicule" className="flex items-center gap-2 hover:text-white">
                <Search className="h-4 w-4" /> {t("nav.sourcing")}
              </Link>
            </li>
          </ul>
          <p className="mt-4 rounded-lg bg-white/5 p-3 text-xs leading-relaxed text-brand-100/80">{t("footer.official")}</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-5 text-xs text-brand-100/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name} — {SITE.tagline}. {t("footer.rights")}
          </p>
          <nav className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Legal">
            <Link href="/mentions-legales" className="hover:text-white">
              {t("footer.legal")}
            </Link>
            <Link href="/conditions" className="hover:text-white">
              {t("footer.terms")}
            </Link>
            <Link href="/confidentialite" className="hover:text-white">
              {t("footer.privacy")}
            </Link>
            <Link href="/credits" className="hover:text-white">
              {t("footer.credits")}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
