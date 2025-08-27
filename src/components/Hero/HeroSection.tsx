import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { heroSectionTranslation } from './heroSectionTranslation';
import { Helmet } from 'react-helmet';
import "../../styles/orbitron.css";

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
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
        style={{ minHeight: '100dvh', paddingTop: '96px' }} // 96px = header alto + margen extra
      >
        {/* Imagen de fondo que se extiende hasta cubrir el header */}
        <div className="absolute inset-0 w-full h-full z-0" style={{ top: '-100px', height: 'calc(100vh + 100px)' }}>
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
          {/* Overlay para mejorar legibilidad - diferente para modo claro y oscuro */}
          <div className="absolute inset-0 bg-black bg-opacity-10 dark:bg-black dark:bg-opacity-30"></div>
        </div>
        
        <div
          className="relative z-10 w-full px-4 lg:px-8 flex flex-col lg:flex-row items-stretch justify-start"
          style={{ minHeight: 'calc(100dvh - 96px)', paddingTop: '0.5rem', paddingBottom: '2rem' }}
        >
          {/* Columna izquierda: texto y botones - Ahora en el lado izquierdo en desktop */}
          <div className="flex-1 lg:flex-none lg:w-[45%] xl:w-[40%] flex flex-col items-start justify-center text-left py-8 lg:py-0 lg:pl-8"
            style={{ minHeight: '320px' }}
          >
            <h1 
              className="font-orbitron text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-snug md:leading-tight lg:leading-[1.1]" 
              style={{
                textShadow: '3px 3px 6px rgba(0,0,0,0.9), 0 0 20px rgba(255,255,255,0.3), 2px 2px 0 rgba(19,158,212,0.8)'
              }}
              dangerouslySetInnerHTML={{ __html: t.title }}
            ></h1>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full sm:w-auto mt-6 sm:mt-8">
              <a href="#contacto" className="font-orbitron bg-primary hover:bg-[#23B6E7] dark:bg-primary-light dark:hover:bg-primary text-white px-6 py-3 rounded-md font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-center h-12 flex items-center justify-center whitespace-nowrap">
                {t.cta}
              </a>
              <a href="https://wa.me/946885531?text=Hola%2C%20quiero%20hablar%20con%20un%20asesor%20INXORA" target="_blank" rel="noopener noreferrer" className="font-orbitron bg-primary hover:bg-[#23B6E7] dark:bg-primary-light dark:hover:bg-primary text-white px-6 py-3 rounded-md font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-center h-12 flex items-center justify-center whitespace-nowrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--color-foreground)" viewBox="0 0 25 24" className="transition-colors duration-200 group-hover:fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.174.2-.298.3-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.1 3.2 5.077 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.617h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.455 4.436-9.89 9.893-9.89 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.995c-.003 5.456-4.438 9.891-9.893 9.891m8.413-18.306A11.815 11.815 0 0 0 12.05 0C5.495 0 .06 5.435.058 12.086c0 2.13.557 4.21 1.615 6.033L0 24l6.063-1.594a11.888 11.888 0 0 0 5.978 1.527h.005c6.554 0 11.89-5.435 11.893-12.085a11.86 11.86 0 0 0-3.488-8.477"/></svg>
                {t.ctaAdviser}
              </a>
            </div>
          </div>
          
          {/* Columna derecha: espacio libre para mostrar la imagen de fondo en desktop */}
          <div className="hidden lg:block flex-1">
            {/* Espacio para que se vea la imagen de fondo sin obstáculos */}
          </div>
        </div>
      </section>
    </>
  );
};
