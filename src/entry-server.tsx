/** Point d'entrée du pré-rendu (build) : génère le HTML de chaque page pour les moteurs de recherche. */
import { renderToString } from "react-dom/server";
import App from "./App";
import type { Lang } from "./i18n/I18nContext";
import { HeadContext, type HeadData } from "./lib/usePageMeta";

export { STATIC_ROUTES } from "./App";
export { VEHICLES, vehiclePath } from "./data/catalog";

export function render(path: string, lang: Lang) {
  const head: HeadData = {};
  const html = renderToString(
    <HeadContext.Provider value={head}>
      <App lang={lang} ssrPath={path} ssrSearch="" />
    </HeadContext.Provider>,
  );
  return { html, head };
}
