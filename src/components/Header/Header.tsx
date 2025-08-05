import React, { useEffect, useState, useRef } from "react";
import { Menu, X, Globe } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { headerTranslations } from './headerTranslations';
import { Helmet } from 'react-helmet';
import { getRouteByLang, getRouteKeyByPath } from '../types/routes';
import Loader from "../Loader";

// Utilidades
const scrollToSection = (id: string): void => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Constantes
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

// Interfaces
interface NavigationItem {
  key: string;
  sectionId: string;
  label: keyof typeof headerTranslations.es;
}

export const Header: React.FC = () => {
  // Estados
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // Refs
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();
  const t = headerTranslations[lang];

  // Items de navegación
  const navigationItems: NavigationItem[] = [
    { key: 'how-it-works', sectionId: 'comoFunciona', label: 'comoFunciona' },
    { key: 'products', sectionId: 'productos', label: 'productos' },
    { key: 'clients', sectionId: 'beneficios', label: 'clientes' },
    { key: 'providers', sectionId: 'proveedores', label: 'proveedores' },
  ];

  // Efectos
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Loader en primera visita
  useEffect(() => {
    const hasVisited = window.sessionStorage.getItem("inxora_visited");
    if (!hasVisited) {
      setShowLoader(true);
      window.sessionStorage.setItem("inxora_visited", "true");
      const timer = setTimeout(() => setShowLoader(false), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Detección automática de idioma por geolocalización
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

  // Cerrar menú de idioma al hacer clic fuera
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

  // Handlers
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
    
    // Cerrar menú móvil si está abierto
    setIsMenuOpen(false);
  };

  const toggleMobileMenu = (): void => {
    setIsMenuOpen(prev => !prev);
  };

  const toggleLanguageMenu = (): void => {
    setLangMenuOpen(prev => !prev);
  };

  // Componentes
  const LogoSection: React.FC = () => (
    <div className="flex items-center pl-4 sm:pl-6 md:pl-8 lg:pl-12 flex-shrink-0">
      <button
        onClick={handleLogoClick}
        className={`focus:outline-none focus:ring-2 focus:ring-[#139ED4] rounded-lg ${
          location.pathname !== '/' ? 'cursor-pointer' : 'cursor-default'
        }`}
        aria-label="Ir al inicio"
      >
        <img 
          src="logo_inxora/LOGO-35.png" 
          alt="INXORA - Marketplace de suministros industriales" 
          className="h-14 sm:h-16 md:h-18 lg:h-20 w-auto transition-transform duration-200 hover:scale-105" 
        />
      </button>
    </div>
  );

  const DesktopNavigation: React.FC = () => (
    <nav className="hidden lg:flex flex-1 items-center justify-start ml-8 xl:ml-12 2xl:ml-16">
      <ul className="flex items-center space-x-6 xl:space-x-8 2xl:space-x-12">
        {navigationItems.map((item) => (
          <li key={item.key}>
            <button
              onClick={() => navigateToSection(item.sectionId)}
              className="text-[#139ED4] hover:text-[#171D4C] font-bold text-base xl:text-lg 
                       transition-all duration-200 hover:scale-105 focus:outline-none 
                       focus:ring-2 focus:ring-[#139ED4] rounded-md px-2 py-1"
            >
              {t[item.label]}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  const LanguageSelector: React.FC = () => (
    <div className="relative flex items-center" ref={langMenuRef}>
      <button
        className="flex items-center gap-2 px-3 py-2 h-10 sm:h-12 min-w-[70px] sm:min-w-[80px] 
                 rounded-md border border-[#139ED4] bg-transparent text-[#139ED4] font-bold 
                 text-sm sm:text-base lg:text-lg hover:bg-[#171D4C] hover:text-white 
                 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#139ED4]"
        onClick={toggleLanguageMenu}
        aria-haspopup="listbox"
        aria-expanded={langMenuOpen}
        aria-label="Seleccionar idioma"
      >
        <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="font-mono text-xs sm:text-sm lg:text-base">{lang.toUpperCase()}</span>
      </button>
      
      {langMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-36 sm:w-40 lg:w-44 bg-gray-900 border-2 
                      border-[#139ED4] rounded-lg shadow-xl z-50 animate-fade-in overflow-hidden">
          <ul className="py-1" role="listbox">
            {LANGUAGE_OPTIONS.map((option) => (
              <li key={option.value}>
                <button
                  className={`w-full flex items-center justify-between px-3 py-2 text-left
                           hover:bg-[#171D4C] text-[#139ED4] text-sm lg:text-base transition-colors
                           ${lang === option.value ? 'font-bold' : 'font-medium'}`}
                  onClick={() => handleLanguageChange(option.value)}
                  role="option"
                  aria-selected={lang === option.value}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[#139ED4] font-bold w-6">
                      {option.code}
                    </span>
                    <span className="text-[#139ED4]">{option.label}</span>
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

  const CTAButton: React.FC = () => (
    <a 
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer" 
      className="hidden xl:flex font-orbitron bg-[#139ED4] hover:bg-[#171D4C] text-white 
               px-4 py-2 h-10 lg:px-6 lg:py-3 lg:h-12 min-w-[140px] lg:min-w-[180px] 
               rounded-md font-bold text-sm lg:text-base transition-all duration-200 
               shadow-sm hover:shadow-md hover:scale-105 items-center gap-2 justify-center
               focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:ring-offset-2"
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

  const MobileMenuButton: React.FC = () => (
    <button 
      onClick={toggleMobileMenu}
      aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
      className="lg:hidden p-2 text-[#139ED4] hover:text-[#171D4C] transition-colors
               focus:outline-none focus:ring-2 focus:ring-[#139ED4] rounded-md"
    >
      {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );

  const MobileMenu: React.FC = () => (
    <div className="lg:hidden bg-white border-t-2 border-[#139ED4] w-full shadow-lg">
      <nav className="px-4 py-4">
        <ul className="flex flex-col space-y-3">
          {navigationItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => navigateToSection(item.sectionId)}
                className="w-full text-left text-[#139ED4] hover:text-[#171D4C] font-medium 
                         py-3 px-2 transition-colors rounded-md hover:bg-[#f0f9ff]
                         focus:outline-none focus:ring-2 focus:ring-[#139ED4]"
              >
                {t[item.label]}
              </button>
            </li>
          ))}
          <li className="pt-2">
            <a 
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer" 
              className="w-full font-orbitron bg-[#139ED4] hover:bg-[#171D4C] text-white 
                       px-4 py-3 rounded-md font-semibold text-sm transition-all duration-200 
                       shadow-sm hover:shadow-md flex items-center gap-2 justify-center
                       focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:ring-offset-2"
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

      <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b-2 border-[#139ED4]">
        <div className="w-full py-2 sm:py-3 flex items-center justify-between max-w-none">
          <LogoSection />
          <DesktopNavigation />
          
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 ml-auto pr-4 sm:pr-6 md:pr-8 lg:pr-12">
            <LanguageSelector />
            <CTAButton />
            <MobileMenuButton />
          </div>
        </div>
        
        {isMenuOpen && <MobileMenu />}
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
      `}</style>
    </>
  );
};