import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { CarCard } from "../components/CarCard";
import { WhatsAppIcon } from "../components/icons";
import {
  COLORS,
  COLOR_HEX,
  DRIVETRAINS,
  FILTER_KEYS,
  FUELS,
  MILEAGE_STEPS,
  MOTO_MILEAGE_STEPS,
  MOTO_PRICE_STEPS,
  PRICE_STEPS,
  TRANSMISSIONS,
  bodiesOf,
  filterCars,
  listOf,
  makes,
  modelsOf,
  type Filters,
} from "../data/catalog";
import type { Kind } from "../data/types";
import { useI18n } from "../i18n/I18nContext";
import { whatsappLink } from "../lib/contact";
import { useCurrency } from "../contexts/CurrencyContext";
import { formatNumber } from "../lib/format";
import { usePageMeta } from "../lib/usePageMeta";

function useFilters() {
  const search = useSearch();
  const [location, navigate] = useLocation();
  const filters = useMemo(() => {
    const p = new URLSearchParams(search);
    const f: Filters = {};
    for (const k of FILTER_KEYS) {
      const v = p.get(k);
      if (v) f[k] = v;
    }
    return f;
  }, [search]);
  const set = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch };
    if ("make" in patch && patch.make !== filters.make) delete next.model;
    const p = new URLSearchParams();
    for (const k of FILTER_KEYS) if (next[k]) p.set(k, next[k]!);
    navigate(`${location}${p.size ? `?${p}` : ""}`, { replace: true });
  };
  const reset = () => navigate(location, { replace: true });
  return { filters, set, reset };
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-b border-line py-4 last:border-0">
      <legend className="mb-2 text-sm font-bold">{title}</legend>
      {children}
    </fieldset>
  );
}

