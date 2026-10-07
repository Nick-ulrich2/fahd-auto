import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { loadStockOverrides } from "./data/stockSheet";
import { langFromPath, pathForLang } from "./i18n/I18nContext";
import "./index.css";

// Compatibilité avec les anciens liens « ?lang=en » : redirection vers l'adresse de la langue (/en/…).
const params = new URLSearchParams(window.location.search);
const asked = params.get("lang");
if (asked === "fr" || asked === "en" || asked === "ar") {
  params.delete("lang");
  const qs = params.toString();
  window.location.replace(`${pathForLang(asked, window.location.pathname)}${qs ? `?${qs}` : ""}${window.location.hash}`);
} else {
  const lang = langFromPath(window.location.pathname);
  // Prix et statuts (réservé / vendu) éventuellement mis à jour depuis Google Sheets, sans bloquer plus de 2,5 s.
  loadStockOverrides().finally(() => {
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <App lang={lang} />
      </StrictMode>,
    );
  });
}
