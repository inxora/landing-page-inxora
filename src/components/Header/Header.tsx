import React, { useEffect, useState, useRef } from "react";
import { Menu, X, Globe } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { headerTranslations } from './headerTranslations';
import { Helmet } from 'react-helmet';
import { getRouteByLang, getRouteKeyByPath } from '../types/routes';
import Loader from "../Loader";

// ============ CONSTANTS ============
const LANGUAGE_OPTIONS = [
  { value: 'es', label: 'Español', code: 'ES' },
  { value: 'en', label: 'English', code: 'EN' },
  { value: 'pt', label: 'Português', code: 'PT' },
] as const;

const WHATSAPP_URL = "https://wa.me/946885531?text=Hola%2C%20estoy%20interesado%20en%20cotizar%20productos%20industriales";

const GEOIP_COUNTRIES = {
  PORTUGUESE: ["BR"],
  ENGLISH: ["US", "GB", "CA", "AU", "IE", "NZ", "ZA"],
} as const;

const NAVIGATION_ITEMS = [
  { key: 'how-it-works', sectionId: 'comoFunciona', label: 'comoFunciona' as const },
  { key: 'products', sectionId: 'productos', label: 'productos' as const },
  { key: 'clients', sectionId: 'beneficios', label: 'clientes' as const },
  { key: 'providers', sectionId: 'proveedores', label: 'proveedores' as const },
];

// ============ INTERFACES ============
interface NavigationItem {
  key: string;
  sectionId: string;
  label: keyof typeof headerTranslations.es;
}

