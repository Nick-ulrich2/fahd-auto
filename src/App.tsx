import { useEffect } from "react";
import { Route, Router, Switch, useLocation } from "wouter";
import { Analytics } from "./components/Analytics";
import { CompareBar } from "./components/CompareBar";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { OrganizationJsonLd } from "./components/JsonLd";
import { ToastProvider } from "./components/Toast";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { SavedProvider } from "./contexts/SavedContext";
import { I18nProvider, langBase, type Lang } from "./i18n/I18nContext";
import CarDetail from "./pages/CarDetail";
import Compare from "./pages/Compare";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import { ContactPage, CreditsPage, ExportPage } from "./pages/InfoPages";
import { LegalPage, PrivacyPage, TermsPage } from "./pages/LegalPages";
import Listing from "./pages/Listing";
import NotFound from "./pages/NotFound";
import SourcingPage from "./pages/SourcingPage";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [location]);
  return null;
}

/** Routes de l'application (identiques dans chaque langue : /, /en, /ar). */
export const STATIC_ROUTES = [
  "/", "/voitures", "/motos", "/comment-ca-marche", "/recherche-vehicule", "/export", "/contact", "/credits",
  "/mentions-legales", "/confidentialite", "/conditions",
];

export default function App({ lang, ssrPath, ssrSearch }: { lang: Lang; ssrPath?: string; ssrSearch?: string }) {
  return (
    <I18nProvider lang={lang}>
      <CurrencyProvider>
        <SavedProvider>
          <ToastProvider>
            <Router base={langBase(lang)} ssrPath={ssrPath} ssrSearch={ssrSearch}>
              <ScrollToTop />
              <Header />
              <main id="main" className="min-h-[60vh]">
                <Switch>
                  <Route path="/" component={Home} />
                  <Route path="/voitures">{() => <Listing kind="car" />}</Route>
                  <Route path="/motos">{() => <Listing kind="moto" />}</Route>
                  <Route path="/voiture/:slug">{(p) => <CarDetail slug={p.slug} kind="car" />}</Route>
                  <Route path="/moto/:slug">{(p) => <CarDetail slug={p.slug} kind="moto" />}</Route>
                  <Route path="/comment-ca-marche" component={HowItWorks} />
                  <Route path="/recherche-vehicule" component={SourcingPage} />
                  <Route path="/favoris" component={Favorites} />
                  <Route path="/comparer" component={Compare} />
                  <Route path="/export" component={ExportPage} />
                  <Route path="/contact" component={ContactPage} />
                  <Route path="/credits" component={CreditsPage} />
                  <Route path="/mentions-legales" component={LegalPage} />
                  <Route path="/confidentialite" component={PrivacyPage} />
                  <Route path="/conditions" component={TermsPage} />
                  <Route>
                    <NotFound />
                  </Route>
                </Switch>
              </main>
              <Footer />
              <CompareBar />
              <FloatingWhatsApp />
              <Analytics />
              <OrganizationJsonLd />
            </Router>
          </ToastProvider>
        </SavedProvider>
      </CurrencyProvider>
    </I18nProvider>
  );
}
