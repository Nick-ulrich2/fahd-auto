import { Calendar, Fuel, Gauge, GitCompareArrows, Heart, ImageIcon, Mail, MapPin, Settings2 } from "lucide-react";
import { Link } from "wouter";
import { useSaved } from "../contexts/SavedContext";
import { vehiclePath } from "../data/catalog";
import type { Car } from "../data/types";
import { useI18n } from "../i18n/I18nContext";
import { carEmail, carWhatsapp } from "../lib/contact";
import { priceParts, useCurrency } from "../contexts/CurrencyContext";
import { formatNumber } from "../lib/format";
import { WhatsAppIcon } from "./icons";
import { useToast } from "./Toast";

export function CarCard({ car, eager = false }: { car: Car; eager?: boolean }) {
  const { t, locale } = useI18n();
  const { isFavorite, toggleFavorite, inCompare, toggleCompare } = useSaved();
  const toast = useToast();
  const fav = isFavorite(car.slug);
  const cmp = inCompare(car.slug);
  const href = vehiclePath(car);
  const { currency } = useCurrency();
  const price = priceParts(car, locale, currency);

  return (
    <article className="group card flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-xl hover:shadow-brand-900/5">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
        <Link href={href} aria-label={`${car.make} ${car.model} ${car.trim}`}>
          <img
            src={car.photos[0]?.thumb}
            srcSet={car.photos[0] ? `${car.photos[0].thumb} 640w, ${car.photos[0].src} 1280w` : undefined}
            sizes="(min-width: 1280px) 300px, (min-width: 640px) 50vw, 100vw"
            width={640}
            height={480}
            alt={`${car.make} ${car.model} ${car.trim} ${car.year}`}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] ${car.status === "sold" ? "grayscale" : ""}`}
          />
        </Link>
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          {car.status === "sold" || car.status === "reserved" ? (
            <span className={`rounded-md px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${car.status === "sold" ? "bg-ink text-white" : "bg-amber-400 text-ink"}`}>
              {t(car.status === "sold" ? "status.sold" : "status.reserved")}
            </span>
          ) : car.featured ? (
            <span className="rounded-md bg-accent-600 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              {t("card.featured")}
            </span>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={() => toggleFavorite(car.slug)}
            aria-pressed={fav}
            aria-label={t(fav ? "card.unfavorite" : "card.favorite")}
            className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow-sm transition hover:scale-105"
          >
            <Heart className={`h-[18px] w-[18px] ${fav ? "fill-accent-600 text-accent-600" : "text-ink"}`} />
          </button>
        </div>
        <span className="absolute bottom-3 start-3 inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-white">
          <ImageIcon className="h-3.5 w-3.5" /> {car.photos.length > 1 ? t("card.photos", { n: car.photos.length }) : t("card.photo")}
        </span>
        {car.condition === "new" && (
          <span className="absolute bottom-3 end-3 rounded-md bg-brand-800 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            {t("condition.new")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <Link href={href} className="block">
          <h3 className="truncate text-base font-bold text-ink group-hover:text-brand-800" dir="ltr">
            {car.make} {car.model}
          </h3>
          <p className="truncate text-sm text-muted" dir="ltr">
            {car.trim}
          </p>
        </Link>

        <div className="mt-3">
          <span className="text-xs font-medium text-muted">{t("card.from")}</span>
          <p className="ltr-nums text-xl font-extrabold text-brand-800">{price.main}</p>
          {price.secondary && <p className="ltr-nums text-xs text-muted">{t("price.approx", { v: price.secondary })}</p>}
        </div>

        <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[13px] text-muted">
          <li className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" /> {car.year}
          </li>
          <li className="flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 shrink-0" />
            <span className="ltr-nums">
              {formatNumber(car.mileage, locale)} {t("unit.km")}
            </span>
          </li>
          {car.kind === "moto" ? (
            <>
              <li className="flex items-center gap-1.5">
                <Fuel className="h-3.5 w-3.5 shrink-0" />
                <span className="ltr-nums">
                  {formatNumber(car.engine.displacement, locale)} {t("unit.cc")}
                </span>
              </li>
              <li className="flex items-center gap-1.5">
                <Settings2 className="h-3.5 w-3.5 shrink-0" />
                <span className="ltr-nums">
                  {car.engine.powerHp} {t("unit.hp")}
                </span>
                {(car.moto?.licence === "A2" || car.moto?.licence === "A1") && (
                  <span className="rounded bg-brand-50 px-1 text-[10px] font-bold text-brand-800">{car.moto.licence}</span>
                )}
              </li>
            </>
          ) : (
            <>
              <li className="flex items-center gap-1.5">
                <Fuel className="h-3.5 w-3.5 shrink-0" /> {t(`fuel.${car.fuel}`)}
              </li>
              <li className="flex items-center gap-1.5">
                <Settings2 className="h-3.5 w-3.5 shrink-0" /> {t(`transmission.${car.transmission}`)}
              </li>
            </>
          )}
          <li className="col-span-2 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" /> {t(`loc.${car.location}`)}
          </li>
        </ul>

        <div className="mt-auto pt-4">
          <div className="grid grid-cols-2 gap-2">
            <a href={carWhatsapp(car, t, locale)} target="_blank" rel="noopener" className="btn-whatsapp gap-1.5 px-2">
              <WhatsAppIcon className="h-4 w-4" /> {t("card.whatsapp")}
            </a>
            <a href={carEmail(car, t, locale)} className="btn-outline gap-1.5 px-2">
              <Mail className="h-4 w-4" /> {t("card.email")}
            </a>
          </div>
          <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs font-medium text-muted select-none">
            <input
              type="checkbox"
              checked={cmp}
              onChange={() => {
                if (!toggleCompare(car.slug)) toast(t("compare.max"));
              }}
              className="h-4 w-4 accent-brand-800"
            />
            <GitCompareArrows className="h-3.5 w-3.5" /> {t("card.compare")}
          </label>
        </div>
      </div>
    </article>
  );
}
