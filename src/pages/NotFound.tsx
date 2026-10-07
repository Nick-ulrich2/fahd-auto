import { Link } from "wouter";
import { useI18n } from "../i18n/I18nContext";
import { usePageMeta } from "../lib/usePageMeta";

export default function NotFound({ message }: { message?: string }) {
  const { t } = useI18n();
  usePageMeta(`${t("notFound.title")} — Fahd Auto`);
  return (
    <div className="container-x flex flex-col items-center py-24 text-center">
      <img src="/brand/emblem.png" alt="" className="h-24 w-auto opacity-90" />
      <h1 className="mt-6 text-3xl font-extrabold">{t("notFound.title")}</h1>
      <p className="mt-2 max-w-md text-muted">{message ?? t("notFound.text")}</p>
      <Link href="/voitures" className="btn-primary mt-6">
        {t("car.backToList")}
      </Link>
    </div>
  );
}
