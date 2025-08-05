import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header/Header';
import { HeroSection } from '@/components/Hero/HeroSection';
import { SolutionSection } from '@/components/Solution/SolutionSection';
import { ProductsSection } from '@/components/Products/ProductsSection';
import { PersuasionSection } from '@/components/Persuasion/PersuasionSection';
import { HowItWorksSection } from '@/components/HowItWorks/HowItWorksSection';
import { ProvidersSection } from '@/components/Providers/ProvidersSection';
import { CTASection } from '@/components/CTA/CTASection';
import { Footer } from '@/components/Footer/Footer';
import { ProveedorForm } from '@/components/Providers/ProvidersForm';
import { SaraXoraSection } from "@/components/Sara/SaraXoraSection";
import React, { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import {ReconocimientosSection} from '@/components/Reconocimientos/ReconocimientosSection';
import PrivacyPolicy from '@/components/Footer/enlaces/PoliticaPrivacidad/PrivacyPolicy';
import CookiesPolicy from '@/components/Footer/enlaces/Cookies/CookiesPolicy';
import TermsAndConditions from '@/components/Footer/enlaces/TerminosCondiciones/TermsAndConditions';
import LegalNotice from '@/components/Footer/enlaces/AvisoLegal/LegalNotice';
import ClaimsBook from '@/components/Footer/LibroReclamaciones/LibroReclamaciones';
import { LanguageProvider } from './context/LanguageContext';
import NotFound404 from '@/components/NotFound404';
import { routeSlugs } from '@/components/types/routes';
import { useLanguage } from './context/LanguageContext';
import { getRouteKeyByPath, getRouteByLang } from '@/components/types/routes';

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Volver arriba"
      className="fixed bottom-6 right-6 z-50 bg-[#139ED4] hover:bg-[#171D4C] text-white p-3 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#88D4E4]"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}

export function App() {
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Sincroniza idioma y ruta en cada navegación
  useEffect(() => {
    const routeKey = getRouteKeyByPath(location.pathname);
    if (routeKey && getRouteByLang(routeKey, lang) !== location.pathname) {
      navigate(getRouteByLang(routeKey, lang), { replace: true });
    }
  }, [lang, location.pathname, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-screen bg-white">
      {loading && <Loader />}
      <Header />
      <main>
        <Routes>
          <Route path={routeSlugs.home[lang]} element={
            <>
              <HeroSection />
              <SolutionSection />
              <HowItWorksSection />
              <ProductsSection />
              <PersuasionSection />
              <ProvidersSection />
              <SaraXoraSection />
              <ReconocimientosSection />
              <CTASection />
            </>
          } />
          <Route path={routeSlugs.providersForm[lang]} element={<ProveedorForm />} />
          <Route path={routeSlugs.privacy[lang]} element={<PrivacyPolicy />} />
          <Route path={routeSlugs.cookies[lang]} element={<CookiesPolicy />} />
          <Route path={routeSlugs.terms[lang]} element={<TermsAndConditions />} />
          <Route path={routeSlugs.legal[lang]} element={<LegalNotice />} />
          <Route path={routeSlugs.claims[lang]} element={<ClaimsBook />} />
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}