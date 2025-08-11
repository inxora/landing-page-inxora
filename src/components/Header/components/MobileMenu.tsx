import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { headerTranslations } from '../headerTranslations';
import { NAVIGATION_ITEMS, WHATSAPP_URL } from '../constants';

interface MobileMenuProps {
  onNavigateToSection: (sectionId: string) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ onNavigateToSection }) => {
  const { lang } = useLanguage();
  const t = headerTranslations[lang];

  return (
    <div className="lg:hidden bg-white border-t-2 border-[#139ED4] w-full shadow-xl mobile-menu">
      <nav className="px-4 py-6 bg-white">
        <ul className="flex flex-col space-y-4">
          {NAVIGATION_ITEMS.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => onNavigateToSection(item.sectionId)}
                className="w-full text-left text-[#139ED4] hover:text-[#171D4C] font-bold text-lg
                         py-4 px-3 transition-colors rounded-md hover:bg-[#f0f9ff]
                         focus:outline-none focus:ring-2 focus:ring-[#139ED4]"
              >
                {t[item.label as keyof typeof t]}
              </button>
            </li>
          ))}
          <li className="pt-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full font-orbitron bg-[#139ED4] hover:bg-[#171D4C] text-white 
                       px-4 py-4 rounded-md font-bold text-base transition-all duration-200 
                       shadow-md hover:shadow-lg flex items-center gap-2 justify-center
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
};
