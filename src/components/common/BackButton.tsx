import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface BackButtonProps {
  to?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  customText?: string;
}

const backButtonTranslations = {
  es: 'Atrás',
  en: 'Back',
  pt: 'Voltar'
};

export const BackButton = ({ 
  to = '/', 
  onClick, 
  className = '', 
  variant = 'default',
  size = 'md',
  showIcon = true,
  customText
}: BackButtonProps) => {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(to);
    }
  };

  const baseClasses = 'group inline-flex items-center gap-2 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#139ED4]/50 rounded-full';
  
  const variantClasses = {
    default: 'bg-gray-800/90 text-white border-2 border-gray-600 hover:bg-[#139ED4] hover:border-[#139ED4] shadow-lg backdrop-blur-sm',
    outline: 'bg-transparent border-2 border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-[#139ED4] hover:border-[#139ED4] hover:text-white',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5'
  };

  const buttonText = customText || backButtonTranslations[lang] || backButtonTranslations.es;

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      aria-label={buttonText}
    >
      {showIcon && (
        <ArrowLeft 
          className={`${iconSizes[size]} transform group-hover:-translate-x-1 transition-transform duration-300`} 
        />
      )}
      {buttonText}
    </button>
  );
};
