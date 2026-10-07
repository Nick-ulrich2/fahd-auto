import { Boxes } from "lucide-react";
import { useState } from "react";
import type { Car } from "../data/types";
import { useI18n } from "../i18n/I18nContext";
import { carUrl, whatsappLink } from "../lib/contact";
import { carFullTitle } from "../lib/format";
import { WhatsAppIcon } from "./icons";

/** Demande de prix pour plusieurs unités (revendeurs, flottes de motos-taxis, tricycles). */
export function LotQuote({ car }: { car: Car }) {
  const { t } = useI18n();
  const [qty, setQty] = useState(5);
  const msg = t("lot.msg", { qty, car: `${carFullTitle(car)} (${t("car.ref")} ${car.ref})`, link: carUrl(car) });
  return (
    <div className="card p-5">
      <h3 className="flex items-center gap-2 font-bold">
        <Boxes className="h-5 w-5 text-brand-700" /> {t("lot.title")}
      </h3>
      <p className="mt-1 text-sm text-muted">{t("lot.text")}</p>
      <div className="mt-3 flex items-end gap-2">
        <label className="block w-24 text-sm font-medium">
          {t("lot.qty")}
          <input
            type="number"
            min={2}
            value={qty}
            onChange={(e) => setQty(Math.max(2, Number(e.target.value) || 2))}
            className="field mt-1"
            dir="ltr"
          />
        </label>
        <a href={whatsappLink(msg)} target="_blank" rel="noopener" className="btn-whatsapp flex-1">
          <WhatsAppIcon className="h-4 w-4" /> {t("lot.cta")}
        </a>
      </div>
    </div>
  );
}
