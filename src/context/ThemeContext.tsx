import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light'); // Modo claro por defecto

  useEffect(() => {
    // Siempre usar modo claro
    setTheme('light');
    document.documentElement.classList.remove('dark'); // Asegurarse de que la clase 'dark' no esté presente
    localStorage.setItem('inxora-theme', 'light');
  }, []);

  const toggleTheme = () => {
    // No permitir cambiar el tema, siempre será 'light'
    console.warn("Dark mode has been removed. Theme is always 'light'.");
  };

  const value = {
    theme,
    toggleTheme,
    isDark: false // Siempre es falso ya que el modo oscuro ha sido eliminado
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
