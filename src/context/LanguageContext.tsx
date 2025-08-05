import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Tipos de idioma soportados
export type Language = 'es' | 'en' | 'pt';

interface LanguageContextProps {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Leer idioma inicial de localStorage o usar 'es'
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('lang') as Language) || 'es';
  });

  // Guardar idioma en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  // setLang que actualiza el estado y localStorage
  const setLang = (newLang: Language) => {
    setLangState(newLang);
    // localStorage.setItem('lang', newLang); // Ya lo hace el useEffect
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage debe usarse dentro de LanguageProvider');
  return context;
}; 