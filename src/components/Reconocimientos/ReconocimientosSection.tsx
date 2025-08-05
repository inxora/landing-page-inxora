import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { reconocimientosSectionTranslation } from './reconocimientosSectionTranslation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

export const ReconocimientosSection = () => {
  const { lang } = useLanguage();
  const t = reconocimientosSectionTranslation[lang];

  // Slider para móvil
  const [sliderRef, slider] = useKeenSlider({
    slides: { perView: 1.2, spacing: 16 },
    loop: true,
    drag: true,
  });

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-white w-full">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="text-center mb-6 md:mb-10 lg:mb-12">
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4 drop-shadow-sm">
            <span className="font-orbitron text-[#171D4C]">{t.titleMain} </span>
            <span className="font-orbitron text-[#D90E8C]">{t.titleAccent}</span>
          </h2>
          <p className="font-montserrat text-lg text-[#139ED4] max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>
        {/* Slider móvil */}
        <div className="md:hidden relative mb-12">
          <button
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#139ED4] to-[#D90E8C] text-white rounded-full z-10 transition-all duration-300 hover:scale-110 shadow-lg"
            onClick={() => slider && slider.current && slider.current.prev()}
            aria-label="Anterior"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#139ED4] to-[#D90E8C] text-white rounded-full z-10 transition-all duration-300 hover:scale-110 shadow-lg"
            onClick={() => slider && slider.current && slider.current.next()}
            aria-label="Siguiente"
          >
            <ChevronRight size={28} />
          </button>
          <div ref={sliderRef} className="keen-slider transition-all duration-500 ease-in-out">
            {t.logos.map((logo, idx) => (
              <div key={idx} className="keen-slider__slide flex items-center justify-center">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-20 max-h-[80px] w-auto object-contain aspect-auto"
                  style={{ maxWidth: 220 }}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Grilla desktop */}
        <div className="w-full hidden md:flex flex-wrap justify-center items-center gap-x-4 md:gap-x-12 gap-y-4">
          {t.logos.map((logo, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center p-0"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-20 md:h-24 lg:h-32 max-h-[80px] md:max-h-[112px] lg:max-h-[128px] w-auto object-contain aspect-auto"
                style={{ maxWidth: 220 }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};