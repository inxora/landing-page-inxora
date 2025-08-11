import React, { useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { LANGUAGE_OPTIONS } from '../constants';

interface LanguageSelectorProps {
  isScrolled: boolean;
  langMenuOpen: boolean;
  onToggleMenu: () => void;
  onLanguageChange: (lang: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  isScrolled,
  langMenuOpen,
  onToggleMenu,
  onLanguageChange,
}) => {
  const { lang } = useLanguage();
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        onToggleMenu();
      }
    };

    if (langMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [langMenuOpen, onToggleMenu]);

  return (
    <div className="relative flex items-center" ref={langMenuRef}>
      <button
        className={`flex items-center gap-2 px-3 py-2 h-10 sm:h-12 min-w-[70px] sm:min-w-[80px] 
                 rounded-md font-extrabold text-sm sm:text-base lg:text-lg transition-all duration-300 
                 focus:outline-none ${
                   isScrolled
                     ? 'border border-[#139ED4] bg-transparent text-[#139ED4] hover:bg-[#171D4C] hover:text-white focus:ring-2 focus:ring-[#139ED4]'
                     : 'border-2 border-white bg-transparent text-white hover:bg-white hover:bg-opacity-20 hover:text-[#88D4E4] focus:ring-2 focus:ring-white font-extrabold'
                 }`}
        style={
          !isScrolled
            ? {
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              }
            : {}
        }
        onClick={onToggleMenu}
        aria-haspopup="listbox"
        aria-expanded={langMenuOpen}
        aria-label="Seleccionar idioma"
      >
        <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="font-mono text-xs sm:text-sm lg:text-base font-bold">
          {lang.toUpperCase()}
        </span>
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
                  onClick={() => onLanguageChange(option.value)}
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
};