function Pills<T extends string>({ value, options, label, onChange }: { value?: string; options: T[]; label: (o: T) => string; onChange: (v?: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(active ? undefined : o)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              active ? "border-brand-800 bg-brand-800 text-white" : "border-line bg-white hover:border-brand-700"
            }`}
          >
            {label(o)}
          </button>
        );
      })}
    </div>
  );
}

function FilterPanel({ filters, set, kind }: { filters: Filters; set: (p: Partial<Filters>) => void; kind: Kind }) {
  const { t, locale } = useI18n();
  const { money } = useCurrency();
  const list = listOf(kind);
  const moto = kind === "moto";
  const YEARS = [...new Set(list.map((c) => c.year))].sort((a, b) => b - a);
  const priceSteps = moto ? MOTO_PRICE_STEPS : PRICE_STEPS;
  const mileageSteps = moto ? MOTO_MILEAGE_STEPS : MILEAGE_STEPS;
  return (
    <div>
      {moto && (
        <Group title={t("filter.licence")}>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={filters.lic === "A2"}
              onChange={(e) => set({ lic: e.target.checked ? "A2" : undefined })}
              className="h-4 w-4 accent-brand-800"
            />
            {t("filter.a2")}
          </label>
        </Group>
      )}
      {list.some((c) => c.condition === "new") && (
        <Group title={t("filter.condition")}>
          <Pills value={filters.cond} options={["new", "used"]} label={(o) => t(o === "new" ? "condition.new" : "condition.used")} onChange={(v) => set({ cond: v })} />
        </Group>
      )}
      <Group title={t("filter.make")}>
        <select value={filters.make ?? ""} onChange={(e) => set({ make: e.target.value || undefined })} className="field">
          <option value="">{t("search.allMakes")}</option>
          {makes(list).map(({ make, count }) => (
            <option key={make} value={make}>
              {make} ({count})
            </option>
          ))}
        </select>
        <select
          value={filters.model ?? ""}
          onChange={(e) => set({ model: e.target.value || undefined })}
          className="field mt-2"
          disabled={!filters.make}
          aria-label={t("filter.model")}
        >
          <option value="">{t("search.allModels")}</option>
          {filters.make && modelsOf(filters.make, list).map((m) => <option key={m}>{m}</option>)}
        </select>
      </Group>
      <Group title={t("filter.body")}>
        <Pills
          value={filters.body}
          options={bodiesOf(kind).filter((b) => list.some((c) => c.body === b))}
          label={(o) => t(`body.${o}`)}
          onChange={(v) => set({ body: v })}
        />
      </Group>
      <Group title={t("filter.price")}>
        <div className="grid grid-cols-2 gap-2">
          <select value={filters.pmin ?? ""} onChange={(e) => set({ pmin: e.target.value || undefined })} className="field" aria-label={`${t("filter.price")} ${t("filter.min")}`}>
            <option value="">{t("filter.min")}</option>
            {priceSteps.map((p) => (
              <option key={p} value={p}>
                {money(p, locale)}
              </option>
            ))}
          </select>
          <select value={filters.pmax ?? ""} onChange={(e) => set({ pmax: e.target.value || undefined })} className="field" aria-label={`${t("filter.price")} ${t("filter.max")}`}>
            <option value="">{t("filter.max")}</option>
            {priceSteps.map((p) => (
              <option key={p} value={p}>
                {money(p, locale)}
              </option>
            ))}
          </select>
        </div>
      </Group>
      <Group title={t("filter.year")}>
        <div className="grid grid-cols-2 gap-2">
          <select value={filters.ymin ?? ""} onChange={(e) => set({ ymin: e.target.value || undefined })} className="field" aria-label={`${t("filter.year")} ${t("filter.min")}`}>
            <option value="">{t("filter.min")}</option>
            {[...YEARS].reverse().map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
          <select value={filters.ymax ?? ""} onChange={(e) => set({ ymax: e.target.value || undefined })} className="field" aria-label={`${t("filter.year")} ${t("filter.max")}`}>
            <option value="">{t("filter.max")}</option>
            {YEARS.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
      </Group>
      <Group title={t("filter.mileage")}>
        <select value={filters.kmax ?? ""} onChange={(e) => set({ kmax: e.target.value || undefined })} className="field">
          <option value="">{t("filter.any")}</option>
          {mileageSteps.map((k) => (
            <option key={k} value={k}>
              {t("filter.upTo", { v: `${formatNumber(k, locale)} ${t("unit.km")}` })}
            </option>
          ))}
        </select>
      </Group>
      <Group title={t("filter.fuel")}>
        <Pills value={filters.fuel} options={FUELS.filter((f) => list.some((c) => c.fuel === f))} label={(o) => t(`fuel.${o}`)} onChange={(v) => set({ fuel: v })} />
      </Group>
      <Group title={t("filter.transmission")}>
        <Pills value={filters.tr} options={TRANSMISSIONS} label={(o) => t(`transmission.${o}`)} onChange={(v) => set({ tr: v })} />
      </Group>
      {!moto && (
        <>
          <Group title={t("filter.drivetrain")}>
            <Pills value={filters.dt} options={DRIVETRAINS} label={(o) => t(`drivetrain.${o}`)} onChange={(v) => set({ dt: v })} />
          </Group>
          <Group title={t("filter.seats")}>
            <Pills value={filters.seats} options={["5", "7", "8"]} label={(o) => t("filter.seatsMin", { n: o })} onChange={(v) => set({ seats: v })} />
          </Group>
        </>
      )}
      <Group title={t("filter.color")}>
        <div className="flex flex-wrap gap-2">
          {COLORS.filter((c) => list.some((car) => car.colorExt === c)).map((c) => {
            const active = filters.color === c;
            return (
              <button
                key={c}
                type="button"
                title={t(`color.${c}`)}
                aria-label={t(`color.${c}`)}
                aria-pressed={active}
                onClick={() => set({ color: active ? undefined : c })}
                className={`h-8 w-8 rounded-full border-2 transition ${active ? "border-brand-800 ring-2 ring-brand-100" : "border-line"}`}
                style={{ background: COLOR_HEX[c] }}
              />
            );
          })}
        </div>
      </Group>
    </div>
  );
}

export default function Listing({ kind }: { kind: Kind }) {
  const { t } = useI18n();
  const { filters, set, reset } = useFilters();
  const [drawer, setDrawer] = useState(false);
  const results = useMemo(() => filterCars(filters, listOf(kind)), [filters, kind]);
  const activeCount = FILTER_KEYS.filter((k) => k !== "sort" && filters[k]).length;
  const heading = [filters.make, filters.model, filters.body && t(`body.${filters.body}` as "body.suv")].filter(Boolean).join(" ") || t(kind === "moto" ? "list.titleMoto" : "list.title");
  usePageMeta(`${heading} — Fahd Auto`, t("meta.description"));

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
  }, [drawer]);

  const chips = FILTER_KEYS.filter((k) => k !== "sort" && filters[k]);
  const chipLabel = (k: keyof Filters) => {
    const v = filters[k]!;
    switch (k) {
      case "body": return t(`body.${v}` as "body.suv");
      case "fuel": return t(`fuel.${v}` as "fuel.petrol");
      case "tr": return t(`transmission.${v}` as "transmission.manual");
      case "dt": return t(`drivetrain.${v}` as "drivetrain.4x4");
      case "color": return t(`color.${v}` as "color.white");
      case "seats": return t("filter.seatsMin", { n: v });
      case "lic": return t("filter.a2");
      case "cond": return t(v === "new" ? "condition.new" : "condition.used");
      case "pmin": return `≥ ${v} €`;
      case "pmax": return `≤ ${v} €`;
      case "ymin": return `≥ ${v}`;
      case "ymax": return `≤ ${v}`;
      case "kmax": return `≤ ${v} km`;
      default: return v;
    }
  };

  return (
    <div className="container-x py-8">
      <nav className="text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">
          {t("car.home")}
        </Link>{" "}
        / <span className="text-ink">{t(kind === "moto" ? "nav.motos" : "nav.cars")}</span>
      </nav>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{heading}</h1>
          <p className="mt-1 text-sm text-muted">{t(results.length === 1 ? "list.result" : "list.results", { n: results.length })}</p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <button type="button" onClick={() => setDrawer(true)} className="btn-outline flex-1 lg:hidden">
            <SlidersHorizontal className="h-4 w-4" /> {t("list.filters")}
            {activeCount > 0 && <span className="rounded-full bg-brand-800 px-1.5 text-xs text-white">{activeCount}</span>}
          </button>
          <label className="flex flex-1 items-center gap-2 text-sm sm:flex-none">
            <span className="hidden whitespace-nowrap text-muted sm:inline">{t("list.sort")}</span>
            <select value={filters.sort ?? ""} onChange={(e) => set({ sort: e.target.value || undefined })} className="field">
              <option value="">{t("list.sort.recommended")}</option>
              <option value="priceAsc">{t("list.sort.priceAsc")}</option>
              <option value="priceDesc">{t("list.sort.priceDesc")}</option>
              <option value="yearDesc">{t("list.sort.yearDesc")}</option>
              <option value="mileageAsc">{t("list.sort.mileageAsc")}</option>
            </select>
          </label>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {chips.map((k) => (
            <button key={k} type="button" onClick={() => set({ [k]: undefined })} className="chip bg-brand-50 text-brand-800">
              <span dir="auto">{chipLabel(k)}</span> <X className="h-3.5 w-3.5" />
            </button>
          ))}
          <button type="button" onClick={reset} className="text-sm font-semibold text-accent-600 hover:underline">
            {t("list.reset")}
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="card sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto px-4">
            <FilterPanel filters={filters} set={set} kind={kind} />
          </div>
        </aside>

        <div>
          {results.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((c, i) => (
                <CarCard key={c.slug} car={c} eager={i < 3} />
              ))}
            </div>
          ) : (
            <div className="card flex flex-col items-center p-10 text-center">
              <h2 className="text-lg font-bold">{t("list.empty.title")}</h2>
              <p className="mt-2 max-w-md text-sm text-muted">{t("list.empty.text")}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <button type="button" onClick={reset} className="btn-outline">
                  {t("list.reset")}
                </button>
                <a
                  href={whatsappLink(`${t("msg.general")} ${[filters.make, filters.model, filters.q].filter(Boolean).join(" ")}`)}
                  target="_blank"
                  rel="noopener"
                  className="btn-whatsapp"
                >
                  <WhatsAppIcon className="h-4 w-4" /> {t("list.empty.ask")}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label={t("list.filters")}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-3xl bg-white">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-lg font-bold">{t("list.filters")}</h2>
              <button type="button" onClick={() => setDrawer(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-canvas" aria-label={t("nav.close")}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-5">
              <FilterPanel filters={filters} set={set} kind={kind} />
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-line p-4">
              <button type="button" onClick={reset} className="btn-outline">
                {t("list.reset")}
              </button>
              <button type="button" onClick={() => setDrawer(false)} className="btn-primary">
                {t("list.showResults", { n: results.length })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
