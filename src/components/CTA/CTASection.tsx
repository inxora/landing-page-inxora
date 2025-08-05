import { ContactForm } from './ClientForm';
import { useLanguage } from '../../context/LanguageContext';
import { ctaSectionTranslation } from './ctaSectionTranslation';
import { useEffect, useRef } from 'react';

export const CTASection = () => {
  const { lang } = useLanguage();
  const t = ctaSectionTranslation[lang];
  const contactRef = useRef<HTMLElement>(null);

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
    <section id="contacto" ref={contactRef} className="py-8 md:py-12 lg:py-16 bg-gradient-to-br from-[#f0f9fd] to-[#e9f6fc] w-full min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start w-full">
        <div className="flex flex-col w-full md:w-1/2 mb-6 md:mb-0">
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-center mb-4 mt-0 md:mt-0 drop-shadow-sm">
              <span className="font-orbitron text-[#139ED4]">{t.titleMain} </span>
              <span className="font-orbitron text-[#D90E8C]">{t.titleAccent}</span>
            </h2>
            <p className="font-montserrat text-lg text-[#139ED4] mb-6">
              {t.description}
            </p>
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-md mb-2 border-l-8 border-[#88D4E4] transition-all duration-200 hover:shadow-xl hover:border-[#D90E8C]">
              <h3 className="font-orbitron font-semibold mb-3 text-[#171D4C] drop-shadow-sm">{t.queObtendras}</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="text-[#139ED4] mr-3 text-xl font-bold">✓</span>
                  <span className="text-[#171D4C]">{t.cotizacion}</span>
                </li>
                <li className="flex items-center">
                  <span className="text-[#139ED4] mr-3 text-xl font-bold">✓</span>
                  <span className="text-[#171D4C]">{t.asesoria}</span>
                </li>
                <li className="flex items-center">
                  <span className="text-[#139ED4] mr-3 text-xl font-bold">✓</span>
                  <span className="text-[#171D4C]">{t.precios}</span>
                </li>
                <li className="flex items-center">
                  <span className="text-[#139ED4] mr-3 text-xl font-bold">✓</span>
                  <span className="text-[#171D4C]">{t.seguimiento}</span>
                </li>
              </ul>
            </div>
            <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-sm mb-6 transition-all duration-200 hover:shadow-lg">
              <img src="/Sara Xora - IA.png" alt="Asesora IA INXORA" className="h-20 w-20 rounded-full object-cover border-4 border-[#D90E8C] shadow-lg" />
              <div>
                <p className="font-medium text-[#171D4C]">{t.hablarDirecto}</p>
                <p className="text-[#D90E8C] font-bold text-lg">{t.telefono}</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <ContactForm />
          </div>
        </div>
      </section>
  );
};