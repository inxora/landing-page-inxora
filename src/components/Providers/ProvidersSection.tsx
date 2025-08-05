import React, { useEffect } from 'react';
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { providersSectionTranslation } from './providersSectionTranslation';
import { getRouteByLang } from '../types/routes';

export const ProvidersSection = () => {
  const { lang } = useLanguage();
  const t = providersSectionTranslation[lang];
  // Autoplay plugin para keen-slider
  const autoplay = (options = { delay: 3000, stopOnInteraction: false, pauseOnMouseEnter: true }) => (slider: any) => {
    let timeout: ReturnType<typeof setTimeout>;
    let mouseOver = false;
    function clearNextTimeout() {
      clearTimeout(timeout);
    }
    function nextTimeout() {
      clearTimeout(timeout);
      if (mouseOver && options.pauseOnMouseEnter) return;
      timeout = setTimeout(() => {
        if (slider) slider.next();
      }, options.delay);
    }
    slider.on("created", () => {
      slider.container.addEventListener("mouseenter", () => {
        mouseOver = true;
        clearNextTimeout();
      });
      slider.container.addEventListener("mouseleave", () => {
        mouseOver = false;
        nextTimeout();
      });
      nextTimeout();
    });
    slider.on("dragStarted", clearNextTimeout);
    slider.on("animationEnded", nextTimeout);
    slider.on("updated", nextTimeout);
  };

  const [sliderRef, slider] = useKeenSlider({
    slides: { perView: 2.2, spacing: 16 },
    breakpoints: {
      '(min-width: 768px)': {
        slides: { perView: 5, spacing: 24 },
      },
    },
    loop: true,
    drag: true,
  }, [autoplay({ delay: 3000, stopOnInteraction: false, pauseOnMouseEnter: true })]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Lista de nombres de imágenes (ajusta según tus archivos reales)
  const logos = [
    'Logo_Proveedores/KARCHER.png',
    'Logo_Proveedores/MILWAUKEE.png',
    'Logo_Proveedores/MAKITA.png',
    'Logo_Proveedores/MITUTOYO.png',
    'Logo_Proveedores/TOSCANO.png',
    'Logo_Proveedores/SKF.png',
    'Logo_Proveedores/RIDGID.png',
    'Logo_Proveedores/CONEXLED.png',
    'Logo_Proveedores/PHOENIX CONTACT.png',
    'Logo_Proveedores/ADELSYSTEM.png',
    'Logo_Proveedores/TEKOX.png',   
    'Logo_Proveedores/WIHA.png',
    'Logo_Proveedores/INDECO.png',
    'Logo_Proveedores/BAHCO.png',
    'Logo_Proveedores/VAINSA.png',
  ];

  return <section id="proveedores" className="py-16 bg-white w-full scroll-mt-24 md:scroll-mt-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#171D4C] mb-4 line-clamp-2">
            <span className="text-[#171D4C]">{t.titleMain} </span>
            <span className="text-[#D90E8C]">{t.titleAccent}</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto line-clamp-2 md:line-clamp-none">
            {t.subtitle}
          </p>
        </div>
        {/* Slider responsive de proveedores con keen-slider */}
        <div className="relative mb-12">
          <button
            className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#139ED4] to-[#D90E8C] text-white rounded-full z-10 transition-all duration-300 hover:scale-110 shadow-lg"
            onClick={() => slider && slider.current && slider.current.prev()}
            aria-label="Anterior"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#139ED4] to-[#D90E8C] text-white rounded-full z-10 transition-all duration-300 hover:scale-110 shadow-lg"
            onClick={() => slider && slider.current && slider.current.next()}
            aria-label="Siguiente"
          >
            <ChevronRight size={28} />
          </button>
          <div ref={sliderRef} className="keen-slider transition-all duration-500 ease-in-out">
            {logos.map((src, idx) => (
              <div key={src} className="keen-slider__slide flex items-center justify-center">
                <img src={`/${src}`} alt={`Proveedor ${idx+1}`} className="object-contain w-full h-32" style={{ maxHeight: '120px' }} />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            {t.join}
          </p>
          <Link to={getRouteByLang('providersForm', lang)} className="border-2 border-[#D90E8C] text-[#D90E8C] px-6 py-3 rounded-md font-medium hover:bg-[#139ED4] hover:text-white transition-all duration-200 inline-block shadow-sm hover:shadow-md hover:scale-105">
            {t.cta}
          </Link>
        </div>
      </div>
    </section>;
};