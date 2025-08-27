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
    <section id="contacto" ref={contactRef} className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-cyan-50 w-full">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Título principal */}
          <h2 className="font-orbitron text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-sm">
            <span className="text-primary">{t.titleMain} </span>
            <span className="text-accent-bright">{t.titleAccent}</span>
          </h2>
          
          {/* Descripción */}
          <p className="font-montserrat text-xl md:text-2xl text-foreground mb-8 max-w-3xl mx-auto">
            {t.description}
          </p>
          
          {/* Beneficios destacados */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-surface rounded-xl shadow-lg border border-border p-6">
              <div className="text-primary mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{t.beneficios.cotizacionesRapidas.titulo}</h3>
              <p className="text-foreground-secondary text-sm">{t.beneficios.cotizacionesRapidas.descripcion}</p>
            </div>
            
            <div className="bg-surface rounded-xl shadow-lg border border-border p-6">
              <div className="text-primary mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{t.beneficios.accesoPrioritario.titulo}</h3>
              <p className="text-foreground-secondary text-sm">{t.beneficios.accesoPrioritario.descripcion}</p>
            </div>
            
            <div className="bg-surface rounded-xl shadow-lg border border-border p-6">
              <div className="text-primary mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{t.beneficios.productosCertificados.titulo}</h3>
              <p className="text-foreground-secondary text-sm">{t.beneficios.productosCertificados.descripcion}</p>
            </div>
          </div>
          
          {/* Botón principal de llamada a la acción */}
          <div className="space-y-4">
            <button
              onClick={handleRegisterClick}
              className="btn-primary text-lg px-12 py-4 rounded-full inline-flex items-center gap-2 hover:scale-105 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {t.registrarmeAhora}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <p className="text-sm text-foreground-muted">
              {t.beneficiosGratis}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};