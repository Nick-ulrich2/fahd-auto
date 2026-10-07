import { GitCompareArrows, X } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "wouter";
import { WhatsAppIcon } from "../components/icons";
import { useSaved } from "../contexts/SavedContext";
import { getCar, vehiclePath } from "../data/catalog";
import type { Car } from "../data/types";
import { useI18n } from "../i18n/I18nContext";
import type { TKey } from "../i18n/fr";
import { carWhatsapp } from "../lib/contact";
import { priceText, useCurrency } from "../contexts/CurrencyContext";
import { formatNumber } from "../lib/format";
import { usePageMeta } from "../lib/usePageMeta";

export default function Compare() {
  const { t, locale } = useI18n();
  const { currency } = useCurrency();
  const { compare, toggleCompare } = useSaved();
  usePageMeta(`${t("compare.title")} — Fahd Auto`);
  const cars = compare.map((s) => getCar(s)).filter((c): c is Car => c !== undefined);
  const n = (v: number, unit: TKey, d = 0) => `${formatNumber(v, locale, d)} ${t(unit)}`;

  const rows: [TKey, (c: Car) => ReactNode][] = [
    ["car.from", (c) => <strong className="text-brand-800">{priceText(c, locale, currency)}</strong>],
    ["spec.year", (c) => c.year],
    ["spec.mileage", (c) => n(c.mileage, "unit.km")],
    ["spec.body", (c) => t(`body.${c.body}`)],
    ["spec.fuel", (c) => t(`fuel.${c.fuel}`)],
    ["spec.transmission", (c) => t(`transmission.${c.transmission}`)],
    ["spec.drivetrain", (c) => t(`drivetrain.${c.drivetrain}`)],
    ["spec.power", (c) => n(c.engine.powerHp, "unit.hp")],
    ["spec.torque", (c) => n(c.engine.torqueNm, "unit.nm")],
    ["spec.displacement", (c) => (c.engine.displacement ? n(c.engine.displacement, "unit.cc") : "—")],
    ["spec.zeroTo100", (c) => n(c.performance.zeroTo100, "unit.s", 1)],
    ["spec.consumption", (c) => n(c.consumption, c.fuel === "electric" ? "unit.kwh100" : "unit.l100", 1)],
    ["spec.seats", (c) => c.seats],
    ["spec.length", (c) => n(c.dimensions.length, "unit.mm")],
    ["spec.boot", (c) => (c.boot ? n(c.boot, "unit.l") : "—")],
    ["spec.towing", (c) => (c.towing ? n(c.towing, "unit.kg") : "—")],
    ["spec.owners", (c) => c.owners],
    ["car.equipment", (c) => c.features.length],
  ];

  return (
    <div className="container-x py-8">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{t("compare.title")}</h1>
      {cars.length === 0 ? (
        <div className="card mt-6 flex flex-col items-center p-12 text-center">
          <GitCompareArrows className="h-10 w-10 text-brand-700" />
          <p className="mt-4 max-w-md text-muted">{t("compare.empty")}</p>
          <Link href="/voitures" className="btn-primary mt-6">
            {t("nav.cars")}
          </Link>
        </div>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr>
                <th className="w-44" />
                {cars.map((c) => (
                  <th key={c.slug} className="p-4 text-start align-top font-normal">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => toggleCompare(c.slug)}
                        className="absolute end-1 top-1 grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow"
                        aria-label={t("compare.remove")}
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <Link href={vehiclePath(c)}>
                        <img src={c.photos[0]?.thumb} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
                        <p className="mt-2 font-bold" dir="ltr">
                          {c.make} {c.model}
                        </p>
                        <p className="text-xs text-muted" dir="ltr">
                          {c.trim}
                        </p>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([k, get]) => (
                <tr key={k} className="border-t border-line">
                  <th scope="row" className="px-4 py-2.5 text-start font-medium text-muted">
                    {t(k)}
                  </th>
                  {cars.map((c) => (
                    <td key={c.slug} className="ltr-nums px-4 py-2.5 font-semibold">
                      {get(c)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-line">
                <td />
                {cars.map((c) => (
                  <td key={c.slug} className="p-4">
                    <a href={carWhatsapp(c, t, locale)} target="_blank" rel="noopener" className="btn-whatsapp w-full">
                      <WhatsAppIcon className="h-4 w-4" /> {t("card.whatsapp")}
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
