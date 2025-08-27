import React from 'react';
import { Menu, X } from 'lucide-react';

interface MobileMenuButtonProps {
  isScrolled: boolean;
  isMenuOpen: boolean;
  onToggle: () => void;
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({
  isScrolled,
  isMenuOpen,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
      className={`lg:hidden p-2 transition-colors focus:outline-none rounded-md ${
        isScrolled
          ? 'text-primary hover:text-primary-dark focus:ring-2 focus:ring-[var(--color-primary)]'
          : 'text-white hover:text-primary-light focus:ring-2 focus:ring-white font-extrabold'
      }`}
      style={
        !isScrolled
          ? {
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))',
            }
          : {}
      }
    >
      {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
    </button>
  );
};
