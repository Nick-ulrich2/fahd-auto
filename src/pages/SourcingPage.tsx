import { Mail, Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { WhatsAppIcon } from "../components/icons";
import { useCurrency } from "../contexts/CurrencyContext";
import { useI18n } from "../i18n/I18nContext";
import { emailLink, whatsappLink } from "../lib/contact";
import { usePageMeta } from "../lib/usePageMeta";

/** Demande de recherche personnalisée / alerte : le message est préparé pour WhatsApp ou l'email. */
export default function SourcingPage() {
  const { t } = useI18n();
  const { currency } = useCurrency();
  usePageMeta(`${t("sourcing.title")} — Fahd Auto`, t("sourcing.subtitle"));
  const [f, setF] = useState({ vehicle: "", year: "", budget: "", country: "", name: "", message: "" });
  const [error, setError] = useState(false);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  const body = () =>
    [
      t("sourcing.msgIntro"),
      `• ${t("sourcing.vehicle")} : ${f.vehicle}`,
      f.year && `• ${t("sourcing.year")} : ${f.year}`,
      f.budget && `• ${t("sourcing.budget")} : ${f.budget} ${currency}`,
      f.country && `• ${t("sourcing.country")} : ${f.country}`,
      f.name && `• ${t("offer.name")} : ${f.name}`,
      f.message && `\n${f.message}`,
    ]
      .filter(Boolean)
      .join("\n");

  const send = (channel: "whatsapp" | "email") => (e: FormEvent) => {
    e.preventDefault();
    if (f.vehicle.trim().length < 2) return setError(true);
    if (channel === "whatsapp") window.open(whatsappLink(body()), "_blank", "noopener");
    else window.location.href = emailLink(t("sourcing.title"), body());
  };

  const field = "field mt-1";
  return (
    <>
      <section className="bg-brand-900 text-white">
        <div className="container-x py-14">
          <h1 className="flex max-w-3xl items-center gap-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            <Search className="h-8 w-8 shrink-0" /> {t("sourcing.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-brand-100">{t("sourcing.subtitle")}</p>
        </div>
      </section>
      <div className="container-x max-w-2xl py-10">
        <form onSubmit={send("whatsapp")} className="card space-y-4 p-6">
          <label className="block text-sm font-medium">
            {t("sourcing.vehicle")} *
            <input value={f.vehicle} onChange={set("vehicle")} className={field} placeholder={t("sourcing.vehiclePh")} required />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              {t("sourcing.year")}
              <input value={f.year} onChange={set("year")} className={field} inputMode="numeric" placeholder="2018" />
            </label>
            <label className="block text-sm font-medium">
              {t("sourcing.budget")} ({currency})
              <input value={f.budget} onChange={set("budget")} className={field} inputMode="numeric" />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              {t("sourcing.country")}
              <input value={f.country} onChange={set("country")} className={field} autoComplete="country-name" />
            </label>
            <label className="block text-sm font-medium">
              {t("offer.name")}
              <input value={f.name} onChange={set("name")} className={field} autoComplete="name" />
            </label>
          </div>
          <label className="block text-sm font-medium">
            {t("offer.message")}
            <textarea rows={3} value={f.message} onChange={set("message")} className={`${field} resize-none`} />
          </label>
          {error && <p className="text-sm font-medium text-accent-600">{t("sourcing.required")}</p>}
          <div className="grid gap-2 sm:grid-cols-2">
            <button type="submit" className="btn-whatsapp h-12">
              <WhatsAppIcon className="h-5 w-5" /> {t("offer.sendWhatsapp")}
            </button>
            <button type="button" onClick={send("email")} className="btn-outline h-12">
              <Mail className="h-5 w-5" /> {t("offer.sendEmail")}
            </button>
          </div>
          <p className="text-xs text-muted">{t("sourcing.note")}</p>
        </form>
      </div>
    </>
  );
}
