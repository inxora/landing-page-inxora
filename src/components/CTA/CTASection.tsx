import { useLanguage } from '../../context/LanguageContext';
import { ctaSectionTranslation } from './ctaSectionTranslation';
import { useNavigate } from 'react-router-dom';
import { getRouteByLang } from '../types/routes';
import { useEffect, useRef } from 'react';

export const CTASection = () => {
  const { lang } = useLanguage();
  const t = ctaSectionTranslation[lang];
  const navigate = useNavigate();
  const contactRef = useRef<HTMLElement>(null);

  const handleRegisterClick = () => {
    navigate(getRouteByLang('register', lang));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (window.location.hash === '#contacto') {
            history.pushState('', document.title, window.location.pathname + window.location.search);
          }
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = contactRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section id="contacto" ref={contactRef} className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-[#f0f9fd] to-[#e9f6fc] dark:from-dark-bg dark:to-dark-surface w-full">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Título principal */}
          <h2 className="font-orbitron text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-sm">
            <span className="text-[#139ED4]">{t.titleMain} </span>
            <span className="text-[#D90E8C]">{t.titleAccent}</span>
          </h2>
          
          {/* Descripción */}
          <p className="font-montserrat text-xl md:text-2xl text-[#139ED4] dark:text-[#88D4E4] mb-8 max-w-3xl mx-auto">
            {t.description}
          </p>
          
          {/* Beneficios destacados */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-md p-6 rounded-xl shadow-lg border border-[#88D4E4]/30">
              <div className="text-[#139ED4] mb-4">
                <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1h-6a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1h-6a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#171D4C] dark:text-white mb-2">{t.beneficios.cotizacionesRapidas.titulo}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{t.beneficios.cotizacionesRapidas.descripcion}</p>
            </div>
            
            <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-md p-6 rounded-xl shadow-lg border border-[#88D4E4]/30">
              <div className="text-[#139ED4] mb-4">
                <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#171D4C] dark:text-white mb-2">{t.beneficios.accesoPrioritario.titulo}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{t.beneficios.accesoPrioritario.descripcion}</p>
            </div>
            
            <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-md p-6 rounded-xl shadow-lg border border-[#88D4E4]/30">
              <div className="text-[#139ED4] mb-4">
                <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#171D4C] dark:text-white mb-2">{t.beneficios.productosCertificados.titulo}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{t.beneficios.productosCertificados.descripcion}</p>
            </div>
          </div>
          
          {/* Botón principal de llamada a la acción */}
          <div className="space-y-4">
            <button
              onClick={handleRegisterClick}
              className="inline-flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-[#139ED4] to-[#0D7BA7] text-white text-lg font-semibold rounded-full hover:from-[#0D7BA7] hover:to-[#139ED4] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t.registrarmeAhora}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.beneficiosGratis}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};