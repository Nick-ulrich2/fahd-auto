import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Car } from "../data/types";
import { useI18n } from "../i18n/I18nContext";

export function Gallery({ car }: { car: Car }) {
  const { t, dir } = useI18n();
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(false);
  const n = car.photos.length;
  const go = useCallback((d: number) => setI((x) => (x + d + n) % n), [n]);
  const photo = car.photos[i];

  useEffect(() => {
    setI(0);
  }, [car.slug]);
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      if (e.key === "ArrowRight") go(dir === "rtl" ? -1 : 1);
      if (e.key === "ArrowLeft") go(dir === "rtl" ? 1 : -1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoom, go, dir]);

  if (!photo) return null;
  const Prev = dir === "rtl" ? ChevronRight : ChevronLeft;
  const Next = dir === "rtl" ? ChevronLeft : ChevronRight;
  const credit = t("car.photoCredit", { author: photo.author, license: photo.license });

  return (
    <section aria-label={t("car.gallery")}>
      <div className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-brand-50">
        <img src={photo.src} alt={`${car.make} ${car.model} — ${i + 1}/${n}`} className="h-full w-full object-cover" />
        <button
          type="button"
          onClick={() => setZoom(true)}
          className="absolute end-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow"
          aria-label={t("car.openGallery")}
        >
          <Expand className="h-4 w-4" />
        </button>
        {n > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label={t("car.prev")} className="absolute start-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow transition hover:bg-white">
              <Prev className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label={t("car.next")} className="absolute end-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow transition hover:bg-white">
              <Next className="h-5 w-5" />
            </button>
          </>
        )}
        <span className="ltr-nums absolute bottom-3 end-3 rounded-md bg-black/60 px-2 py-1 text-xs font-semibold text-white">
          {i + 1} / {n}
        </span>
      </div>
      <p className="mt-2 truncate text-[11px] text-muted" title={credit}>
        <a href={photo.source} target="_blank" rel="noopener" className="hover:underline">
          {credit}
        </a>
      </p>
      <div className="mt-2 grid grid-cols-5 gap-2">
        {car.photos.map((p, k) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setI(k)}
            className={`aspect-[4/3] overflow-hidden rounded-lg ring-2 transition ${k === i ? "ring-brand-700" : "ring-transparent opacity-80 hover:opacity-100"}`}
            aria-label={`${k + 1}/${n}`}
            aria-current={k === i}
          >
            <img src={p.thumb} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {zoom && (
        <div className="fixed inset-0 z-[80] flex flex-col bg-black/95" role="dialog" aria-modal="true" aria-label={t("car.gallery")}>
          <div className="flex items-center justify-between p-4 text-white">
            <span className="ltr-nums text-sm">
              {i + 1} / {n}
            </span>
            <button type="button" onClick={() => setZoom(false)} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label={t("nav.close")}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4" onClick={() => setZoom(false)}>
            <img src={photo.src} alt="" className="max-h-full max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
            {n > 1 && (
              <>
                <button type="button" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label={t("car.prev")} className="absolute start-4 grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25">
                  <Prev className="h-6 w-6" />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label={t("car.next")} className="absolute end-4 grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25">
                  <Next className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
          <p className="p-4 text-center text-xs text-white/60">{credit}</p>
        </div>
      )}
    </section>
  );
}
