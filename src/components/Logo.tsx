import { Link } from "wouter";
import { SITE } from "../config";

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${SITE.name} — ${SITE.tagline}`}>
      <span className={`grid h-11 w-11 place-items-center rounded-xl ${light ? "bg-white" : "bg-white ring-1 ring-line"}`}>
        <img src="/brand/emblem.png" alt="" width={40} height={37} className="h-9 w-auto" />
      </span>
      {!compact && (
        <span className="leading-none" dir="ltr">
          <span className={`block text-lg font-extrabold tracking-tight ${light ? "text-white" : "text-brand-800"}`}>
            FAHD <span className={light ? "text-white" : "text-accent-600"}>AUTO</span>
          </span>
          <span className={`mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.14em] ${light ? "text-brand-100" : "text-muted"}`}>
            {SITE.tagline}
          </span>
        </span>
      )}
    </Link>
  );
}
