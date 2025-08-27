import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'accent' | 'accentBright' | 'success' | 'warning' | 'error';
  size?: 'compact' | 'comfortable' | 'spacious';
  gradient?: boolean;
  backdrop?: boolean;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  size = 'comfortable',
  gradient = false,
  backdrop = false,
  interactive = false,
  className = '',
  onClick
}) => {
  const cardClasses = [
    styles.card,
    variant !== 'default' && styles[variant],
    styles[size],
    gradient && styles.gradient,
    backdrop && styles.backdrop,
    interactive && styles.interactive,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`${styles.header} ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`${styles.footer} ${className}`}>
      {children}
    </div>
  );
};
