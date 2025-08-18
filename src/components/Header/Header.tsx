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
    <div className="flex items-center pl-4 sm:pl-6 md:pl-8 lg:pl-12 flex-shrink-0">
      <button
        onClick={handleLogoClick}
        className={`focus:outline-none ${
          location.pathname !== '/' ? 'cursor-pointer' : 'cursor-default'
        }`}
        aria-label="Ir al inicio"
      >
        <img
          src="logo_inxora/LOGO-35.png"
          alt="INXORA - Marketplace de suministros industriales"
          className="h-16 sm:h-20 md:h-22 lg:h-24 w-auto transition-transform duration-200 hover:scale-105"
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
                  ? 'text-[#139ED4] dark:text-[#88D4E4] hover:text-[#171D4C] dark:hover:text-[#139ED4] focus-visible:ring-[#139ED4]'
                  : 'text-white hover:text-[#88D4E4] focus-visible:ring-[#88D4E4] font-extrabold'
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
        className={`flex items-center gap-2 px-3 py-2 h-10 sm:h-12 min-w-[70px] sm:min-w-[80px] 
                   rounded-md font-extrabold text-sm sm:text-base lg:text-lg transition-all duration-300 
                   focus:outline-none focus-visible:ring-2 ${
                     isScrolled
                       ? 'border border-[#139ED4] dark:border-[#88D4E4] bg-transparent text-[#139ED4] dark:text-[#88D4E4] hover:bg-[#171D4C] dark:hover:bg-[#139ED4] hover:text-white focus-visible:ring-[#139ED4]'
                       : 'border-2 border-white bg-transparent text-white hover:bg-white hover:bg-opacity-20 hover:text-[#88D4E4] focus-visible:ring-white font-extrabold'
                   }`}
        style={!isScrolled ? {
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
        } : {}}
        onClick={toggleLanguageMenu}
        onMouseDown={(e) => e.preventDefault()}
        onBlur={(e) => {
          // Solo cerrar el menú si el foco se va fuera del componente completamente
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
        <div className="absolute right-0 top-full mt-2 w-36 sm:w-40 lg:w-44 bg-gray-900 dark:bg-gray-800 border-2 
                        border-[#139ED4] dark:border-[#88D4E4] rounded-lg shadow-xl z-50 animate-fade-in overflow-hidden">
          <ul className="py-1" role="listbox">
            {LANGUAGE_OPTIONS.map((option) => (
              <li key={option.value}>
                <button
                  className={`w-full flex items-center justify-between px-3 py-2 text-left
                             hover:bg-[#171D4C] dark:hover:bg-[#139ED4] text-[#139ED4] dark:text-[#88D4E4] text-sm lg:text-base transition-colors
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#139ED4]
                             ${lang === option.value ? 'font-bold' : 'font-medium'}`}
                  onClick={() => handleLanguageChange(option.value)}
                  onMouseDown={(e) => e.preventDefault()}
                  role="option"
                  aria-selected={lang === option.value}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[#139ED4] dark:text-[#88D4E4] font-bold w-6">
                      {option.code}
                    </span>
                    <span className="text-[#139ED4] dark:text-[#88D4E4]">{option.label}</span>
                  </div>
                  {lang === option.value && <span className="text-[#23B6E7] font-bold">✓</span>}
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
                     ? 'bg-[#139ED4] hover:bg-[#171D4C] text-white shadow-sm hover:shadow-md focus-visible:ring-[#139ED4]'
                     : 'bg-[#88D4E4] hover:bg-[#139ED4] text-white shadow-lg focus-visible:ring-white font-extrabold'
                 }`}
      style={!isScrolled ? {
        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
      } : {}}
      aria-label="Solicitar cotización por WhatsApp"
    >
      <img
        src="logo_inxora/LOGO-22.png"
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
          ? 'text-[#139ED4] dark:text-[#88D4E4] hover:text-[#171D4C] dark:hover:text-[#139ED4] focus-visible:ring-2 focus-visible:ring-[#139ED4]'
          : 'text-white hover:text-[#88D4E4] focus-visible:ring-2 focus-visible:ring-white font-extrabold'
      }`}
      style={!isScrolled ? {
        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))'
      } : {}}
    >
      {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
    </button>
  );

  const renderMobileMenu = () => (
    <div className="lg:hidden bg-white dark:bg-dark-surface border-t-2 border-[#139ED4] dark:border-[#88D4E4] w-full shadow-xl mobile-menu">
      <nav className="px-4 py-6 bg-white dark:bg-dark-surface">
        <ul className="flex flex-col space-y-4">
          {NAVIGATION_ITEMS.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => navigateToSection(item.sectionId)}
                onMouseDown={(e) => e.preventDefault()}
                className="w-full text-left text-[#139ED4] dark:text-[#88D4E4] hover:text-[#171D4C] dark:hover:text-[#139ED4] font-bold text-lg
                           py-4 px-3 transition-colors rounded-md hover:bg-[#f0f9ff] dark:hover:bg-dark-accent
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-[#139ED4]"
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
              className="w-full font-orbitron bg-[#139ED4] hover:bg-[#171D4C] text-white 
                         px-4 py-4 rounded-md font-bold text-base transition-all duration-200 
                         shadow-md hover:shadow-lg flex items-center gap-2 justify-center
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-[#139ED4] focus-visible:ring-offset-2"
            >
              <img
                src="logo_inxora/LOGO-22.png"
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
          isScrolled || isMenuOpen || isProvidersForm
            ? 'bg-white dark:bg-dark-surface shadow-sm border-b-2 border-[#139ED4] dark:border-[#88D4E4] scrolled'
            : ''
        }`}
      >
        <div className="w-full py-2 sm:py-3 flex items-center justify-between max-w-none">
          {renderLogo()}
          {renderDesktopNavigation()}

          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 ml-auto pr-4 sm:pr-6 md:pr-8 lg:pr-12">
            {renderLanguageSelector()}
            {renderCTAButton()}
            {renderMobileMenuButton()}
          </div>
        </div>

        {isMenuOpen && renderMobileMenu()}
      </header>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Header completamente transparente cuando no está scrolled */
        header:not(.scrolled) {
          background: transparent !important;
          background-color: transparent !important;
        }
        
        header:not(.scrolled) > div:first-child {
          background: transparent !important;
          background-color: transparent !important;
        }
        
        /* Eliminar cualquier backdrop filter del header */
        header:not(.scrolled) * {
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
        
        .mobile-menu {
          background-color: white !important;
        }
        
        .dark .mobile-menu {
          background-color: #16213e !important;
        }
      `}</style>
    </>
  );
};