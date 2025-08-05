import React from "react";
import { useLanguage } from '../../context/LanguageContext';
import { saraSectionTranslation } from './saraSectionTranslation';
import { FaRegComments, FaWhatsapp, FaTruck, FaHeadset, FaFileInvoice } from 'react-icons/fa';

export const SaraXoraSection = () => {
  const { lang } = useLanguage();
  const t = saraSectionTranslation[lang];

  // Ángulos optimizados para pentágono con mejor distribución horizontal
  const angles = [-90, -18, 54, 126, 198]; // Pentágono con mejor separación horizontal

  // Responsividad: radio y tamaño de burbujas según ancho de pantalla
  const [windowWidth, setWindowWidth] = React.useState(1024);
  const [showScrollButton, setShowScrollButton] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Detectar scroll para mostrar/ocultar botón
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Configuración responsiva mejorada con más espacio y mejor distribución
  let radius = 260; // desktop - radio aún más grande
  let bubbleClass = "min-w-[120px] min-h-[90px] px-4 py-3 text-base";
  let avatarClass = "w-32 h-32 md:w-40 md:h-40";
  let iconClass = "text-2xl mb-2";
  let containerHeight = "min-h-[650px] md:min-h-[750px]";
  
  if (windowWidth < 900) {
    radius = 190; // tablet - más espacio horizontal
    bubbleClass = "min-w-[100px] min-h-[75px] px-3 py-2 text-sm";
    avatarClass = "w-20 h-20 md:w-24 md:h-24";
    iconClass = "text-xl mb-1";
    containerHeight = "min-h-[500px]";
  }
  if (windowWidth < 600) {
    radius = 145; // móvil - más separación
    bubbleClass = "min-w-[85px] min-h-[65px] px-2 py-1.5 text-xs";
    avatarClass = "w-16 h-16";
    iconClass = "text-lg mb-1";
    containerHeight = "min-h-[400px]";
  }
  if (windowWidth < 400) {
    radius = 115; // móvil pequeño - ajustado para evitar solapamiento
    bubbleClass = "min-w-[70px] min-h-[55px] px-2 py-1 text-xs";
    avatarClass = "w-14 h-14";
    iconClass = "text-base mb-1";
    containerHeight = "min-h-[350px]";
  }

  // Definición de burbujas con íconos y textos
  const bubbles = [
    { icon: <FaRegComments className={`text-[#139ED4] ${iconClass}`} />, text: t.cotiza },
    { icon: <FaWhatsapp className={`text-[#D90E8C] ${iconClass}`} />, text: t.whatsapp },
    { icon: <FaTruck className={`text-[#139ED4] ${iconClass}`} />, text: t.despachos },
    { icon: <FaHeadset className={`text-[#D90E8C] ${iconClass}`} />, text: t.atencion },
    { icon: <FaFileInvoice className={`text-[#139ED4] ${iconClass}`} />, text: t.facturas },
  ];

  // Mantener siempre el pentágono, nunca usar grid
  const useGrid = false;

  // Función para scroll hacia arriba
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative w-full py-10 md:py-16 px-2 sm:px-4 lg:px-8 bg-[#f7fbfd] flex flex-col items-center overflow-visible min-h-[400px] md:min-h-[520px] lg:min-h-[600px]">
      <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-bold mb-4 line-clamp-2 text-center max-w-2xl mx-auto">
        <span className="font-montserrat">{lang === 'es' ? 'Conoce a' : lang === 'pt' ? 'Conheça a' : 'Meet'} </span>
        <span className="text-[#D90E8C] font-orbitron">Sara Xora</span>
      </h2>
      
      {/* Contenedor principal con altura suficiente para el pentágono */}
      <div className={`relative flex flex-col items-center justify-center w-full max-w-4xl mx-auto ${containerHeight} px-0 sm:px-4`}> {/* padding extra para evitar desbordes */}
        
        {/* Imagen de Sara centrada - sin texto debajo */}
        <div className="relative z-10 flex flex-col items-center animate-fade-in">
          <img
            src="/Sara Xora - IA.png"
            alt="Sara Xora, asistente virtual IA"
            loading="lazy"
            className={`${avatarClass} rounded-full object-cover shadow-lg hover:scale-105 transition-transform duration-300 border-0`}
            style={{ pointerEvents: 'none' }}
          />
        </div>
        
        {/* Burbujas en pentágono alrededor de Sara + líneas de conexión */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none w-full h-full">
          <svg width="100%" height="100%" className="absolute left-0 top-0 z-0" style={{overflow: 'visible', pointerEvents: 'none'}}>
            {bubbles.map((_, i) => {
              const angle1 = angles[i];
              const angle2 = angles[(i + 1) % bubbles.length];
              const rad1 = (angle1 * Math.PI) / 180;
              const rad2 = (angle2 * Math.PI) / 180;
              const x1 = Math.cos(rad1) * radius;
              const y1 = Math.sin(rad1) * radius;
              const x2 = Math.cos(rad2) * radius;
              const y2 = Math.sin(rad2) * radius;
              return (
                <line
                  key={i}
                  x1={`calc(50% + ${x1}px)`}
                  y1={`calc(50% + ${y1}px)`}
                  x2={`calc(50% + ${x2}px)`}
                  y2={`calc(50% + ${y2}px)`}
                  stroke="#88D4E4"
                  strokeWidth={3}
                  strokeDasharray="6 6"
                  opacity={0.7}
                />
              );
            })}
          </svg>
          <div className="w-full h-full relative">
            {bubbles.map((b, i) => {
              const angle = angles[i];
              const rad = (angle * Math.PI) / 180;
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;
              
              // Dar más padding interno a la burbuja de WhatsApp (índice 1)
              const isWhatsAppBubble = i === 1;
              const customBubbleClass = isWhatsAppBubble 
                ? bubbleClass.replace(/px-\d+/, 'px-6').replace(/py-\d+(\.5)?/, 'py-4')
                : bubbleClass;
              
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2,
                    // Animación de aparición escalonada
                    animation: `fadeInScale 0.6s ease-out ${i * 0.1}s both`,
                  }}
                >
                  <Bubble {...b} bubbleClass={customBubbleClass} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Botón de contacto moderno */}
      <a
        href="https://wa.me/946885531?text=Hola%2C%20estoy%20interesado%20en%20cotizar%20productos%20industriales"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 bg-gradient-to-r from-[#139ED4] to-[#D90E8C] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-all duration-300 text-lg flex items-center gap-2 z-20 relative"
      >
        <FaWhatsapp className="text-2xl" />
        {t.cta}
      </a>
      
      {/* Estilos CSS para animaciones */}
      <style>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        /* Animación de salto para el conejo */
        @keyframes hop {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-8px) rotate(-2deg);
          }
          50% {
            transform: translateY(-12px) rotate(0deg);
          }
          75% {
            transform: translateY(-4px) rotate(2deg);
          }
        }
        
        .animate-hop {
          animation: hop 2s ease-in-out infinite;
        }

        /* Efecto de ondas al hacer hover en el botón flotante */
        .chat-button:hover::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          background: rgba(19, 158, 212, 0.2);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          animation: ripple 0.6s ease-out;
        }
        
        @keyframes ripple {
          to {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
      `}</style>
      
      {/* Botón flotante a la izquierda para ir al inicio - solo visible cuando hay scroll */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 md:bottom-6 left-6 z-50 bg-white text-[#139ED4] px-5 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 border-2 border-[#139ED4]"
          aria-label="Ir al inicio"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
        </button>
      )}

      {/* BOTÓN FLOTANTE DE SARA MEJORADO - Con animación de salto del conejo */}
      <button
        className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-[#171D4C] shadow-xl rounded-full p-3 border border-[#139ED4]/30 hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#139ED4]/50 group chat-button animate-hop"
        aria-label="Abrir chat con Sara"
        onClick={() => {/* Aquí puedes abrir el chat de Sara */}}
      >
        <img
          src="./logo_inxora/LOGO-03.png"
          alt="Logo de Inxora - Sara el conejo asistente"
          className="w-14 h-14 md:w-16 md:h-16 rounded-full object-contain transition-transform duration-300 group-hover:scale-110"
          style={{ pointerEvents: 'none' }}
        />
        
        {/* Indicador de disponibilidad */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
      </button>
    </section>
  );
};

// Componente burbuja reutilizable mejorado - más rectangular
const Bubble = ({ icon, text, bubbleClass }: { icon: React.ReactNode; text: string; bubbleClass: string }) => (
  <div className={`flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm shadow-lg rounded-2xl ${bubbleClass} text-center text-[#171D4C] font-medium transition-all duration-300 hover:scale-110 hover:shadow-xl pointer-events-auto select-none border-0 cursor-pointer`}>
    {icon}
    <span className="leading-tight">{text}</span>
  </div>
);

export default SaraXoraSection;