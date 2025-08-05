import React from 'react';
import { Shield, Award, TrendingUp, Clock } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useLanguage } from '../../context/LanguageContext';
import { persuasionSectionTranslation } from './persuasionSectionTranslation';

export const PersuasionSection = () => {
  const { lang } = useLanguage();
  const t = persuasionSectionTranslation[lang];
  const clientes = [
    'Logo_Clientes/FARVET.png',
    'Logo_Clientes/FERREYROS.png',
    'Logo_Clientes/ALQUIMODUL.png',
    'Logo_Clientes/TUBOPLAST.png',
    // 'Logo_Clientes/VISTONY.png',
    // 'Logo_Clientes/AUPEU.png',
    'Logo_Clientes/CLOROX.png',
    'Logo_Clientes/MOLITALIA.png',
    'Logo_Clientes/LIMA IMPORT.png',
    'Logo_Clientes/PSA MARINE.png',
    'Logo_Clientes/TAMSHI.png',
  ];
  // Colores para bordes/hover dinámicos
  const borderColors = [
    '#139ED4', '#88D4E4', '#171D4C', '#771A53', '#D90E8C',
    '#139ED4', '#88D4E4', '#171D4C', '#771A53', '#D90E8C', '#139ED4'
  ];
  // Slider para móvil
  const [current, setCurrent] = React.useState(0);
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

  let displayClientes = clientes;
  if (clientes.length <= 10) {
    displayClientes = [...clientes, ...clientes];
  }

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
  return <section id="beneficios" className="py-8 md:py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-[#e9f6fc] w-full scroll-mt-20 md:scroll-mt-32">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 pb-10 md:pb-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4 line-clamp-2 drop-shadow-sm text-center">
            <span className="font-orbitron text-[#171D4C]">{t.titleMain} </span>
            <span className="font-orbitron text-[#D90E8C]">{t.titleAccent}</span>
          </h2>
          <p className="font-montserrat text-lg text-[#139ED4] max-w-3xl mx-auto line-clamp-2 md:line-clamp-none">
            {t.subtitle}
          </p>
        </div>
        {/* Slider responsive de clientes con keen-slider (una sola fila, sin repetición) */}
        <div className="relative mb-8 md:mb-12">
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
            {displayClientes.map((src, idx) => (
              <div
                key={src + idx}
                className="keen-slider__slide flex items-center justify-center transition-all duration-300"
              >
                <img
                  src={`/${src}`}
                  alt={`Cliente ${(idx % clientes.length) + 1}`}
                  className="object-contain w-full h-32 drop-shadow-md"
                  style={{ maxHeight: '120px' }}
                />
              </div>
            ))}
          </div>
        </div>
        {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#88D4E4] hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-[#139ED4] rounded-full flex items-center justify-center text-white font-bold">
                JM
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-[#171D4C]">Juan Mendoza</h4>
                <p className="text-sm text-gray-500">
                  Jefe de Mantenimiento, Minera Andina
                </p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "INXORA nos ha permitido reducir los tiempos de adquisición de
              repuestos críticos. Su asesoría técnica es invaluable para
              nuestras operaciones."
            </p>
            <div className="mt-3 text-[#D90E8C] flex">★★★★★</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#88D4E4] hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-[#139ED4] rounded-full flex items-center justify-center text-white font-bold">
                LC
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-[#171D4C]">Laura Campos</h4>
                <p className="text-sm text-gray-500">
                  Gerente de Compras, Industrias Metálicas
                </p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "La transparencia en los precios y la rapidez de cotización nos
              han ayudado a optimizar nuestro presupuesto de mantenimiento
              anual."
            </p>
            <div className="mt-3 text-[#D90E8C] flex">★★★★★</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#88D4E4] hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-[#139ED4] rounded-full flex items-center justify-center text-white font-bold">
                RP
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-[#171D4C]">Roberto Paredes</h4>
                <p className="text-sm text-gray-500">
                  Director de Operaciones, Textil Peruana
                </p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "El servicio post-venta y seguimiento de INXORA es excepcional.
              Han sido un socio estratégico para nuestra expansión."
            </p>
            <div className="mt-3 text-[#D90E8C] flex">★★★★★</div>
          </div>
        </div> */}
        {/* Sellos de garantía */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {t.seals.map((seal, idx) => (
            <div key={seal.title} className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center hover:shadow-xl transition-all duration-200 hover:scale-105">
              {idx === 0 && <Shield className="text-[#139ED4] mb-2 drop-shadow" size={40} />}
              {idx === 1 && <Award className="text-[#139ED4] mb-2 drop-shadow" size={40} />}
              {idx === 2 && <TrendingUp className="text-[#139ED4] mb-2 drop-shadow" size={40} />}
              {idx === 3 && <Clock className="text-[#139ED4] mb-2 drop-shadow" size={40} />}
              <h4 className="font-semibold mb-1 text-[#171D4C] drop-shadow-sm">{seal.title}</h4>
              <p className="text-sm text-[#139ED4]">{seal.desc}</p>
          </div>
          ))}
        </div>
      </div>
    </section>;
};