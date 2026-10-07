/**
 * Pré-rendu (SEO) : après `vite build` (site) et `vite build --ssr` (rendu serveur), génère une page HTML complète
 * pour chaque route et chaque langue, avec <title>, description, canonical, hreflang, Open Graph,
 * puis sitemap.xml, robots.txt et 404.html.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const ssrDir = join(root, "dist-ssr");
const site = (process.env.VITE_SITE_URL || "").replace(/\/$/, "");

const { render, STATIC_ROUTES, VEHICLES, vehiclePath } = await import(pathToFileURL(join(ssrDir, "entry-server.js")).href);

const LANGS = ["fr", "en", "ar"];
const OG_LOCALE = { fr: "fr_FR", en: "en_GB", ar: "ar_AR" };
const base = (lang) => (lang === "fr" ? "" : `/${lang}`);
const url = (lang, route) => `${base(lang)}${route === "/" && lang !== "fr" ? "" : route}` || "/";
const abs = (p) => `${site}${p}`;
const esc = (s = "") => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const template = readFileSync(join(dist, "index.html"), "utf8");
// Le modèle sans les balises d'en-tête propres à une page (remplacées pour chaque page).
const bare = template
  .replace(/<title>[\s\S]*?<\/title>\s*/, "")
  .replace(/<meta\s+name="description"[\s\S]*?\/>\s*/, "")
  .replace(/<meta\s+property="og:(title|description|image|type|site_name)"[\s\S]*?\/>\s*/g, "");

const routes = [...STATIC_ROUTES, ...VEHICLES.map((v) => vehiclePath(v))];

let count = 0;
for (const lang of LANGS) {
  for (const route of routes) {
    const self = url(lang, route);
    const { html, head } = render(self, lang);
    const image = head.image ? abs(head.image) : abs("/brand/banner.jpg");
    const tags = [
      `<title>${esc(head.title || "Fahd Auto")}</title>`,
      head.description && `<meta name="description" content="${esc(head.description)}" />`,
      head.noindex && `<meta name="robots" content="noindex" />`,
      site && `<link rel="canonical" href="${abs(self)}" />`,
      ...(site ? LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${abs(url(l, route))}" />`) : []),
      site && `<link rel="alternate" hreflang="x-default" href="${abs(url("fr", route))}" />`,
      `<meta property="og:type" content="${route.startsWith("/voiture/") || route.startsWith("/moto/") ? "product" : "website"}" />`,
      `<meta property="og:site_name" content="Fahd Auto" />`,
      `<meta property="og:title" content="${esc(head.title)}" />`,
      head.description && `<meta property="og:description" content="${esc(head.description)}" />`,
      `<meta property="og:image" content="${esc(image)}" />`,
      site && `<meta property="og:url" content="${abs(self)}" />`,
      `<meta property="og:locale" content="${OG_LOCALE[lang]}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
    ]
      .filter(Boolean)
      .join("\n    ");
    const page = bare
      .replace(/<html[^>]*>/, `<html lang="${lang}" dir="${lang === "ar" ? "rtl" : "ltr"}">`)
      .replace("</head>", `    ${tags}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
    const out = join(dist, self === "/" ? "" : self, "index.html");
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, page);
    count++;
  }
}

// Page de secours pour les adresses non pré-rendues (favoris, comparateur, filtres…) : application seule, non indexée.
writeFileSync(join(dist, "404.html"), bare.replace("</head>", `    <title>Fahd Auto</title>\n    <meta name="robots" content="noindex" />\n  </head>`));

if (site) {
  const entries = routes
    .map((route) => {
      const alts = LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(url(l, route))}" />`).join("\n");
      return LANGS.map((l) => `  <url>\n    <loc>${abs(url(l, route))}</loc>\n${alts}\n  </url>`).join("\n");
    })
    .join("\n");
  writeFileSync(
    join(dist, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries}\n</urlset>\n`,
  );
  writeFileSync(join(dist, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /favoris\nDisallow: /comparer\nSitemap: ${site}/sitemap.xml\n`);
} else {
  writeFileSync(join(dist, "robots.txt"), "User-agent: *\nAllow: /\nDisallow: /favoris\nDisallow: /comparer\n");
  console.warn("⚠️  VITE_SITE_URL non défini : pas de sitemap ni d'URL canoniques. Définissez-le pour la mise en ligne.");
}

rmSync(ssrDir, { recursive: true, force: true });
console.log(`Pré-rendu : ${count} pages (${routes.length} adresses × ${LANGS.length} langues).`);
