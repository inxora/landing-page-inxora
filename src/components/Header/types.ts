// Types for Header components
export interface NavigationItem {
  key: string;
  sectionId: string;
  label: string;
}

export interface LanguageOption {
  value: string;
  label: string;
  code: string;
}

export interface HeaderProps {
  isScrolled: boolean;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}
