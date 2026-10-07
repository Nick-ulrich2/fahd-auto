import { Anchor, Camera, FileCheck2, Mail, MapPin, Phone, Search, Ship, Clock } from "lucide-react";
import { WhatsAppIcon } from "../components/icons";
import { SITE } from "../config";
import { PORTS, VEHICLES } from "../data/catalog";
import { useI18n } from "../i18n/I18nContext";
import { emailLink, whatsappLink } from "../lib/contact";
import { usePageMeta } from "../lib/usePageMeta";

function PageHead({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="bg-brand-900 text-white">
      <div className="container-x py-14">
        <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-brand-100">{subtitle}</p>
      </div>
    </section>
  );
}

export function ExportPage() {
  const { t } = useI18n();
  usePageMeta(`${t("export.title")} — Fahd Auto`, t("export.subtitle"));
  const steps = [
    { Icon: Search, k: "s1" },
    { Icon: Camera, k: "s2" },
    { Icon: FileCheck2, k: "s3" },
    { Icon: Ship, k: "s4" },
  ] as const;
  return (
    <>
      <PageHead title={t("export.title")} subtitle={t("export.subtitle")} />
      <div className="container-x py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ Icon, k }) => (
            <div key={k} className="card p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-800">
                <Icon className="h-6 w-6" />
              </span>
              <h2 className="mt-4 font-bold">{t(`export.${k}.t`)}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">{t(`export.${k}.d`)}</p>
            </div>
          ))}
        </div>

        <div className="card mt-8 p-6 sm:p-8">
          <h2 className="flex items-center gap-2 text-xl font-extrabold">
            <Anchor className="h-5 w-5 text-accent-600" /> {t("export.ports")}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {PORTS.map((p) => (
              <a key={p} href={whatsappLink(t("msg.shipping") + p)} target="_blank" rel="noopener" className="chip">
                {p}
              </a>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted">{t("export.note")}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a href={whatsappLink(t("msg.shipping"))} target="_blank" rel="noopener" className="btn-whatsapp h-12 px-6">
              <WhatsAppIcon className="h-5 w-5" /> {t("export.ask")}
            </a>
            <a href={emailLink(t("export.ask"), t("msg.shipping"))} className="btn-outline h-12 px-6">
              <Mail className="h-5 w-5" /> {t("card.email")}
            </a>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl ring-1 ring-line">
          <img src="/brand/banner.jpg" alt="Fahd Auto — Trirex Motors Transit" className="w-full" loading="lazy" />
        </div>
      </div>
    </>
  );
}

export function ContactPage() {
  const { t } = useI18n();
  usePageMeta(`${t("contact.title")} — Fahd Auto`, t("contact.subtitle"));
  return (
    <>
      <PageHead title={t("contact.title")} subtitle={t("contact.subtitle")} />
      <div className="container-x grid gap-6 py-12 lg:grid-cols-3">
        <a href={whatsappLink(t("msg.general"))} target="_blank" rel="noopener" className="card group p-6 transition hover:border-whatsapp">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-whatsapp text-white">
            <WhatsAppIcon className="h-6 w-6" />
          </span>
          <h2 className="mt-4 font-bold">{t("contact.whatsapp")}</h2>
          <p className="mt-1 text-lg font-semibold" dir="ltr">
            {SITE.phoneDisplay}
          </p>
          <span className="btn-whatsapp mt-4">{t("contact.writeWhatsapp")}</span>
        </a>
        <a href={emailLink(SITE.name, t("msg.general"))} className="card group p-6 transition hover:border-brand-700">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-800 text-white">
            <Mail className="h-6 w-6" />
          </span>
          <h2 className="mt-4 font-bold">{t("contact.email")}</h2>
          <p className="mt-1 break-all text-lg font-semibold">{SITE.email}</p>
          <span className="btn-primary mt-4">{t("contact.writeEmail")}</span>
        </a>
        <div className="card space-y-5 p-6">
          <div className="flex gap-3">
            <Phone className="mt-0.5 h-5 w-5 text-brand-700" />
            <div>
              <h2 className="text-sm font-bold">{t("contact.phone")}</h2>
              <a href={`tel:+${SITE.whatsapp}`} className="text-sm hover:underline" dir="ltr">
                {SITE.phoneDisplay}
              </a>
            </div>
          </div>
          <div className="flex gap-3">
            <Clock className="mt-0.5 h-5 w-5 text-brand-700" />
            <div>
              <h2 className="text-sm font-bold">{t("contact.hours")}</h2>
              <p className="text-sm text-muted">{t("contact.hoursValue")}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-brand-700" />
            <div>
              <h2 className="text-sm font-bold">{t("contact.location")}</h2>
              <p className="text-sm text-muted">{t("contact.locationValue")}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function CreditsPage() {
  const { t } = useI18n();
  usePageMeta(`${t("credits.title")} — Fahd Auto`);
  return (
    <div className="container-x py-10">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{t("credits.title")}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{t("credits.intro")}</p>
      <h2 className="mt-8 text-lg font-bold">{t("credits.legal")}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{t("credits.legalText")}</p>
      <div className="mt-8 space-y-6">
        {VEHICLES.map((c) => (
          <section key={c.slug} className="card p-4">
            <h2 className="font-bold" dir="ltr">
              {c.make} {c.model} — {c.ref}
            </h2>
            <ul className="mt-2 space-y-1 text-xs text-muted">
              {c.photos.map((p, i) => (
                <li key={p.src} dir="ltr" className="text-start">
                  #{i + 1} ·{" "}
                  <a href={p.source} target="_blank" rel="noopener" className="underline hover:text-ink">
                    Wikimedia Commons
                  </a>{" "}
                  · {p.author} ·{" "}
                  {p.licenseUrl ? (
                    <a href={p.licenseUrl} target="_blank" rel="noopener license" className="underline hover:text-ink">
                      {p.license}
                    </a>
                  ) : (
                    p.license
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
