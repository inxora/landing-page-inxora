import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useLanguage } from '../../context/LanguageContext';
import { productsSectionTranslation } from './productsSectionTranslation';
import { footerTranslations } from '../Footer/footerTranslations';

export const ProductsSection = () => {
  const { lang } = useLanguage();
  const t = productsSectionTranslation[lang];
  const tf = footerTranslations[lang];
  const categories = [
    {
      name: tf.iluminacion,
      imageUrl: '/categorias_productos/ILUMINACION INDUSTRIAL.jpg',
    },
    {
      name: tf.componentes,
      imageUrl: '/categorias_productos/COMPONENTES ELECTRICO.jpeg',
    },
    {
      name: tf.instrumentacion,
      imageUrl: '/categorias_productos/INSTRUMENTACION Y MEDICION.jpeg',
    },
    {
      name: tf.neumatica,
      imageUrl: '/categorias_productos/NEUMATICA E HIDRAULICA.jpeg',
    },
    {
      name: tf.herramientas,
      imageUrl: '/categorias_productos/HERRAMIENTAS Y MANIOBRAS.jpg',
    },
    {
      name: tf.mecanica,
      imageUrl: '/categorias_productos/MECANICA INDUSTRIAL.jpeg',
    },
    {
      name: tf.valvulas,
      imageUrl: '/categorias_productos/VALVULAS Y MANGUERAS.jpeg',
    },
    {
      name: tf.limpieza,
      imageUrl: '/categorias_productos/LIMPIEZA Y ADITIVOS.jpeg',
    },
  ];

  // Triple duplicación para loop infinito suave
  let displayCategories = categories;
  if (categories.length <= 8) {
    displayCategories = [...categories, ...categories, ...categories];
  }

  // Autoplay plugin para keen-slider mejorado y más rápido
  const autoplay = (options = { delay: 2000, stopOnInteraction: false, pauseOnMouseEnter: true, disableOnInteraction: false }) => (slider: any) => {
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
      '(min-width: 1024px)': {
        slides: { perView: 4, spacing: 24 },
      },
    },
    loop: true,
    drag: true,
    mode: "snap",
  }, [autoplay({ delay: 2000, stopOnInteraction: false, pauseOnMouseEnter: true, disableOnInteraction: false })]);

  // Reinicializa el slider cuando cambie el idioma
  useEffect(() => {
    if (slider && slider.current) {
      slider.current.update();
      slider.current.moveToIdx(0);
    }
  }, [lang]);

  return (
    <section id="productos" className="py-8 md:py-12 lg:py-16 bg-gray-50 w-full scroll-mt-20 md:scroll-mt-32">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4 line-clamp-2">
            <span className="font-orbitron text-primary-dark">{t.titleMain} </span>
            <span className="font-orbitron text-accent-bright">{t.titleAccent}</span>
          </h2>
          <p className="font-montserrat text-lg text-foreground-secondary max-w-3xl mx-auto line-clamp-2 md:line-clamp-none">
            {t.subtitle}
          </p>
        </div>
        {/* Slider responsive con keen-slider */}
        <div className="relative mb-6 md:mb-10 lg:mb-12 overflow-hidden">
          {/* Botones solo visibles en desktop */}
          <button
            className="hidden lg:flex absolute -left-12 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-bright)] text-white rounded-full z-20 transition-all duration-200 hover:scale-110 shadow-lg hover:shadow-xl"
            onClick={() => slider && slider.current && slider.current.prev()}
            aria-label="Anterior"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="hidden lg:flex absolute -right-12 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-bright)] text-white rounded-full z-20 transition-all duration-200 hover:scale-110 shadow-lg hover:shadow-xl"
            onClick={() => slider && slider.current && slider.current.next()}
            aria-label="Siguiente"
          >
            <ChevronRight size={24} />
          </button>
          <div ref={sliderRef} className="keen-slider transition-all duration-500 ease-in-out" key={lang}>
            {displayCategories.map((cat, idx) => (
              <div key={cat.name + idx} className="keen-slider__slide flex flex-col">
                <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border-t-4 border-[var(--color-accent)] hover:border-[var(--color-accent-bright)] flex flex-col h-full transform hover:scale-105">
                  <div className="aspect-square overflow-hidden flex items-center justify-center">
                    <img 
                      src={cat.imageUrl} 
                      alt={cat.name}
                      loading="lazy"
                      className="w-full h-full object-contain drop-shadow-md"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-orbitron text-sm md:text-2xl font-bold text-center text-primary-dark break-words break-keep whitespace-normal drop-shadow-sm max-w-[12ch] mx-auto">
                      {cat.name}
                    </h3>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 mt-auto">
                    <a 
                      href="/Folleto INXORA.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-orbitron text-accent hover:text-accent-bright font-medium flex items-center justify-center transition-all duration-200 hover:scale-105 text-xs md:text-base px-2 py-1 md:px-6 md:py-3"
                    >
                      {t.verProductos} <ChevronRight size={16} className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-8">
          <a href="/Folleto INXORA.pdf" target="_blank" rel="noopener noreferrer" className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-[var(--color-primary-dark)] transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl hover:scale-105">
            {t.verCatalogo} <ChevronRight size={20} className="ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
}