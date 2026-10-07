import { ArrowRight, BadgeCheck, Camera, FileText, Landmark, ShieldCheck, Truck } from "lucide-react";
import { Link } from "wouter";
import { SITE } from "../config";
import { useI18n } from "../i18n/I18nContext";

const ITEMS = [
  { Icon: FileText, k: "trust.1" },
  { Icon: Landmark, k: "trust.2" },
  { Icon: Camera, k: "trust.3" },
  { Icon: Truck, k: "trust.4" },
] as const;

/** Bandeau de confiance (accueil). */
export function TrustBar() {
  const { t } = useI18n();
  return (
    <section className="border-b border-line bg-white">
      <div className="container-x grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-[repeat(4,1fr)_auto] lg:items-center">
        {ITEMS.map(({ Icon, k }) => (
          <div key={k} className="flex items-center gap-3 text-sm font-semibold">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-800">
              <Icon className="h-5 w-5" />
            </span>
            {t(k)}
          </div>
        ))}
        <Link href="/comment-ca-marche" className="flex items-center gap-1 text-sm font-bold text-brand-800 hover:underline">
          {t("how.link")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    </section>
  );
}

/** Encadré « Achat sécurisé » (fiche véhicule). */
export function SecureBox() {
  const { t } = useI18n();
  return (
    <div className="card p-5">
      <h3 className="flex items-center gap-2 font-bold">
        <ShieldCheck className="h-5 w-5 text-brand-700" /> {t("trust.boxTitle")}
      </h3>
      <ul className="mt-3 space-y-2 text-sm">
        {ITEMS.slice(0, 3).map(({ k }) => (
          <li key={k} className="flex gap-2">
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" /> {t(k)}
          </li>
        ))}
      </ul>
      <p className="mt-3 rounded-lg bg-canvas p-2.5 text-xs text-muted" dir="auto">
        {t("trust.official", { phone: SITE.phoneDisplay })}
      </p>
      <Link href="/comment-ca-marche" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-brand-800 hover:underline">
        {t("how.link")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
      </Link>
    </div>
  );
}
