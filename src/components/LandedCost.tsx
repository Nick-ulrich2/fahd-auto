import { Info } from "lucide-react";
import { useMemo, useState } from "react";
import { useCurrency } from "../contexts/CurrencyContext";
import { DESTINATIONS, estimate } from "../data/shipping";
import type { Car } from "../data/types";
import { useI18n } from "../i18n/I18nContext";
import { carUrl, whatsappLink } from "../lib/contact";
import { carFullTitle } from "../lib/format";
import { WhatsAppIcon } from "./icons";

/** Calculateur « prix livré » : prix + transport estimé + taxes estimées, dans la devise du visiteur. */
export function LandedCost({ car }: { car: Car }) {
  const { t, locale } = useI18n();
  const { money } = useCurrency();
  const [dest, setDest] = useState(0);
  const [withCustoms, setWithCustoms] = useState(true);

  const regionName = useMemo(() => {
    try {
      const dn = new Intl.DisplayNames([locale], { type: "region" });
      return (code: string) => dn.of(code) ?? code;
    } catch {
      return (code: string) => code;
    }
  }, [locale]);

  const d = DESTINATIONS[dest];
  const est = estimate(car, d, withCustoms);
  const label = (i: number) => `${regionName(DESTINATIONS[i].country)} — ${DESTINATIONS[i].place}`;
  const quote = whatsappLink(
    t("calc.msg", { dest: label(dest), car: `${carFullTitle(car)} (${t("car.ref")} ${car.ref})`, link: carUrl(car) }),
  );

  return (
    <div>
      <label className="block text-sm font-medium">
        {t("calc.dest")}
        <select value={dest} onChange={(e) => setDest(Number(e.target.value))} className="field mt-1">
          {DESTINATIONS.map((x, i) => (
            <option key={x.country + x.place} value={i}>
              {label(i)}
            </option>
          ))}
        </select>
      </label>
      {d.customs > 0 && (
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={withCustoms} onChange={(e) => setWithCustoms(e.target.checked)} className="h-4 w-4 accent-brand-800" />
          {t("calc.includeCustoms")}
        </label>
      )}

      {est ? (
        <dl className="mt-4 divide-y divide-line rounded-xl bg-canvas px-4 text-sm">
          <div className="flex justify-between py-2.5">
            <dt className="text-muted">{t("calc.vehicle")}</dt>
            <dd className="ltr-nums font-semibold">{money(car.priceFrom, locale)}</dd>
          </div>
          <div className="flex justify-between py-2.5">
            <dt className="text-muted">{t("calc.shipping")}</dt>
            <dd className="ltr-nums font-semibold">≈ {money(est.shipping, locale)}</dd>
          </div>
          {d.customs > 0 && withCustoms && (
            <div className="flex justify-between py-2.5">
              <dt className="text-muted">{t("calc.customs", { pct: d.customs })}</dt>
              <dd className="ltr-nums font-semibold">≈ {money(est.customs, locale)}</dd>
            </div>
          )}
          <div className="flex justify-between py-3 text-base">
            <dt className="font-bold">{t("calc.total")}</dt>
            <dd className="ltr-nums font-extrabold text-brand-800">≈ {money(est.total, locale)}</dd>
          </div>
        </dl>
      ) : (
        <p className="mt-4 rounded-xl bg-canvas p-4 text-sm text-muted">{t("calc.onRequest")}</p>
      )}

      <p className="mt-3 flex items-start gap-1.5 text-xs text-muted">
        <Info className="mt-px h-3.5 w-3.5 shrink-0" /> {t("calc.disclaimer")}
      </p>
      <a href={quote} target="_blank" rel="noopener" className="btn-whatsapp mt-4 w-full sm:w-auto">
        <WhatsAppIcon className="h-4 w-4" /> {t("calc.quote")}
      </a>
    </div>
  );
}

