import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { heroSectionTranslation } from './heroSectionTranslation';
import { Helmet } from 'react-helmet';
import { Truck, Calculator, LineChart } from 'lucide-react';
import "../../styles/orbitron.css";
import "../../styles/anisette.css";

export const HeroSection = () => {
  const { lang } = useLanguage();
  const t = heroSectionTranslation[lang];
  const [isScrolling, setIsScrolling] = React.useState(false);

  // Función para hacer scroll al siguiente componente
  const scrollToNextSection = () => {
    const nextSection = document.querySelector('section:nth-of-type(2)') as HTMLElement;
    if (nextSection) {
      const headerHeight = 80; // Altura aproximada del header
      const targetPosition = nextSection.offsetTop - headerHeight;
      
      window.scrollTo({ 
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Efecto para manejar el scroll del mouse
  React.useEffect(() => {
    const handleWheelScroll = (e: WheelEvent) => {
      // Solo activar si estamos en la parte superior de la página (Hero section)
      const isInHeroSection = window.scrollY < window.innerHeight * 0.5;
      
      if (isInHeroSection && e.deltaY > 0 && !isScrolling) {
        e.preventDefault();
        setIsScrolling(true);
        scrollToNextSection();
        
        // Reset del flag después de 1.5 segundos para permitir nueva detección
        setTimeout(() => {
          setIsScrolling(false);
        }, 1500);
      }
    };

    // Agregar el listener con passive: false para poder usar preventDefault
    document.addEventListener('wheel', handleWheelScroll, { passive: false });

    // Cleanup
    return () => {
      document.removeEventListener('wheel', handleWheelScroll);
    };
  }, [isScrolling]);
  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDescription} />
      </Helmet>
      <section
        className="relative w-full flex items-center justify-center overflow-hidden"
        style={{ minHeight: '85dvh', height: '85dvh', paddingTop: '96px' }} // Altura reducida; ancho completo sin bordes
      >
        {/* Imagen de fondo: ancho completo, altura del hero reducida */}
        <div className="absolute inset-0 w-full h-full z-0" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
          {/* Imagen para móviles (dall-e2.webp) */}
          <img 
            src="/dall-e2.webp" 
            alt="INXORA Background Mobile" 
            className="absolute inset-0 w-full h-full object-cover object-center lg:hidden"
            loading="lazy"
          />
          {/* Imagen para desktop (dall-e1.1.png) */}
          <img 
            src="/dall-e1.1.png" 
            alt="INXORA Background Desktop" 
            className="absolute inset-0 w-full h-full object-cover object-center hidden lg:block"
            loading="lazy"
          />
          {/* Overlay para mejorar legibilidad */}
          <div className="absolute inset-0 bg-black bg-opacity-10 dark:bg-black dark:bg-opacity-30 pointer-events-none" />
        </div>
        
        <div
          className="relative z-10 w-full px-4 lg:px-8 flex flex-col items-start justify-center text-left"
          style={{ minHeight: 'calc(85dvh - 96px)', paddingTop: '0.5rem', paddingBottom: '2rem' }}
        >
          <div className="flex flex-col items-start justify-center max-w-4xl">
            {/* Fondo del título: banda con color de la paleta para mejor contraste sobre imagen clara */}
            <div
              className="px-6 py-5 sm:px-8 sm:py-6 rounded-xl mb-6 sm:mb-8 w-full max-w-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(23, 29, 76, 0.88) 0%, rgba(19, 158, 212, 0.25) 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)',
              }}
            >
              <h1
                className="font-anisette-petit text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-snug md:leading-tight lg:leading-[1.1] text-left"
                style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 0 24px rgba(19, 158, 212, 0.4)',
                }}
              >
                {t.title}
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-5 justify-start items-stretch sm:items-center mt-6 sm:mt-8">
              <a href="#" className="font-orbitron px-8 py-4 rounded-lg font-semibold text-lg sm:text-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-center min-h-[56px] flex items-center justify-center gap-3 whitespace-nowrap min-w-[240px] sm:min-w-[260px] hover:bg-[#23B6E7]" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                <Truck className="w-6 h-6 flex-shrink-0" aria-hidden />
                {t.ctaDespacho}
              </a>
              <a href="https://tienda.inxora.com/es" target="_blank" rel="noopener noreferrer" className="font-orbitron text-white px-8 py-4 rounded-lg font-semibold text-lg sm:text-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-center min-h-[56px] flex items-center justify-center gap-3 whitespace-nowrap min-w-[240px] sm:min-w-[260px] hover:opacity-95" style={{ backgroundColor: 'var(--color-primary-dark)', color: 'white' }}>
                <Calculator className="w-6 h-6 flex-shrink-0" aria-hidden />
                {t.ctaCotizador}
              </a>
              <a href="#" className="font-orbitron text-white px-8 py-4 rounded-lg font-semibold text-lg sm:text-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-center min-h-[56px] flex items-center justify-center gap-3 whitespace-nowrap min-w-[240px] sm:min-w-[260px] hover:opacity-95" style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}>
                <LineChart className="w-6 h-6 flex-shrink-0" aria-hidden />
                {t.ctaInteligencia}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
