import { Link } from "wouter";
import { COMPANY, SITE } from "../config";
import { CONTENT, type Section } from "../content/pages";
import { useI18n } from "../i18n/I18nContext";
import { usePageMeta } from "../lib/usePageMeta";

/** Identité de l'entreprise, à partir de COMPANY (lignes vides ignorées). */
function companyLine() {
  const parts = [
    COMPANY.legalName || `${SITE.name} — ${SITE.tagline}`,
    COMPANY.companyNumber && `BCE ${COMPANY.companyNumber}`,
    COMPANY.vatNumber && `TVA ${COMPANY.vatNumber}`,
    COMPANY.address,
    COMPANY.publisher,
  ].filter(Boolean);
  return parts.join(" · ");
}

/** Remplit les champs ; renvoie null si une information obligatoire du paragraphe est manquante (il n'est alors pas affiché). */
function fill(s: string) {
  if (s.includes("{host}") && !COMPANY.host) return null;
  return s
    .replace("{company}", companyLine())
    .replace("{host}", COMPANY.host)
    .replace("{phone}", SITE.phoneDisplay)
    .replace("{email}", SITE.email);
}

function LegalLayout({ title, intro, sections }: { title: string; intro?: string; sections: Section[] }) {
  const { t } = useI18n();
  usePageMeta(`${title} — Fahd Auto`, intro ?? title);
  return (
    <div className="container-x max-w-3xl py-10">
      <nav className="text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">
          {t("car.home")}
        </Link>{" "}
        / <span className="text-ink">{title}</span>
      </nav>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{title}</h1>
      {intro && <p className="mt-2 text-sm text-muted">{intro}</p>}
      <div className="mt-8 space-y-6">
        {sections.map((s) => {
          const paragraphs = s.p.map(fill).filter((x): x is string => !!x);
          if (!paragraphs.length) return null;
          return (
            <section key={s.h} className="card p-5">
              <h2 className="font-bold">{s.h}</h2>
              {paragraphs.map((p) => (
                <p key={p} className="mt-2 text-sm leading-relaxed text-ink/90" dir="auto">
                  {p}
                </p>
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}

export function LegalPage() {
  const { lang } = useI18n();
  const c = CONTENT[lang].legal;
  return <LegalLayout title={c.title} sections={c.sections} />;
}

export function PrivacyPage() {
  const { lang } = useI18n();
  const c = CONTENT[lang].privacy;
  return <LegalLayout title={c.title} intro={c.updated} sections={c.sections} />;
}

export function TermsPage() {
  const { lang } = useI18n();
  const c = CONTENT[lang].terms;
  return <LegalLayout title={c.title} intro={c.notice} sections={c.sections} />;
}
