import {
  Calendar,
  Check,
  CircleCheck,
  CircleX,
  Cog,
  Fuel,
  Gauge,
  GitCompareArrows,
  Globe2,
  Heart,
  Info,
  Mail,
  MapPin,
  Phone,
  Settings2,
  Share2,
  Ship,
  Users,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "wouter";
import { CarCard } from "../components/CarCard";
import { Gallery } from "../components/Gallery";
import { WhatsAppIcon } from "../components/icons";
import { OfferButton } from "../components/OfferDialog";
import { useToast } from "../components/Toast";
import { useSaved } from "../contexts/SavedContext";
import { PORTS, getCar, listPath, similarCars, vehiclePath } from "../data/catalog";
import { BreadcrumbJsonLd, VehicleJsonLd } from "../components/JsonLd";
import { LandedCost } from "../components/LandedCost";
import { LotQuote } from "../components/LotQuote";
import { SecureBox } from "../components/TrustBox";
import { FEATURE_GROUPS } from "../data/features";
import type { Car, FeatureGroup, Kind } from "../data/types";
import { useI18n } from "../i18n/I18nContext";
import type { TKey } from "../i18n/fr";
import { carEmail, carUrl, carWhatsapp, phoneLink } from "../lib/contact";
import { describe, engineLabel, gearboxLabel } from "../lib/describe";
import { priceParts, useCurrency } from "../contexts/CurrencyContext";
import { formatMonth, formatNumber } from "../lib/format";
import { usePageMeta } from "../lib/usePageMeta";
import NotFound from "./NotFound";

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="card scroll-mt-32 p-5 sm:p-6">
      <h2 className="text-lg font-extrabold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

type Row = [TKey, ReactNode];

function SpecTable({ rows }: { rows: Row[] }) {
  const { t } = useI18n();
  return (
    <dl className="divide-y divide-line text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 py-2.5">
          <dt className="text-muted">{t(k)}</dt>
          <dd className="text-end font-semibold">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function useSpecs(car: Car) {
  const { t, locale } = useI18n();
  const n = (v: number, unit: TKey, d = 0) => (
    <span className="ltr-nums">
      {formatNumber(v, locale, d)} {t(unit)}
    </span>
  );
  const ev = car.fuel === "electric";
  const general: Row[] = [
    ["spec.make", car.make],
    ["spec.model", car.model],
    ["spec.trim", <span dir="ltr">{car.trim}</span>],
    ["spec.generation", <span dir="ltr">{car.generation}</span>],
    ["spec.year", car.year],
    ["spec.condition", t(car.condition === "new" ? "condition.new" : "condition.used")],
    ...(car.condition === "new" ? [] : ([["spec.firstRegistration", formatMonth(car.firstRegistration, locale)]] as Row[])),
    ["spec.mileage", n(car.mileage, "unit.km")],
    ["spec.body", t(`body.${car.body}`)],
    ["spec.colorExt", car.colorExtName || t(`color.${car.colorExt}`)],
    ["spec.location", t(`loc.${car.location}`)],
  ];
  const engine: Row[] = [
    ["spec.fuel", t(`fuel.${car.fuel}`)],
    ["spec.engine", engineLabel(car, t, locale)],
    ...(!ev ? ([["spec.displacement", n(car.engine.displacement, "unit.cc")], ["spec.cylinders", car.engine.cylinders]] as Row[]) : []),
    ["spec.power", <span className="ltr-nums">{car.engine.powerHp} {t("unit.hp")} ({Math.round(car.engine.powerHp * 0.7355)} kW)</span>],
    ["spec.torque", n(car.engine.torqueNm, "unit.nm")],
    ...(car.engine.batteryKwh ? ([["spec.battery", n(car.engine.batteryKwh, "unit.kwh", 1)]] as Row[]) : []),
    ...(car.engine.electricRangeKm ? ([["spec.electricRange", n(car.engine.electricRangeKm, "unit.km")]] as Row[]) : []),
    ["spec.transmission", `${t(`transmission.${car.transmission}`)} · ${gearboxLabel(car, t)}`],
    [car.moto ? "spec.finalDrive" : "spec.drivetrain", t(`drivetrain.${car.drivetrain}`)],
    ...(car.moto ? ([["spec.cooling", t(`cooling.${car.moto.cooling}`)]] as Row[]) : []),
    ...(car.performance.zeroTo100 ? ([["spec.zeroTo100", n(car.performance.zeroTo100, "unit.s", 1)]] as Row[]) : []),
    ["spec.topSpeed", n(car.performance.topSpeed, "unit.kmh")],
    [ev ? "spec.consumptionEv" : "spec.consumption", n(car.consumption, ev ? "unit.kwh100" : "unit.l100", 1)],
    ["spec.co2", n(car.co2, "unit.gkm")],
    ["spec.euroNorm", car.euroNorm],
  ];
  const dims: Row[] = [
    ["spec.length", n(car.dimensions.length, "unit.mm")],
    ["spec.width", n(car.dimensions.width, "unit.mm")],
    ["spec.height", n(car.dimensions.height, "unit.mm")],
    ["spec.wheelbase", n(car.dimensions.wheelbase, "unit.mm")],
    ...(car.moto ? ([["spec.seatHeight", n(car.moto.seatHeight, "unit.mm")]] as Row[]) : []),
    ["spec.weight", n(car.weight, "unit.kg")],
    ...(!ev ? ([["spec.tank", n(car.tank, "unit.l", car.tank % 1 ? 1 : 0)]] as Row[]) : []),
    ...(car.boot ? ([["spec.boot", n(car.boot, "unit.l")]] as Row[]) : []),
    ...(car.payload ? ([["spec.payload", n(car.payload, "unit.kg")]] as Row[]) : []),
    ...(car.towing ? ([["spec.towing", n(car.towing, "unit.kg")]] as Row[]) : []),
  ];
  const cabin: Row[] = [
    ["spec.seats", car.seats],
    ["spec.doors", car.doors],
    ["spec.upholstery", t(`upholstery.${car.upholstery}`)],
    ["spec.colorInt", t(`color.${car.colorInt}`)],
    ["spec.wheels", <span className="ltr-nums">{car.wheelsInch}″</span>],
    ["spec.airbags", car.airbags],
  ];
  const m = car.moto;
  if (m) {
    const brake = (b: { discs: number; diameter: number }) => (
      <span className="ltr-nums">
        {b.discs ? t("spec.brakeFormat", { n: b.discs, d: b.diameter }) : t("spec.drumFormat", { d: b.diameter })}
      </span>
    );
    const chassis: Row[] = [
      ["spec.licence", t(`licence.${m.licence}`)],
      ["spec.frontSuspension", t("spec.suspFormat", { type: t(`susp.${m.frontSuspension}`), t: m.frontTravel })],
      ["spec.rearSuspension", t("spec.suspFormat", { type: t(`susp.${m.rearSuspension}`), t: m.rearTravel })],
      ["spec.frontBrake", brake(m.frontBrake)],
      ["spec.rearBrake", brake(m.rearBrake)],
      ["spec.frontTyre", <span dir="ltr">{m.frontTyre}</span>],
      ["spec.rearTyre", <span dir="ltr">{m.rearTyre}</span>],
      ["spec.seats", car.seats],
    ];
    return [
      ["spec.group.general", general],
      ["spec.group.engine", engine],
      ["spec.group.dimensions", dims],
      ["spec.group.chassis", chassis],
    ] as [TKey, Row[]][];
  }
  return [
    ["spec.group.general", general],
    ["spec.group.engine", engine],
    ["spec.group.dimensions", dims],
    ["spec.group.interior", cabin],
  ] as [TKey, Row[]][];
}

function YesNo({ ok }: { ok: boolean }) {
  const { t } = useI18n();
  return ok ? (
    <span className="inline-flex items-center gap-1 text-brand-700">
      <CircleCheck className="h-4 w-4" /> {t("yes")}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-muted">
      <CircleX className="h-4 w-4" /> {t("no")}
    </span>
  );
}

function ContactBox({ car }: { car: Car }) {
  const { t, locale } = useI18n();
  const { currency } = useCurrency();
  const price = priceParts(car, locale, currency);
  const toast = useToast();
  const { isFavorite, toggleFavorite, inCompare, toggleCompare } = useSaved();
  const fav = isFavorite(car.slug);

  const share = async () => {
    const url = carUrl(car);
    try {
      if (navigator.share) await navigator.share({ title: `${car.make} ${car.model}`, url });
      else {
        await navigator.clipboard.writeText(url);
        toast(t("car.copied"));
      }
    } catch {
      /* partage annulé */
    }
  };

  return (
    <div className="card p-5 sm:p-6">
      {car.status && car.status !== "available" && (
        <p className={`mb-3 rounded-lg px-3 py-2 text-sm font-bold ${car.status === "sold" ? "bg-ink text-white" : "bg-amber-100 text-amber-900"}`}>
          {t(car.status === "sold" ? "status.sold" : "status.reserved")}
          {car.status === "sold" && <span className="block text-xs font-normal opacity-80">{t("car.soldText")}</span>}
        </p>
      )}
      <p className="text-sm text-muted">{t("car.from")}</p>
      <p className="ltr-nums text-3xl font-extrabold text-brand-800">{price.main}</p>
      {price.secondary && <p className="ltr-nums text-sm font-semibold text-muted">{t("price.approx", { v: price.secondary })}</p>}
      <p className="mt-1 flex items-start gap-1.5 text-xs text-muted">
        <Info className="mt-px h-3.5 w-3.5 shrink-0" /> {t("car.negotiable")}
      </p>
      <div className="mt-5 space-y-2.5">
        <a href={carWhatsapp(car, t, locale)} target="_blank" rel="noopener" className="btn-whatsapp h-12 w-full text-base">
          <WhatsAppIcon className="h-5 w-5" /> {t(car.status === "sold" ? "car.findSimilar" : "car.ctaWhatsapp")}
        </a>
        <a href={carEmail(car, t, locale)} className="btn-primary h-12 w-full text-base">
          <Mail className="h-5 w-5" /> {t("car.ctaEmail")}
        </a>
        <div className="grid grid-cols-2 gap-2.5">
          <OfferButton car={car} />
          <a href={phoneLink()} className="btn-outline">
            <Phone className="h-4 w-4" /> {t("car.call")}
          </a>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-sm">
        <button type="button" onClick={() => toggleFavorite(car.slug)} aria-pressed={fav} className="flex items-center gap-1.5 font-medium hover:text-accent-600">
          <Heart className={`h-4 w-4 ${fav ? "fill-accent-600 text-accent-600" : ""}`} /> {t("nav.favorites")}
        </button>
        <button
          type="button"
          onClick={() => !toggleCompare(car.slug) && toast(t("compare.max"))}
          aria-pressed={inCompare(car.slug)}
          className={`flex items-center gap-1.5 font-medium hover:text-brand-800 ${inCompare(car.slug) ? "text-brand-800" : ""}`}
        >
          <GitCompareArrows className="h-4 w-4" /> {t("card.compare")}
        </button>
        <button type="button" onClick={share} className="flex items-center gap-1.5 font-medium hover:text-brand-800">
          <Share2 className="h-4 w-4" /> {t("car.share")}
        </button>
      </div>
      <p className="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-center text-xs font-medium text-brand-800">{t("car.reply")}</p>
    </div>
  );
}

export default function CarDetail({ slug, kind }: { slug: string; kind: Kind }) {
  const { t } = useI18n();
  const car = getCar(slug, kind);
  if (!car) return <NotFound message={t("car.notFound")} />;
  return <CarView key={car.slug} car={car} />;
}

function CarView({ car }: { car: Car }) {
  const { t, locale } = useI18n();
  const { currency } = useCurrency();
  usePageMeta(`${car.make} ${car.model} ${car.trim} ${car.year} — Fahd Auto`, describe(car, t, locale)[0], car.photos[0]?.src);
  const specs = useSpecs(car);
  const similar = similarCars(car);
  const groups = (Object.keys(FEATURE_GROUPS) as FeatureGroup[])
    .map((g) => ({ g, items: FEATURE_GROUPS[g].filter((f) => car.features.includes(f)) }))
    .filter((x) => x.items.length);

  const moto = car.kind === "moto";
  const keyFacts = [
    { Icon: Calendar, label: t("spec.year"), value: car.year },
    { Icon: Gauge, label: t("spec.mileage"), value: `${formatNumber(car.mileage, locale)} ${t("unit.km")}` },
    moto
      ? { Icon: Fuel, label: t("spec.displacement"), value: `${formatNumber(car.engine.displacement, locale)} ${t("unit.cc")}` }
      : { Icon: Fuel, label: t("spec.fuel"), value: t(`fuel.${car.fuel}`) },
    { Icon: Settings2, label: t("spec.transmission"), value: t(`transmission.${car.transmission}`) },
    { Icon: Zap, label: t("spec.power"), value: `${car.engine.powerHp} ${t("unit.hp")}` },
    moto
      ? { Icon: Cog, label: t("spec.finalDrive"), value: t(`drivetrain.${car.drivetrain}`) }
      : { Icon: Cog, label: t("spec.drivetrain"), value: car.drivetrain === "4x4" ? "4x4" : t(`drivetrain.${car.drivetrain}`) },
    car.moto
      ? { Icon: Users, label: t("spec.licence"), value: car.moto.licence }
      : { Icon: Users, label: t("spec.seats"), value: car.seats },
    { Icon: MapPin, label: t("spec.location"), value: t(`loc.${car.location}`) },
  ];

  const nav: [string, TKey][] = [
    ["apercu", "car.overview"],
    ["prix-livre", "calc.title"],
    ["specs", "car.specs"],
    ["equipements", "car.equipment"],
    ["historique", "car.history"],
    ["export", "car.shipping"],
  ];

  return (
    <div className="container-x py-6 pb-28 lg:pb-8">
      <VehicleJsonLd car={car} description={describe(car, t, locale).join(" ")} />
      <BreadcrumbJsonLd
        items={[
          { name: t("car.home"), path: "/" },
          { name: t(moto ? "nav.motos" : "nav.cars"), path: listPath(car.kind) },
          { name: `${car.make} ${car.model}`, path: vehiclePath(car) },
        ]}
      />
      <nav className="truncate text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">{t("car.home")}</Link> /{" "}
        <Link href={listPath(car.kind)} className="hover:text-ink">{t(moto ? "nav.motos" : "nav.cars")}</Link> /{" "}
        <Link href={`${listPath(car.kind)}?make=${encodeURIComponent(car.make)}`} className="hover:text-ink">{car.make}</Link> /{" "}
        <span className="text-ink">{car.model}</span>
      </nav>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl" dir="ltr">
            {car.make} {car.model} <span className="text-muted">{car.trim}</span>
          </h1>
          <p className="mt-1 text-sm text-muted">
            {car.year} · {car.generation} · {t("car.ref")} <span className="font-semibold text-ink">{car.ref}</span>
            <span className="ms-2 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-800">
              <Globe2 className="h-3.5 w-3.5" /> {t(car.location === "dubai" ? "origin.dubai" : "origin.europe")}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-6">
          <div>
            <Gallery car={car} />
            <p className="mt-2 flex items-start gap-1.5 text-xs text-muted">
              <Info className="mt-px h-3.5 w-3.5 shrink-0" /> {t("car.illustration")}
            </p>
          </div>

          <div className="space-y-4 lg:hidden">
            <ContactBox car={car} />
            <SecureBox />
            {(car.body === "commuter" || car.body === "tricycle") && <LotQuote car={car} />}
          </div>

          <div className="sticky top-16 z-20 -mx-4 overflow-x-auto border-y border-line bg-canvas/95 px-4 backdrop-blur scrollbar-none sm:mx-0 sm:rounded-xl sm:border sm:bg-white lg:top-[108px]">
            <div className="flex gap-1 py-2">
              {nav.map(([id, k]) => (
                <a key={id} href={`#${id}`} className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold text-muted hover:bg-brand-50 hover:text-brand-800">
                  {t(k)}
                </a>
              ))}
            </div>
          </div>

          <Section id="apercu" title={t("car.overview")}>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {keyFacts.map(({ Icon, label, value }) => (
                <li key={label} className="rounded-xl bg-canvas p-3">
                  <Icon className="h-5 w-5 text-brand-700" />
                  <p className="mt-2 text-xs text-muted">{label}</p>
                  <p className="ltr-nums text-sm font-bold">{value}</p>
                </li>
              ))}
            </ul>
            <h3 className="mt-6 font-bold">{t("car.description")}</h3>
            <div className="mt-2 space-y-3 text-sm leading-relaxed text-ink/90">
              {describe(car, t, locale).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Section>

          <Section id="prix-livre" title={t("calc.title")}>
            <LandedCost car={car} />
          </Section>

          <Section id="specs" title={t("car.specs")}>
            <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
              {specs.map(([title, rows]) => (
                <div key={title}>
                  <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-brand-800">{t(title)}</h3>
                  <SpecTable rows={rows} />
                </div>
              ))}
            </div>
          </Section>

          <Section id="equipements" title={t("car.equipment")}>
            <div className="grid gap-6 md:grid-cols-2">
              {groups.map(({ g, items }) => (
                <div key={g}>
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-brand-800">{t(`group.${g}`)}</h3>
                  <ul className="space-y-1.5 text-sm">
                    {items.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
                        {t(`feature.${f}` as TKey)}
                        {f === "alloyWheels" && <span className="ltr-nums text-muted">({car.wheelsInch}″)</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section id="historique" title={t("car.history")}>
            <SpecTable
              rows={[
                ["spec.condition", t(car.condition === "new" ? "condition.new" : "condition.used")],
                ...(car.condition === "new"
                  ? []
                  : ([
                      ["spec.owners", car.owners],
                      ["spec.serviceHistory", <YesNo ok={car.serviceHistory} />],
                    ] as Row[])),
                ["spec.carPass", <YesNo ok={car.carPass} />],
                ["spec.coc", <YesNo ok={car.coc} />],
                ["spec.accidentFree", <YesNo ok={car.accidentFree} />],
                ["spec.keys", car.keys],
                ["spec.warranty", car.warrantyMonths ? t("spec.warrantyMonths", { n: car.warrantyMonths }) : t("spec.noWarranty")],
              ]}
            />
          </Section>

          <Section id="export" title={t("car.shipping")}>
            <div className="flex gap-3">
              <Ship className="h-6 w-6 shrink-0 text-accent-600" />
              <p className="text-sm leading-relaxed">{t(car.location === "dubai" ? "car.shipping.textDubai" : "car.shipping.text")}</p>
            </div>
            <h3 className="mt-5 text-sm font-bold">{t("car.shipping.docs")}</h3>
            <p className="mt-1 text-sm text-muted">{t("car.shipping.docsList")}</p>
            <h3 className="mt-5 text-sm font-bold">{t("car.shipping.ports")}</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {PORTS.map((p) => (
                <span key={p} className="rounded-full bg-canvas px-2.5 py-1 text-xs font-medium">
                  {p}
                </span>
              ))}
            </div>
          </Section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-[124px]">
            <ContactBox car={car} />
            <div className="mt-4 space-y-4">
              <SecureBox />
              {(car.body === "commuter" || car.body === "tricycle") && <LotQuote car={car} />}
            </div>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="pt-14">
          <h2 className="section-title">{t("car.similar")}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((c) => (
              <CarCard key={c.slug} car={c} />
            ))}
          </div>
        </section>
      )}

      {/* Barre d'action mobile toujours visible */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-muted">{t("card.from")}</p>
            <p className="ltr-nums truncate text-lg font-extrabold text-brand-800">{priceParts(car, locale, currency).main}</p>
          </div>
          <a href={carEmail(car, t, locale)} className="btn-outline h-11 w-11 p-0" aria-label={t("card.email")}>
            <Mail className="h-5 w-5" />
          </a>
          <a href={carWhatsapp(car, t, locale)} target="_blank" rel="noopener" className="btn-whatsapp h-11">
            <WhatsAppIcon className="h-5 w-5" /> {t("card.whatsapp")}
          </a>
        </div>
      </div>
    </div>
  );
}
