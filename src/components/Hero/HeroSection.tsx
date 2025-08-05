import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { heroSectionTranslation } from './heroSectionTranslation';
import { Helmet } from 'react-helmet';
import "../../styles/orbitron.css";

export const HeroSection = () => {
  const { lang } = useLanguage();
  const t = heroSectionTranslation[lang];
  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDescription} />
      </Helmet>
      <section className="relative w-full min-h-[480px] lg:min-h-[600px] flex items-center justify-center overflow-hidden" style={{background: 'linear-gradient(160deg, #139ED4 0%, #171D4C 50%, #D90E8C 80%, #fff 100%)'}}>
        {/* Degradado difuminado hacia abajo, más suave y sin línea */}
        <div className="absolute bottom-0 left-0 w-full h-8 pointer-events-none" style={{background: 'linear-gradient(to bottom, rgba(255,255,255,0) 40%, rgba(255,255,255,1) 100%)'}} />
        <div className="w-full px-4 lg:px-12 flex flex-col lg:flex-row items-stretch justify-between gap-8 lg:gap-12 min-h-[480px] lg:min-h-[600px]">
          {/* Columna izquierda: texto y botones */}
          <div className="flex-1 md:basis-1/2 flex flex-col items-start justify-center text-left md:pl-12 py-8 md:py-0">
            <h1 className="font-orbitron text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-[#88D4E4] mb-3 leading-snug md:leading-tight lg:leading-[1.1] drop-shadow-sm">
              {t.title}
            </h1>
            <h2 className="font-montserrat text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-[#ffffff] mb-6 leading-snug md:leading-normal lg:leading-relaxed">
              {t.subtitle}
            </h2>
            <div className="flex flex-col sm:flex-row flex-wrap md:flex-nowrap gap-4 w-full sm:w-auto mt-6 sm:mt-8 min-h-[80px]">
              <a href="#contacto" className="font-orbitron bg-[#139ED4] hover:bg-[#23B6E7] text-white px-6 py-3 rounded-md font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 text-center h-12 flex items-center justify-center">
                {t.cta}
              </a>
              <a href="https://wa.me/946885531?text=Hola%2C%20quiero%20hablar%20con%20un%20asesor%20INXORA" target="_blank" rel="noopener noreferrer" className="font-orbitron border-2 border-[#139ED4] text-[#139ED4] px-6 py-3 rounded-md font-semibold text-lg transition-all duration-200 shadow-md hover:bg-[#139ED4] hover:text-white hover:scale-105 flex items-center justify-center gap-2 group h-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#139ED4" viewBox="0 0 24 24" className="inline-block mr-2 transition-colors duration-200 group-hover:fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.174.2-.298.3-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.1 3.2 5.077 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.617h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.455 4.436-9.89 9.893-9.89 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.995c-.003 5.456-4.438 9.891-9.893 9.891m8.413-18.306A11.815 11.815 0 0 0 12.05 0C5.495 0 .06 5.435.058 12.086c0 2.13.557 4.21 1.615 6.033L0 24l6.063-1.594a11.888 11.888 0 0 0 5.978 1.527h.005c6.554 0 11.89-5.435 11.893-12.085a11.86 11.86 0 0 0-3.488-8.477"/></svg>
                Hablar con un asesor
              </a>
            </div>
          </div>
          {/* Columna derecha: logo grande */}
          <div className="hidden lg:flex flex-1 lg:basis-1/2 items-center justify-end lg:pr-0 xl:pr-4 w-full lg:w-auto mt-10 lg:mt-0 min-h-[200px]">
            <img src="/logo_inxora/LOGO-30.png" alt="INXORA" loading="lazy" className="w-[clamp(180px,30vw,500px)] max-w-full h-auto drop-shadow-xl" />
          </div>
        </div>
      </section>
    </>
  );
};