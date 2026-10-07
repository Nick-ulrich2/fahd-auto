import { HandCoins, Mail, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useCurrency, vehiclePrice } from "../contexts/CurrencyContext";
import type { Car } from "../data/types";
import { useI18n } from "../i18n/I18nContext";
import { emailLink, offerMessage, offerSubject, whatsappLink, type Offer } from "../lib/contact";
import { WhatsAppIcon } from "./icons";

export function OfferButton({ car, className = "btn-outline w-full" }: { car: Car; className?: string }) {
  const { t, locale } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);
  const { currency } = useCurrency();
  const [offer, setOffer] = useState<Offer>({ name: "", country: "", amount: 0, currency, message: "" });
  const [error, setError] = useState(false);

  const step = currency === "XAF" ? 5000 : currency === "EUR" ? 100 : 500;
  useEffect(() => {
    // Offre proposée par défaut : 5 % sous le prix affiché, dans la devise choisie par le visiteur.
    setOffer((o) => ({ ...o, currency, amount: Math.round((vehiclePrice(car, currency) * 0.95) / step) * step }));
  }, [car, currency, step]);

  const valid = offer.name.trim().length > 1 && offer.amount > 0;
  const send = (channel: "whatsapp" | "email") => (e: FormEvent) => {
    e.preventDefault();
    if (!valid) return setError(true);
    const body = offerMessage(car, offer, t, locale);
    const url = channel === "whatsapp" ? whatsappLink(body) : emailLink(offerSubject(car, t), body);
    if (channel === "whatsapp") window.open(url, "_blank", "noopener");
    else window.location.href = url;
    ref.current?.close();
  };

  return (
    <>
      <button type="button" className={className} onClick={() => ref.current?.showModal()}>
        <HandCoins className="h-4 w-4" /> {t("car.ctaOffer")}
      </button>
      <dialog
        ref={ref}
        className="m-auto w-[min(92vw,460px)] rounded-2xl p-0 shadow-2xl backdrop:bg-black/50"
        onClick={(e) => e.target === ref.current && ref.current?.close()}
      >
        <form className="p-6" onSubmit={send("whatsapp")}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold">{t("offer.title")}</h2>
              <p className="mt-1 text-sm text-muted" dir="ltr">
                {car.make} {car.model} {car.trim} · {car.year}
              </p>
            </div>
            <button type="button" onClick={() => ref.current?.close()} className="grid h-9 w-9 place-items-center rounded-full hover:bg-canvas" aria-label={t("offer.cancel")}>
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-3 text-sm text-muted">{t("offer.intro")}</p>
          <div className="mt-4 space-y-3">
            <label className="block text-sm font-medium">
              {t("offer.amount").replace("€", currency === "XAF" ? "FCFA" : currency === "EUR" ? "€" : currency)}
              <input
                type="number"
                min={1}
                step={step}
                inputMode="numeric"
                required
                value={offer.amount || ""}
                onChange={(e) => setOffer({ ...offer, amount: Number(e.target.value) })}
                className="field mt-1 text-lg font-bold"
                dir="ltr"
              />
            </label>
            <label className="block text-sm font-medium">
              {t("offer.name")}
              <input required value={offer.name} onChange={(e) => setOffer({ ...offer, name: e.target.value })} className="field mt-1" autoComplete="name" />
            </label>
            <label className="block text-sm font-medium">
              {t("offer.country")}
              <input value={offer.country} onChange={(e) => setOffer({ ...offer, country: e.target.value })} className="field mt-1" autoComplete="country-name" />
            </label>
            <label className="block text-sm font-medium">
              {t("offer.message")}
              <textarea rows={3} value={offer.message} onChange={(e) => setOffer({ ...offer, message: e.target.value })} className="field mt-1 resize-none" />
            </label>
          </div>
          {error && !valid && <p className="mt-3 text-sm font-medium text-accent-600">{t("offer.required")}</p>}
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <button type="submit" className="btn-whatsapp">
              <WhatsAppIcon className="h-4 w-4" /> {t("offer.sendWhatsapp")}
            </button>
            <button type="button" onClick={send("email")} className="btn-outline">
              <Mail className="h-4 w-4" /> {t("offer.sendEmail")}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
