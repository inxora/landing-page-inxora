import React from 'react';
import { useLocation } from 'react-router-dom';

interface LogoSectionProps {
  onLogoClick: () => void;
}

export const LogoSection: React.FC<LogoSectionProps> = ({ onLogoClick }) => {
  const location = useLocation();

  return (
    <div className="flex items-center pl-4 sm:pl-6 md:pl-8 lg:pl-12 flex-shrink-0">
      <button
        onClick={onLogoClick}
        className={`focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] rounded-lg ${
          location.pathname !== '/' ? 'cursor-pointer' : 'cursor-default'
        }`}
        aria-label="Ir al inicio"
      >
        <img
          src="/logo_inxora/LOGO-30.png"
          alt="INXORA - Marketplace de suministros industriales"
          className="h-16 sm:h-20 md:h-22 lg:h-24 w-auto transition-transform duration-200 hover:scale-105"
        />
      </button>
    </div>
  );
};
