import { ArrowRight, BadgeCheck, Bike, Car, FileText, HandCoins, MessageCircle, Search, ShieldCheck, Ship, ThumbsUp } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { CarCard } from "../components/CarCard";
import { WhatsAppIcon } from "../components/icons";
import { TrustBar } from "../components/TrustBox";
import { BODIES, CARS, MOTOS, MOTO_BODIES, MOTO_PRICE_STEPS, PORTS, PRICE_STEPS, VEHICLES, bodiesOf, filterCars, listOf, listPath, makes, modelsOf } from "../data/catalog";
import type { Kind } from "../data/types";
import { useI18n } from "../i18n/I18nContext";
import { whatsappLink } from "../lib/contact";
import { useCurrency } from "../contexts/CurrencyContext";
import { usePageMeta } from "../lib/usePageMeta";

function HeroSearch() {
  const { t, locale } = useI18n();
  const { money } = useCurrency();
  const [, navigate] = useLocation();
  const [kind, setKind] = useState<Kind>("car");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [body, setBody] = useState("");
  const [pmax, setPmax] = useState("");
  const list = listOf(kind);
  const count = useMemo(() => filterCars({ make, model, body, pmax }, listOf(kind)).length, [make, model, body, pmax, kind]);
  const switchKind = (k: Kind) => {
    setKind(k);
    setMake("");
    setModel("");
    setBody("");
    setPmax("");
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (make) p.set("make", make);
    if (model) p.set("model", model);
    if (body) p.set("body", body);
    if (pmax) p.set("pmax", pmax);
    navigate(`${listPath(kind)}${p.size ? `?${p}` : ""}`);
  };

  return (
    <form onSubmit={submit} className="rounded-2xl bg-white p-3 shadow-2xl shadow-black/20 sm:p-4" role="search">
      <div className="mb-3 flex gap-1" role="tablist">
        {(["car", "moto"] as Kind[]).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={kind === k}
            onClick={() => switchKind(k)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
              kind === k ? "bg-brand-800 text-white" : "text-muted hover:bg-canvas hover:text-ink"
            }`}
          >
            {k === "car" ? <Car className="h-4 w-4" /> : <Bike className="h-4 w-4" />}
            {t(k === "car" ? "search.tabCars" : "search.tabMotos")}
          </button>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        <select value={make} onChange={(e) => { setMake(e.target.value); setModel(""); }} className="field h-12" aria-label={t("filter.make")}>
          <option value="">{t("search.allMakes")}</option>
          {makes(list).map(({ make: m, count: n }) => (
            <option key={m} value={m}>
              {m} ({n})
            </option>
          ))}
        </select>
        <select value={model} onChange={(e) => setModel(e.target.value)} className="field h-12" disabled={!make} aria-label={t("filter.model")}>
          <option value="">{t("search.allModels")}</option>
          {make && modelsOf(make, list).map((m) => <option key={m}>{m}</option>)}
        </select>
        <select value={body} onChange={(e) => setBody(e.target.value)} className="field h-12" aria-label={t("filter.body")}>
          <option value="">{t("search.allBodies")}</option>
          {bodiesOf(kind).filter((b) => list.some((c) => c.body === b)).map((b) => (
            <option key={b} value={b}>
              {t(`body.${b}`)}
            </option>
          ))}
        </select>
        <select value={pmax} onChange={(e) => setPmax(e.target.value)} className="field h-12" aria-label={t("filter.price")}>
          <option value="">{t("search.anyPrice")}</option>
          {(kind === "moto" ? MOTO_PRICE_STEPS : PRICE_STEPS).map((p) => (
            <option key={p} value={p}>
              {t("filter.upTo", { v: money(p, locale) })}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-accent h-12 px-6 text-base sm:col-span-2 lg:col-span-1">
          <Search className="h-5 w-5" /> {t(kind === "moto" ? "search.ctaMoto" : "search.cta", { n: count })}
        </button>
      </div>
    </form>
  );
}

function SectionHead({ title, sub, href }: { title: string; sub?: string; href?: string }) {
  const { t } = useI18n();
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="section-title">{title}</h2>
        {sub && <p className="mt-1 text-muted">{sub}</p>}
      </div>
      {href && (
        <Link href={href} className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-800 hover:underline">
          {t("home.viewAll")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const { t } = useI18n();
  usePageMeta(t("meta.title"), t("meta.description"));
  const featured = CARS.filter((c) => c.featured);
  const latest = [...CARS].sort((a, b) => b.firstRegistration.localeCompare(a.firstRegistration)).slice(0, 8);
  const hero = CARS.find((c) => c.slug === "toyota-land-cruiser-300") ?? CARS[0];
  const brandList = makes();
  const brandCount = makes(VEHICLES).length;
  const featuredMotos = MOTOS.filter((c) => c.featured);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-brand-950">
        <img src={hero.photos[0].src} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40" fetchPriority="high" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-950/70 via-brand-950/60 to-brand-950" />
        <div className="container-x pb-14 pt-14 sm:pt-20 lg:pb-20 lg:pt-24">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-100 ring-1 ring-white/20">
            <BadgeCheck className="h-4 w-4 text-white" /> {t("hero.kicker")}
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-brand-100 sm:text-lg">{t("hero.subtitle")}</p>
          <div className="mt-8">
            <HeroSearch />
          </div>
          <dl className="mt-8 grid max-w-xl grid-cols-3 gap-4 text-white">
            <div>
              <dt className="text-xs text-brand-100">{t("hero.stat.cars")}</dt>
              <dd className="text-xl font-extrabold sm:text-2xl">{VEHICLES.length}</dd>
            </div>
            <div>
              <dt className="text-xs text-brand-100">{t("hero.stat.brands")}</dt>
              <dd className="text-xl font-extrabold sm:text-2xl">{brandCount}</dd>
            </div>
            <div>
              <dt className="text-xs text-brand-100">{t("hero.stat.reply")}</dt>
              <dd className="text-xl font-extrabold sm:text-2xl">{t("hero.stat.replyValue")}</dd>
            </div>
          </dl>
        </div>
      </section>

      <TrustBar />

      <section className="container-x pt-14">
        <SectionHead title={t("home.bodies")} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {BODIES.map((b) => {
            const list = CARS.filter((c) => c.body === b);
            const sample = list.find((c) => c.featured) ?? list[0];
            if (!sample) return null;
            return (
              <Link key={b} href={`/voitures?body=${b}`} className="group card overflow-hidden transition hover:border-brand-700 hover:shadow-lg">
                <div className="aspect-[3/2] overflow-hidden bg-brand-50">
                  <img src={sample.photos[0].thumb} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="flex items-center justify-between px-3 py-2.5">
                  <span className="text-sm font-bold">{t(`body.${b}`)}</span>
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-800">{list.length}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="container-x pt-16">
          <SectionHead title={t("home.featured")} sub={t("home.featuredSub")} href="/voitures" />
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {featured.slice(0, 8).map((c, i) => (
              <div key={c.slug} className="w-[80vw] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none">
                <CarCard car={c} eager={i < 4} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="container-x pt-16">
        <SectionHead title={t("home.brands")} />
        <div className="flex flex-wrap gap-2">
          {brandList.map(({ make, count }) => (
            <Link key={make} href={`/voitures?make=${encodeURIComponent(make)}`} className="chip">
              {make} <span className="text-xs text-muted">{count}</span>
            </Link>
          ))}
        </div>
      </section>

      {MOTOS.length > 0 && (
        <section className="container-x pt-16">
          <SectionHead title={t("home.motos")} sub={t("home.motosSub")} href="/motos" />
          <div className="mb-5 flex flex-wrap gap-2">
            {MOTO_BODIES.filter((b) => MOTOS.some((c) => c.body === b)).map((b) => (
              <Link key={b} href={`/motos?body=${b}`} className="chip">
                {t(`body.${b}`)} <span className="text-xs text-muted">{MOTOS.filter((c) => c.body === b).length}</span>
              </Link>
            ))}
            <Link href="/motos?lic=A2" className="chip border-brand-700 text-brand-800">
              {t("filter.a2")}
            </Link>
          </div>
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {featuredMotos.slice(0, 8).map((c) => (
              <div key={c.slug} className="w-[80vw] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none">
                <CarCard car={c} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="container-x pt-16">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-line sm:p-10">
          <h2 className="section-title">{t("home.how")}</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Search, k: 1 },
              { Icon: MessageCircle, k: 2 },
              { Icon: HandCoins, k: 3 },
              { Icon: Ship, k: 4 },
            ].map(({ Icon, k }) => (
              <li key={k} className="relative">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-800 text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-4xl font-extrabold text-brand-100">0{k}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold">{t(`home.how.${k}.t` as "home.how.1.t")}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{t(`home.how.${k}.d` as "home.how.1.d")}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-x pt-16">
        <SectionHead title={t("home.latest")} href="/voitures?sort=yearDesc" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((c) => (
            <CarCard key={c.slug} car={c} />
          ))}
        </div>
      </section>

      <section className="container-x pt-16">
        <h2 className="section-title">{t("home.why")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: ShieldCheck, k: 1 },
            { Icon: FileText, k: 2 },
            { Icon: ThumbsUp, k: 3 },
            { Icon: Ship, k: 4 },
          ].map(({ Icon, k }) => (
            <div key={k} className="card p-5">
              <Icon className="h-7 w-7 text-accent-600" />
              <h3 className="mt-3 font-bold">{t(`home.why.${k}.t` as "home.why.1.t")}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{t(`home.why.${k}.d` as "home.why.1.d")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x pt-16">
        <div className="relative overflow-hidden rounded-3xl bg-brand-800 p-8 text-white sm:p-12">
          <div className="absolute -end-20 -top-20 h-72 w-72 rounded-full bg-accent-600/30 blur-3xl" />
          <div className="relative grid items-center gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="text-2xl font-extrabold sm:text-3xl">{t("home.cta.title")}</h2>
              <p className="mt-2 text-brand-100">{t("home.cta.text")}</p>
              <p className="mt-4 text-xs text-brand-100/80">{PORTS.slice(0, 8).join(" · ")}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <a href={whatsappLink(t("msg.general"))} target="_blank" rel="noopener" className="btn-whatsapp h-12 px-6 text-base">
                <WhatsAppIcon className="h-5 w-5" /> {t("home.cta.button")}
              </a>
              <Link href="/export" className="btn h-12 bg-white/10 px-6 text-base text-white ring-1 ring-white/30 hover:bg-white/20">
                {t("nav.export")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
