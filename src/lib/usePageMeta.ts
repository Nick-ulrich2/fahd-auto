import { createContext, useContext, useEffect } from "react";

/** Données d'en-tête collectées pendant le pré-rendu (build) pour écrire <title>, description, Open Graph… */
export interface HeadData {
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
}

export const HeadContext = createContext<HeadData | null>(null);

function setMeta(selector: string, attr: string, value: string) {
  const el = document.head.querySelector<HTMLMetaElement>(selector);
  if (el) el.setAttribute(attr, value);
}

/** Met à jour le titre, la description et l'image Open Graph de la page courante. */
export function usePageMeta(title: string, description?: string, image?: string, noindex = false) {
  const ssr = useContext(HeadContext);
  if (ssr) Object.assign(ssr, { title, description, image, noindex });

  useEffect(() => {
    document.title = title;
    setMeta('meta[property="og:title"]', "content", title);
    if (description) {
      setMeta('meta[name="description"]', "content", description);
      setMeta('meta[property="og:description"]', "content", description);
    }
    if (image) setMeta('meta[property="og:image"]', "content", image);
  }, [title, description, image]);
}
