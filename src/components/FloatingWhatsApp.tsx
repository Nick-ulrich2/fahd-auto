import { useLocation } from "wouter";
import { useI18n } from "../i18n/I18nContext";
import { whatsappLink } from "../lib/contact";
import { useSaved } from "../contexts/SavedContext";
import { WhatsAppIcon } from "./icons";

export function FloatingWhatsApp() {
  const { t } = useI18n();
  const { compare } = useSaved();
  const [location] = useLocation();
  const onCarPage = location.startsWith("/voiture/") || location.startsWith("/moto/");
  return (
    <a
      href={whatsappLink(t("msg.general"))}
      target="_blank"
      rel="noopener"
      aria-label="WhatsApp"
      className={`fixed end-4 z-40 ${onCarPage ? "hidden lg:grid" : "grid"} h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-lg shadow-black/20 transition hover:scale-105 hover:bg-whatsapp-dark ${
        compare.length ? "bottom-24" : "bottom-5"
      }`}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
