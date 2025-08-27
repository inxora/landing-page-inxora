import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  gradient?: boolean;
  rounded?: boolean;
  children: React.ReactNode;
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  gradient = false,
  rounded = false,
  children,
  className = '',
  href,
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    gradient && styles.gradient,
    rounded && styles.rounded,
    className
  ].filter(Boolean).join(' ');

  if (href) {
    return (
      <a href={href} className={buttonClasses}>
        {children}
      </a>
    );
  }

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};
