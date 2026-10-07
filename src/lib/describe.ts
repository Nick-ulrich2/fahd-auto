import { HIGHLIGHT_FEATURES } from "../data/features";
import type { Car } from "../data/types";
import type { TKey } from "../i18n/fr";
import { formatMonth, formatNumber } from "./format";

type T = (key: TKey, vars?: Record<string, string | number>) => string;

export function engineLabel(car: Car, t: T, locale: string) {
  if (car.fuel === "electric") return `${t("fuel.electric")} ${formatNumber(car.engine.batteryKwh ?? 0, locale, 0)} ${t("unit.kwh")}`;
  if (car.kind === "moto") return `${formatNumber(car.engine.displacement, locale)} ${t("unit.cc")} ${t(`layout.${car.engine.layout}` as TKey)}`;
  const liters = formatNumber(car.engine.displacement / 1000, locale, 1);
  return `${liters} ${car.engine.layout} ${t(`fuel.${car.fuel}`).toLowerCase()}`;
}

export function gearboxLabel(car: Car, t: T) {
  if (car.gears) return t("spec.gears", { n: car.gears });
  return car.kind === "car" && (car.fuel === "hybrid" || car.fuel === "phev") ? "e-CVT" : "CVT";
}

/** Description complète générée à partir des données, dans la langue courante. */
export function describe(car: Car, t: T, locale: string): string[] {
  const owners = car.owners <= 1 ? t("desc.owner1") : t("desc.ownerN", { n: car.owners });
  // Minuscule sur la 1re lettre seulement, en préservant les sigles (ABS, GPS, LED…).
  const lower = (k: TKey) => {
    const s = t(k);
    return /^.[A-Z]/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1);
  };
  const common = {
    car: `${car.make} ${car.model} ${car.trim}`,
    year: car.year,
    mileage: `${formatNumber(car.mileage, locale)} ${t("unit.km")}`,
    reg: formatMonth(car.firstRegistration, locale),
    owners,
    engine: engineLabel(car, t, locale),
    hp: car.engine.powerHp,
    gearbox: `${lower(`transmission.${car.transmission}`)} (${gearboxLabel(car, t)})`,
    drive: lower(`drivetrain.${car.drivetrain}`),
  };
  const service = t(car.serviceHistory ? "desc.serviceFull" : "desc.servicePartial");
  const accident = t(car.accidentFree ? "desc.accidentFree" : "desc.accident");
  const color = car.colorExtName || lower(`color.${car.colorExt}`);

  let intro: string;
  let condition: string;
  if (car.kind === "moto" && car.moto) {
    const isNew = car.condition === "new";
    const looks = { color, seat: car.moto.seatHeight, weight: car.weight, tank: formatNumber(car.tank, locale, car.tank % 1 ? 1 : 0) };
    intro = t(isNew ? "desc.motoIntroNew" : "desc.motoIntro", {
      ...common,
      nm: car.engine.torqueNm,
      licence: t(`licence.${car.moto.licence}`),
    });
    condition = isNew ? t("desc.motoConditionNew", looks) : t("desc.motoCondition", { service, accident, ...looks });
    if (car.payload) condition += ` ${t("desc.payload", { payload: formatNumber(car.payload, locale) })}`;
  } else {
    intro = t("desc.intro", common);
    condition = t("desc.condition", {
      service,
      accident,
      color,
      colorInt: lower(`color.${car.colorInt}`),
      upholstery: lower(`upholstery.${car.upholstery}`),
      wheels: car.wheelsInch,
      carpass: car.carPass ? t("desc.carPass") : "",
    });
  }
  const highlights = HIGHLIGHT_FEATURES.filter((f) => car.features.includes(f))
    .slice(0, 7)
    .map((f) => lower(`feature.${f}` as TKey));
  const equipment = highlights.length ? t("desc.equipment", { list: highlights.join(locale === "ar" ? "، " : ", ") }) : "";
  const outro = t("desc.outro", { keys: car.keys, coc: car.coc ? t("desc.coc") : "" });
  return [intro, condition, equipment, outro].filter(Boolean);
}
