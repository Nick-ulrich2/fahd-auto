/** Données structurées schema.org (JSON-LD) : elles aident Google à comprendre et mettre en valeur les pages. */
import { SITE } from "../config";
import { vehiclePath } from "../data/catalog";
import type { Car } from "../data/types";
import { langBase, useI18n } from "../i18n/I18nContext";

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** URL absolue (si VITE_SITE_URL est défini), sinon chemin relatif. */
export function absUrl(path: string) {
  return `${SITE.url}${path}`;
}

export function OrganizationJsonLd() {
  const { lang, t } = useI18n();
  const home = absUrl(langBase(lang) || "/");
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "AutoDealer",
            "@id": absUrl("/#dealer"),
            name: SITE.name,
            alternateName: SITE.tagline,
            url: home,
            logo: absUrl("/brand/icon-512.png"),
            image: absUrl("/brand/banner.jpg"),
            telephone: `+${SITE.whatsapp}`,
            email: SITE.email,
            description: t("meta.description"),
            areaServed: ["Africa", "Europe", "Middle East"],
            availableLanguage: ["fr", "en", "ar"],
            contactPoint: {
              "@type": "ContactPoint",
              telephone: `+${SITE.whatsapp}`,
              email: SITE.email,
              contactType: "sales",
              availableLanguage: ["French", "English", "Arabic"],
            },
          },
          {
            "@type": "WebSite",
            "@id": absUrl("/#website"),
            name: SITE.name,
            url: home,
            inLanguage: lang,
            publisher: { "@id": absUrl("/#dealer") },
            potentialAction: {
              "@type": "SearchAction",
              target: `${absUrl(langBase(lang))}/voitures?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
        ],
      }}
    />
  );
}

export function VehicleJsonLd({ car, description }: { car: Car; description: string }) {
  const { lang } = useI18n();
  const url = absUrl(`${langBase(lang)}${vehiclePath(car)}`);
  const availability =
    car.status === "sold" ? "https://schema.org/SoldOut" : car.status === "reserved" ? "https://schema.org/LimitedAvailability" : "https://schema.org/InStock";
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": car.kind === "moto" ? "Motorcycle" : "Car",
        name: `${car.make} ${car.model} ${car.trim} ${car.year}`,
        brand: { "@type": "Brand", name: car.make },
        model: car.model,
        vehicleConfiguration: car.trim,
        modelDate: String(car.year),
        productionDate: String(car.year),
        sku: car.ref,
        url,
        image: car.photos.map((p) => absUrl(p.src)),
        description,
        color: car.colorExt,
        fuelType: car.fuel,
        vehicleTransmission: car.transmission,
        numberOfDoors: car.kind === "car" ? car.doors : undefined,
        seatingCapacity: car.seats,
        itemCondition: car.condition === "new" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
        mileageFromOdometer: { "@type": "QuantitativeValue", value: car.mileage, unitCode: "KMT" },
        vehicleEngine: {
          "@type": "EngineSpecification",
          engineDisplacement: { "@type": "QuantitativeValue", value: car.engine.displacement, unitCode: "CMQ" },
          enginePower: { "@type": "QuantitativeValue", value: car.engine.powerHp, unitCode: "BHP" },
        },
        offers: {
          "@type": "Offer",
          price: car.priceFrom,
          priceCurrency: "EUR",
          availability,
          url,
          seller: { "@id": absUrl("/#dealer") },
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; path: string }[] }) {
  const { lang } = useI18n();
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          item: absUrl(`${langBase(lang)}${it.path === "/" && lang !== "fr" ? "" : it.path}`),
        })),
      }}
    />
  );
}

export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((it) => ({ "@type": "Question", name: it.q, acceptedAnswer: { "@type": "Answer", text: it.a } })),
      }}
    />
  );
}
