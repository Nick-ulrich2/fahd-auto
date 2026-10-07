import { X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useSaved } from "../contexts/SavedContext";
import { getCar } from "../data/catalog";
import { useI18n } from "../i18n/I18nContext";

export function CompareBar() {
  const { t } = useI18n();
  const { compare, toggleCompare, clearCompare } = useSaved();
  const [location] = useLocation();
  if (!compare.length || location === "/comparer") return null;
  const cars = compare.map((s) => getCar(s)).filter((c) => c !== undefined);
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur">
      <div className="container-x flex items-center gap-3 py-3">
        <p className="hidden text-sm font-semibold sm:block">{t("compare.bar", { n: compare.length })}</p>
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto scrollbar-none">
          {cars.map((c) => (
            <span key={c.slug} className="flex shrink-0 items-center gap-2 rounded-lg border border-line bg-canvas py-1 ps-1 pe-2 text-xs font-medium">
              <img src={c.photos[0]?.thumb} alt="" className="h-8 w-11 rounded object-cover" />
              <span dir="ltr">
                {c.make} {c.model}
              </span>
              <button type="button" onClick={() => toggleCompare(c.slug)} aria-label={t("compare.remove")} className="text-muted hover:text-accent-600">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
        <button type="button" onClick={clearCompare} className="text-sm font-medium text-muted hover:text-ink">
          {t("compare.clear")}
        </button>
        <Link href="/comparer" className="btn-primary">
          {t("compare.go")}
        </Link>
      </div>
    </div>
  );
}