// ============ UTILITIES ============
const scrollToSection = (id: string): void => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// ============ MAIN COMPONENT ============
export const Header: React.FC = () => {
  // ============ STATE ============
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // ============ REFS ============
  const langMenuRef = useRef<HTMLDivElement>(null);

  // ============ HOOKS ============
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();
  const t = headerTranslations[lang];

  // ============ DERIVED STATE ============ 
  const isProvidersForm = location.pathname.includes('formulario-proveedores') || 
                         location.pathname.includes('provider-form') || 
                         location.pathname.includes('formulario-fornecedores');

  // ============ EFFECTS ============
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const hasVisited = window.sessionStorage.getItem("inxora_visited");
    if (!hasVisited) {
      setShowLoader(true);
      window.sessionStorage.setItem("inxora_visited", "true");
      const timer = setTimeout(() => setShowLoader(false), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const hasSelectedLang = window.localStorage.getItem("inxora_lang_selected");
    if (hasSelectedLang || showLoader) return;

    const detectLanguageByLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();

        if (!data?.country_code) return;

        if (GEOIP_COUNTRIES.PORTUGUESE.includes(data.country_code) && lang !== "pt") {
          setLang("pt");
        } else if (GEOIP_COUNTRIES.ENGLISH.includes(data.country_code) && lang !== "en") {
          setLang("en");
        }
      } catch (error) {
        console.warn('Error detecting location for language:', error);
      }
    };

    detectLanguageByLocation();
  }, [showLoader, lang, setLang]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };

    if (langMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [langMenuOpen]);

  // ============ HANDLERS ============
  const handleLogoClick = (): void => {
    if (location.pathname !== "/") {
      navigate("/");
      window.history.replaceState(null, '', '/');
    } else if (window.location.hash) {
      window.history.replaceState(null, '', '/');
    }
  };

  const handleLanguageChange = (selectedLang: string): void => {
    if (lang === selectedLang) return;

    const routeKey = getRouteKeyByPath(location.pathname);
    if (routeKey) {
      navigate(getRouteByLang(routeKey, selectedLang as any));
    }

    setLang(selectedLang as any);
    window.localStorage.setItem("inxora_lang_selected", "true");
    setLangMenuOpen(false);
  };

  const navigateToSection = (sectionId: string): void => {
    const isHomePage = location.pathname === '/' || location.pathname === getRouteByLang('home', lang);

    if (isHomePage) {
      scrollToSection(sectionId);
    } else {
      navigate(getRouteByLang('home', lang));
      setTimeout(() => scrollToSection(sectionId), 400);
    }

    setIsMenuOpen(false);
  };

  const toggleMobileMenu = (): void => {
    setIsMenuOpen(prev => !prev);
  };

  const toggleLanguageMenu = (): void => {
    setLangMenuOpen(prev => !prev);
  };

  // ============ RENDER HELPERS ============
  const renderLogo = () => (
    <div className="flex items-center pl-2 sm:pl-4 md:pl-6 lg:pl-8 flex-shrink-0">
      <button
        onClick={handleLogoClick}
        className={`focus:outline-none ${
          location.pathname !== '/' ? 'cursor-pointer' : 'cursor-default'
        }`}
        aria-label="Ir al inicio"
      >
        <img
          src={(isScrolled || isMenuOpen) ? "/logo_inxora/LOGO-35.png" : "/logo_inxora/LOGO-30.png"}
          alt="INXORA - Marketplace de suministros industriales"
          className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto transition-transform duration-200 hover:scale-105"
        />
      </button>
    </div>
  );

  const renderDesktopNavigation = () => (
    <nav className="hidden lg:flex flex-1 items-center justify-start ml-8 xl:ml-12 2xl:ml-16">
      <ul className="flex items-center space-x-6 xl:space-x-8 2xl:space-x-12">
        {NAVIGATION_ITEMS.map((item) => (
          <li key={item.key}>
            <button
              onClick={() => navigateToSection(item.sectionId)}
              onMouseDown={(e) => e.preventDefault()}
              onBlur={(e) => e.currentTarget.blur()}
              className={`font-bold text-lg xl:text-xl 2xl:text-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 rounded-md px-3 py-2 ${
                isScrolled
                  ? 'text-primary hover:text-primary-dark focus-visible:ring-[var(--color-primary)]'
                  : 'text-white hover:text-primary-light focus-visible:ring-[var(--color-primary-light)] font-extrabold'
              }`}
              style={!isScrolled ? {
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.3)'
              } : {}}
            >
              {t[item.label]}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  const renderLanguageSelector = () => (
  <div className="relative flex items-center" ref={langMenuRef}>
    <button
      className={`header-button flex items-center gap-2 px-3 py-2 h-10 sm:h-12 min-w-[70px] sm:min-w-[80px] 
                 rounded-md font-extrabold text-sm sm:text-base lg:text-lg transition-all duration-300 
                 focus:outline-none focus-visible:ring-2 border-2 bg-transparent hover:bg-[#88D4E4]/20 ${
                   (isScrolled || isMenuOpen)
                     ? 'border-primary text-primary hover:text-primary focus-visible:ring-[var(--color-primary)]'
                     : 'border-white text-white hover:text-white focus-visible:ring-white font-extrabold'
                 }`}
      style={!isScrolled ? {
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
      } : {}}
      onClick={toggleLanguageMenu}
      onMouseDown={(e) => e.preventDefault()}
      onBlur={(e) => {
        setTimeout(() => {
          if (!langMenuRef.current?.contains(document.activeElement)) {
            setLangMenuOpen(false);
          }
        }, 0);
      }}
      aria-haspopup="listbox"
      aria-expanded={langMenuOpen}
      aria-label="Seleccionar idioma"
    >
      <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
      <span className="font-mono text-xs sm:text-sm lg:text-base font-bold">{lang.toUpperCase()}</span>
    </button>

    {langMenuOpen && (
      <div className={`absolute right-0 top-full mt-2 w-36 sm:w-40 lg:w-44 border-2 
                      rounded-lg shadow-xl z-50 animate-fade-in overflow-hidden bg-white ${
                        (isScrolled || isMenuOpen)
                          ? 'border-primary' 
                          : 'border-white'
                      }`}>
        <ul className="py-1" role="listbox">
          {LANGUAGE_OPTIONS.map((option) => (
            <li key={option.value}>
              <button
                className={`header-dropdown-item w-full flex items-center justify-between px-3 py-2 text-left
                           hover:bg-[#88D4E4]/20 text-primary text-sm lg:text-base transition-colors
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-primary)]
                           ${lang === option.value ? 'font-bold bg-[#88D4E4]/10' : 'font-medium'}`}
                onClick={() => handleLanguageChange(option.value)}
                onMouseDown={(e) => e.preventDefault()}
                role="option"
                aria-selected={lang === option.value}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-primary font-bold w-6">
                    {option.code}
                  </span>
                  <span className="text-primary">{option.label}</span>
                </div>
                {lang === option.value && <span className="text-[#139ED4] font-bold">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

  const renderCTAButton = () => (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onMouseDown={(e) => e.preventDefault()}
      className={`hidden xl:flex font-orbitron px-4 py-2 h-10 lg:px-6 lg:py-3 lg:h-12 min-w-[140px] lg:min-w-[180px] 
                 rounded-md font-extrabold text-sm lg:text-base transition-all duration-300 
                 hover:shadow-xl hover:scale-105 items-center gap-2 justify-center
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                   isScrolled
                     ? 'bg-primary hover:bg-[var(--color-primary-dark)] text-white shadow-sm hover:shadow-md focus-visible:ring-[var(--color-primary)]'
                     : 'bg-white bg-opacity-90 hover:bg-white hover:bg-opacity-100 text-primary hover:text-primary-dark shadow-lg focus-visible:ring-white font-extrabold border-2 border-white'
                 }`}
      style={!isScrolled ? {
        textShadow: 'none'
      } : {}}
      aria-label="Solicitar cotización por WhatsApp"
    >
      <img
        src="/logo_inxora/LOGO-22.png"
        alt=""
        className="w-4 h-4 lg:w-5 lg:h-5 object-contain"
        aria-hidden="true"
      />
      <span className="truncate">{t.solicitarCotizacion}</span>
    </a>
  );

  const renderMobileMenuButton = () => (
    <button
      onClick={toggleMobileMenu}
      onMouseDown={(e) => e.preventDefault()}
      aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
      className={`lg:hidden p-2 transition-colors focus:outline-none rounded-md ${
        isScrolled
          ? 'text-primary hover:text-primary-dark focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]'
          : 'text-white hover:text-primary-light focus-visible:ring-2 focus-visible:ring-white font-extrabold'
      }`}
      style={!isScrolled ? {
        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))'
      } : {}}
    >
      {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
    </button>
  );

  const renderMobileMenu = () => (
    <div className="lg:hidden bg-white border-t-2 border-primary w-full shadow-xl mobile-menu">
      <nav className="px-4 py-6 bg-white">
        <ul className="flex flex-col space-y-4">
          {NAVIGATION_ITEMS.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => navigateToSection(item.sectionId)}
                onMouseDown={(e) => e.preventDefault()}
                className="w-full text-left text-primary hover:text-primary-dark font-bold text-lg
                           py-4 px-3 transition-colors rounded-md hover:bg-[#f0f9ff]
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                {t[item.label]}
              </button>
            </li>
          ))}
          <li className="pt-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onMouseDown={(e) => e.preventDefault()}
              className="w-full font-orbitron bg-primary hover:bg-[var(--color-primary-dark)] text-white 
                         px-4 py-4 rounded-md font-bold text-base transition-all duration-200 
                         shadow-md hover:shadow-lg flex items-center gap-2 justify-center
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
            >
              <img
                src="/logo_inxora/LOGO-22.png"
                alt=""
                className="w-4 h-4 object-contain"
                aria-hidden="true"
              />
              {t.solicitarCotizacion}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );

  // ============ MAIN RENDER ============
  return (
    <>
      {showLoader && <Loader />}

      <Helmet>
        <html lang={lang} />
        <title>{`INXORA - ${t.soluciones}, ${t.productos}, ${t.proveedores}`}</title>
        <meta
          name="description"
          content={
            lang === 'es' ? 'Marketplace de suministros industriales. Cotiza rápido, fácil y seguro.' :
              lang === 'en' ? 'Industrial supplies marketplace. Get a quote quickly, easily and safely.' :
                'Marketplace de suprimentos industriais. Cotação rápida, fácil e segura.'
          }
        />
        <link rel="alternate" hrefLang="es" href="https://inxora.com/" />
        <link rel="alternate" hrefLang="en" href="https://inxora.com/en" />
        <link rel="alternate" hrefLang="pt" href="https://inxora.com/pt" />
      </Helmet>

      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          (isScrolled || isMenuOpen)
            ? 'bg-white shadow-sm border-b-2 border-primary scrolled'
            : isProvidersForm
              ? 'bg-white shadow-sm border-b-2 border-primary scrolled'
              : 'bg-[#13A0D8]'
        }`}
      >
        <div className="w-full py-1.5 sm:py-2 md:py-2.5 flex items-center justify-between max-w-none border-b border-white/30 px-2 sm:px-4 md:px-6 lg:px-8">
          {renderLogo()}
          {renderDesktopNavigation()}

          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 ml-auto pr-2 sm:pr-4 md:pr-6 lg:pr-8">
            {renderLanguageSelector()}
            {renderCTAButton()}
            {renderMobileMenuButton()}
          </div>
        </div>

        {isMenuOpen && renderMobileMenu()}
      </header>
    </>
  );
};
