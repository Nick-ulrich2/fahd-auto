import { CircleCheck, FileText, Search, ShieldAlert, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { BreadcrumbJsonLd, FaqJsonLd } from "../components/JsonLd";
import { WhatsAppIcon } from "../components/icons";
import { SITE } from "../config";
import { CONTENT } from "../content/pages";
import { useI18n } from "../i18n/I18nContext";
import { whatsappLink } from "../lib/contact";
import { usePageMeta } from "../lib/usePageMeta";

/** Remplace {phone} et {email} dans les textes. */
export function fillContacts(s: string) {
  return s.replace("{phone}", SITE.phoneDisplay).replace("{email}", SITE.email);
}

export default function HowItWorks() {
  const { t, lang } = useI18n();
  const c = CONTENT[lang].how;
  usePageMeta(`${c.title} — Fahd Auto`, c.subtitle);

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: t("car.home"), path: "/" }, { name: c.title, path: "/comment-ca-marche" }]} />
      <FaqJsonLd items={c.faq} />
      <section className="bg-brand-900 text-white">
        <div className="container-x py-14">
          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">{c.title}</h1>
          <p className="mt-3 max-w-2xl text-brand-100">{c.subtitle}</p>
        </div>
      </section>

      <div className="container-x space-y-10 py-12">
        <section>
          <h2 className="section-title">{c.stepsTitle}</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.steps.map((s, i) => (
              <li key={s.t} className="card p-5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-800 text-sm font-extrabold text-white">{i + 1}</span>
                <h3 className="mt-3 font-bold">{s.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card p-6">
            <h2 className="flex items-center gap-2 text-xl font-extrabold">
              <ShieldCheck className="h-6 w-6 text-brand-700" /> {c.payTitle}
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {c.pay.map((p) => (
                <li key={p} className="flex gap-2">
                  <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" /> {p}
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-accent-600/30 bg-accent-50 p-6">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-accent-700">
              <ShieldAlert className="h-6 w-6" /> {c.scamTitle}
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {c.scam.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-600" /> <span dir="auto">{fillContacts(p)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="card p-6">
          <h2 className="flex items-center gap-2 text-xl font-extrabold">
            <FileText className="h-6 w-6 text-brand-700" /> {c.docsTitle}
          </h2>
          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {c.docs.map((d) => (
              <li key={d} className="flex gap-2">
                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" /> {d}
              </li>
            ))}
          </ul>
        </section>

        <section id="faq">
          <h2 className="section-title">{c.faqTitle}</h2>
          <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-white">
            {c.faq.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {f.q}
                  <span className="text-xl text-brand-700 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="flex flex-col items-start gap-4 rounded-3xl bg-brand-800 p-8 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold">{t("how.ctaTitle")}</h2>
            <p className="mt-1 text-brand-100">{t("how.ctaText")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={whatsappLink(t("msg.general"))} target="_blank" rel="noopener" className="btn-whatsapp h-12 px-5">
              <WhatsAppIcon className="h-5 w-5" /> WhatsApp
            </a>
            <Link href="/recherche-vehicule" className="btn h-12 bg-white/10 px-5 text-white ring-1 ring-white/30 hover:bg-white/20">
              <Search className="h-5 w-5" /> {t("nav.sourcing")}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
