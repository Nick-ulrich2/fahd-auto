import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const MAX_COMPARE = 3;

interface Saved {
  favorites: string[];
  compare: string[];
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (slug: string) => void;
  inCompare: (slug: string) => boolean;
  /** Renvoie false si la limite de comparaison est atteinte. */
  toggleCompare: (slug: string) => boolean;
  clearCompare: () => void;
}

const Ctx = createContext<Saved | null>(null);

function load(key: string): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function usePersisted(key: string) {
  const [list, setList] = useState<string[]>(() => load(key));
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch {
      /* stockage indisponible */
    }
  }, [key, list]);
  return [list, setList] as const;
}

export function SavedProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = usePersisted("fahd-favorites");
  const [compare, setCompare] = usePersisted("fahd-compare");

  const toggleFavorite = useCallback(
    (slug: string) => setFavorites((l) => (l.includes(slug) ? l.filter((s) => s !== slug) : [...l, slug])),
    [setFavorites],
  );
  const toggleCompare = useCallback(
    (slug: string) => {
      if (compare.includes(slug)) {
        setCompare(compare.filter((s) => s !== slug));
        return true;
      }
      if (compare.length >= MAX_COMPARE) return false;
      setCompare([...compare, slug]);
      return true;
    },
    [compare, setCompare],
  );

  const value = useMemo<Saved>(
    () => ({
      favorites,
      compare,
      isFavorite: (s) => favorites.includes(s),
      toggleFavorite,
      inCompare: (s) => compare.includes(s),
      toggleCompare,
      clearCompare: () => setCompare([]),
    }),
    [favorites, compare, toggleFavorite, toggleCompare, setCompare],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSaved() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSaved must be used inside SavedProvider");
  return ctx;
}
