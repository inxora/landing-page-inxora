import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { headerTranslations } from '../headerTranslations';
import { WHATSAPP_URL } from '../constants';

interface CTAButtonProps {
  isScrolled: boolean;
}

export const CTAButton: React.FC<CTAButtonProps> = ({ isScrolled }) => {
  const { lang } = useLanguage();
  const t = headerTranslations[lang];

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`hidden xl:flex font-orbitron px-4 py-2 h-10 lg:px-6 lg:py-3 lg:h-12 min-w-[140px] lg:min-w-[180px] 
               rounded-md font-extrabold text-sm lg:text-base transition-all duration-300 
               hover:shadow-xl hover:scale-105 items-center gap-2 justify-center
               focus:outline-none focus:ring-offset-2 ${
                 isScrolled
                   ? 'bg-primary hover:bg-[var(--color-primary-dark)] text-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-[var(--color-primary)]'
                   : 'bg-primary-light hover:bg-primary text-white shadow-lg focus:ring-2 focus:ring-white font-extrabold'
               }`}
      style={
        !isScrolled
          ? {
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            }
          : {}
      }
      aria-label="Solicitar cotización por WhatsApp"
    >
      <img
        src="/logo_inxora/LOGO-18.png"
        alt=""
        className="w-4 h-4 lg:w-5 lg:h-5 object-contain"
        aria-hidden="true"
      />
      <span className="truncate">{t.solicitarCotizacion}</span>
    </a>
  );
};
