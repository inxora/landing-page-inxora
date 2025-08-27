export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // INXORA Brand Colors usando CSS Variables
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          bright: 'var(--color-accent-bright)',
        },
        
        // Backgrounds Profesionales
        background: {
          DEFAULT: 'var(--color-background)',
          secondary: 'var(--color-background-secondary)',
          accent: 'var(--color-background-accent)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          elevated: 'var(--color-surface-elevated)',
        },
        
        // Textos Profesionales
        foreground: {
          DEFAULT: 'var(--color-foreground)',
          secondary: 'var(--color-foreground-secondary)',
          muted: 'var(--color-foreground-muted)',
          light: 'var(--color-foreground-light)',
        },
        
        // Borders
        border: {
          DEFAULT: 'var(--color-border)',
          light: 'var(--color-border-light)',
          strong: 'var(--color-border-strong)',
        },
        
        // Interactive Elements
        interactive: {
          DEFAULT: 'var(--color-interactive)',
          hover: 'var(--color-interactive-hover)',
        },
        cta: {
          primary: 'var(--color-cta-primary)',
          'primary-hover': 'var(--color-cta-primary-hover)',
          secondary: 'var(--color-cta-secondary)',
          'secondary-hover': 'var(--color-cta-secondary-hover)',
        },
        
        // Status Colors
        success: {
          DEFAULT: 'var(--color-success)',
          light: 'var(--color-success-light)',
          bg: 'var(--color-success-bg)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          light: 'var(--color-warning-light)',
          bg: 'var(--color-warning-bg)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          light: 'var(--color-error-light)',
          bg: 'var(--color-error-bg)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          light: 'var(--color-info-light)',
          bg: 'var(--color-info-bg)',
        },
      },
      
      fontFamily: {
        primary: 'var(--font-family-primary)',
        heading: 'var(--font-family-heading)',
        mono: 'var(--font-family-mono)',
      },
      
      fontSize: {
        xs: 'var(--font-size-xs)',
        sm: 'var(--font-size-sm)',
        base: 'var(--font-size-base)',
        lg: 'var(--font-size-lg)',
        xl: 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
        '5xl': 'var(--font-size-5xl)',
        '6xl': 'var(--font-size-6xl)',
        '7xl': 'var(--font-size-7xl)',
      },
      
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
        '4xl': 'var(--spacing-4xl)',
      },
      
      maxWidth: {
        xs: 'var(--container-xs)',
        sm: 'var(--container-sm)',
        md: 'var(--container-md)',
        lg: 'var(--container-lg)',
        xl: 'var(--container-xl)',
        '2xl': 'var(--container-2xl)',
        '3xl': 'var(--container-3xl)',
        '4xl': 'var(--container-4xl)',
        '5xl': 'var(--container-5xl)',
        '6xl': 'var(--container-6xl)',
        '7xl': 'var(--container-7xl)',
      },
      
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        full: 'var(--radius-full)',
      },
      
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        primary: 'var(--shadow-primary)',
        accent: 'var(--shadow-accent)',
      },
      
      transitionDuration: {
        fast: 'var(--transition-fast)',
        normal: 'var(--transition-normal)',
        slow: 'var(--transition-slow)',
      },
      
      backgroundImage: {
        'gradient-hero-light': 'var(--gradient-hero-light)',
        'gradient-hero-dark': 'var(--gradient-hero-dark)',
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-accent': 'var(--gradient-accent)',
        'gradient-cta': 'var(--gradient-cta)',
        'gradient-section-light': 'var(--gradient-section-light)',
        'gradient-section-dark': 'var(--gradient-section-dark)',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out both',
        'slide-up': 'slideUp 0.6s ease-out both',
        'scale-in': 'scaleIn 0.4s ease-out both',
        'bounce-gentle': 'bounceGentle 0.8s ease-out both',
      },
    },
  },
  plugins: [],
}