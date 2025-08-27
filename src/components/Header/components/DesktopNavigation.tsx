import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { headerTranslations } from '../headerTranslations';
import { NAVIGATION_ITEMS } from '../constants';

interface DesktopNavigationProps {
  isScrolled: boolean;
  onNavigateToSection: (sectionId: string) => void;
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  isScrolled,
  onNavigateToSection,
}) => {
  const { lang } = useLanguage();
  const t = headerTranslations[lang];

  return (
    <nav className="hidden lg:flex flex-1 items-center justify-start ml-8 xl:ml-12 2xl:ml-16">
      <ul className="flex items-center space-x-6 xl:space-x-8 2xl:space-x-12">
        {NAVIGATION_ITEMS.map((item) => (
          <li key={item.key}>
            <button
              onClick={() => onNavigateToSection(item.sectionId)}
              className={`font-bold text-lg xl:text-xl 2xl:text-2xl transition-all duration-300 hover:scale-105 focus:outline-none rounded-md px-3 py-2 ${
                isScrolled
                  ? 'text-primary hover:text-primary-dark focus:ring-2 focus:ring-[var(--color-primary)]'
                  : 'text-white hover:text-primary-light focus:ring-2 focus:ring-[var(--color-primary-light)] font-extrabold text-shadow-lg'
              }`}
              style={
                !isScrolled
                  ? {
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.3)',
                    }
                  : {}
              }
            >
              {t[item.label as keyof typeof t]}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
