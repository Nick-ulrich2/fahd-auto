import { Heart, Mail } from "lucide-react";
import { Link } from "wouter";
import { CarCard } from "../components/CarCard";
import { WhatsAppIcon } from "../components/icons";
import { useSaved } from "../contexts/SavedContext";
import { getCar } from "../data/catalog";
import { useI18n } from "../i18n/I18nContext";
import { emailLink, favoritesMessage, whatsappLink } from "../lib/contact";
import { usePageMeta } from "../lib/usePageMeta";

export default function Favorites() {
  const { t } = useI18n();
  const { favorites } = useSaved();
  usePageMeta(`${t("fav.title")} — Fahd Auto`);
  const cars = favorites.map((s) => getCar(s)).filter((c) => c !== undefined);
  const msg = favoritesMessage(cars, t);

  return (
    <div className="container-x py-8">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{t("fav.title")}</h1>
      {cars.length ? (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={whatsappLink(msg)} target="_blank" rel="noopener" className="btn-whatsapp">
              <WhatsAppIcon className="h-4 w-4" /> {t("fav.sendAll")}
            </a>
            <a href={emailLink(t("fav.sendAll"), msg)} className="btn-outline">
              <Mail className="h-4 w-4" /> {t("card.email")}
            </a>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cars.map((c) => (
              <CarCard key={c.slug} car={c} />
            ))}
          </div>
        </>
      ) : (
        <div className="card mt-6 flex flex-col items-center p-12 text-center">
          <Heart className="h-10 w-10 text-accent-600" />
          <p className="mt-4 max-w-md text-muted">{t("fav.empty")}</p>
          <Link href="/voitures" className="btn-primary mt-6">
            {t("nav.cars")}
          </Link>
        </div>
      )}
    </div>
  );
}
