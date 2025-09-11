// ProvidersSection.jsx - COMPONENTE ARREGLADO  
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
  
  // Autoplay plugin para keen-slider mejorado
  const autoplay = (options = { delay: 3000, stopOnInteraction: false, pauseOnMouseEnter: true, disableOnInteraction: false }) => (slider: any) => {
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
    mode: "snap",
  }, [autoplay({ delay: 3000, stopOnInteraction: false, pauseOnMouseEnter: true, disableOnInteraction: false })]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Lista de nombres de imágenes
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

  // Triple duplicación para loop infinito suave
  let displayLogos = logos;
  if (logos.length <= 15) {
    displayLogos = [...logos, ...logos, ...logos];
  }

  return <section id="proveedores" className="py-16 bg-white w-full scroll-mt-24 md:scroll-mt-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4 line-clamp-2">
            <span className="text-primary-dark">{t.titleMain} </span>
            <span className="text-accent-bright">{t.titleAccent}</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto line-clamp-2 md:line-clamp-none">
            {t.subtitle}
          </p>
        </div>
        {/* Slider responsive de proveedores con keen-slider */}
        <div className="relative mb-12 overflow-hidden">
          {/* Botones solo visibles en desktop y bien posicionados */}
          <button
            className="hidden lg:flex absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-bright)] text-white rounded-full z-10 transition-all duration-300 hover:scale-110 shadow-lg"
            onClick={() => slider && slider.current && slider.current.prev()}
            aria-label="Anterior"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            className="hidden lg:flex absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-bright)] text-white rounded-full z-10 transition-all duration-300 hover:scale-110 shadow-lg"
            onClick={() => slider && slider.current && slider.current.next()}
            aria-label="Siguiente"
          >
            <ChevronRight size={28} />
          </button>
          <div ref={sliderRef} className="keen-slider transition-all duration-700 ease-in-out">
            {displayLogos.map((src, idx) => (
              <div key={src + idx} className="keen-slider__slide flex items-center justify-center">
                <img src={`/${src}`} alt={`Proveedor ${(idx % logos.length) + 1}`} className="object-contain w-full h-32" style={{ maxHeight: '120px' }} />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            {t.join}
          </p>
          <Link to={getRouteByLang('providersForm', lang)} className="border-2 border-[var(--color-accent-bright)] text-accent-bright px-6 py-3 rounded-md font-medium hover:bg---color-accent-bright hover:text-white transition-all duration-200 inline-block shadow-sm hover:shadow-md hover:-translate-y-1">
            {t.cta}
          </Link>
        </div>
      </div>
    </section>;
};
