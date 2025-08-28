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

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Configuración responsiva mejorada con más espacio y mejor distribución
  let radius = 280; // desktop - radio más grande para evitar solapamiento
  let bubbleClass = "min-w-[160px] min-h-[120px] px-6 py-5 text-base"; // Burbujas más grandes
  let avatarClass = "w-36 h-36 md:w-44 md:h-44";
  let iconClass = "text-3xl mb-3";
  let containerHeight = "min-h-[700px] md:min-h-[800px]";
  
  if (windowWidth < 1200) {
    radius = 240;
    bubbleClass = "min-w-[140px] min-h-[100px] px-5 py-4 text-sm";
    avatarClass = "w-32 h-32 md:w-36 md:h-36";
    iconClass = "text-2xl mb-3";
    containerHeight = "min-h-[600px] md:min-h-[700px]";
  }
  if (windowWidth < 900) {
    radius = 200; // tablet - más espacio horizontal
    bubbleClass = "min-w-[110px] min-h-[85px] px-4 py-3 text-sm";
    avatarClass = "w-24 h-24 md:w-28 md:h-28";
    iconClass = "text-xl mb-2";
    containerHeight = "min-h-[500px] md:min-h-[600px]";
  }
  if (windowWidth < 600) {
    radius = 160; // móvil - más separación
    bubbleClass = "min-w-[90px] min-h-[70px] px-3 py-2 text-xs";
    avatarClass = "w-20 h-20";
    iconClass = "text-lg mb-2";
    containerHeight = "min-h-[450px]";
  }
  if (windowWidth < 400) {
    radius = 130; // móvil pequeño - ajustado para evitar solapamiento
    bubbleClass = "min-w-[75px] min-h-[60px] px-2 py-2 text-xs";
    avatarClass = "w-16 h-16";
    iconClass = "text-base mb-1";
    containerHeight = "min-h-[380px]";
  }

  // Definición de burbujas con íconos y textos
  const bubbles = [
    { icon: <FaRegComments className={`text-primary ${iconClass}`} />, text: t.cotiza },
    { icon: <FaWhatsapp className={`text-[#25D366] ${iconClass}`} />, text: t.whatsapp },
    { icon: <FaTruck className={`text-primary ${iconClass}`} />, text: t.despachos },
    { icon: <FaHeadset className={`text-[#23B6E7] ${iconClass}`} />, text: t.atencion },
    { icon: <FaFileInvoice className={`text-primary ${iconClass}`} />, text: t.facturas },
  ];

  return (
    <section className="relative w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-[#f7fbfd] flex flex-col items-center overflow-visible">
      <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-bold mb-8 lg:mb-12 text-center max-w-2xl mx-auto text-gray-900">
        <span className="font-montserrat">{lang === 'es' ? 'Conoce a' : lang === 'pt' ? 'Conheça a' : 'Meet'} </span>
        <span className="text-accent-bright font-orbitron">Sara Xora</span>
      </h2>
      
      {/* Contenedor principal con altura suficiente para el pentágono */}
      <div className={`relative flex flex-col items-center justify-center w-full max-w-5xl mx-auto ${containerHeight} px-4`}>
        
        {/* Imagen de Sara centrada */}
        <div className="relative z-20 flex flex-col items-center animate-fade-in">
          <img
            src="/Sara Xora - IA.png"
            alt="Sara Xora, asistente virtual IA"
            loading="lazy"
            className={`${avatarClass} rounded-full object-cover shadow-xl hover:scale-105 transition-transform duration-300 border-4 border-white`}
            style={{ pointerEvents: 'none' }}
          />
        </div>
        
        {/* Contenedor de burbujas posicionadas absolutamente */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          {/* Líneas de conexión */}
          <svg 
            width="100%" 
            height="100%" 
            className="absolute inset-0 z-5"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
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
                  key={`line-${i}`}
                  x1={`calc(50% + ${x1}px)`}
                  y1={`calc(50% + ${y1}px)`}
                  x2={`calc(50% + ${x2}px)`}
                  y2={`calc(50% + ${y2}px)`}
                  stroke="#139ED4"
                  strokeWidth={windowWidth < 600 ? 2 : 3}
                  strokeDasharray="8 8"
                  opacity={0.6}
                  filter="url(#glow)"
                />
              );
            })}
          </svg>
          
          {/* Burbujas posicionadas */}
          {bubbles.map((bubble, i) => {
            const angle = angles[i];
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            
            return (
              <div
                key={`bubble-${i}`}
                className="absolute z-10"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                  animation: `bubbleAppear 0.8s ease-out ${i * 0.15}s both`,
                }}
              >
                <Bubble {...bubble} bubbleClass={bubbleClass} />
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Botón de contacto moderno */}
      <a
        href="https://wa.me/946885531?text=Hola%2C%20estoy%20interesado%20en%20cotizar%20productos%20industriales"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 bg-gradient-to-r from-[#139ED4] to-[#23B6E7] text-white px-10 py-4 rounded-full font-semibold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 text-lg flex items-center gap-3 z-30 relative"
      >
        <FaWhatsapp className="text-2xl" />
        {t.cta}
      </a>
      
      {/* Estilos CSS para animaciones */}
      <style>{`
        @keyframes bubbleAppear {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
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
          animation: hop 2.5s ease-in-out infinite;
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
            transform: translate(-50%, -50%) scale(2.5);
            opacity: 0;
          }
        }
      `}</style>
      
      {/* BOTÓN FLOTANTE DE SARA CONVERTIDO A ENLACE WHATSAPP */}
      <a
        href="https://wa.me/946885531?text=Hola%2C%20quiero%20hablar%20con%20Sara%20Xora%2C%20el%20asistente%20virtual%20de%20INXORA"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-32 md:bottom-24 right-6 md:right-8 z-50 bg-gradient-to-r from-[#139ED4] to-[#0A7FA4] shadow-2xl rounded-full p-4 md:p-5 border-3 border-white hover:shadow-3xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#139ED4]/40 group chat-button animate-hop inline-flex items-center justify-center"
        aria-label="Hablar con Sara por WhatsApp"
      >
        <img
          src="./logo_inxora/LOGO-07.png"
          alt="Logo de Inxora - Sara el conejo asistente"
          className="w-14 h-14 md:w-16 md:h-16 rounded-full object-contain transition-transform duration-300 group-hover:scale-110"
          style={{ pointerEvents: 'none' }}
        />
        
        {/* Indicador de disponibilidad */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#25D366] rounded-full border-2 border-white animate-pulse shadow-lg"></div>
      </a>
    </section>
  );
};

// Componente burbuja reutilizable mejorado
const Bubble = ({ icon, text, bubbleClass }: { icon: React.ReactNode; text: string; bubbleClass: string }) => (
  <div className={`flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl ${bubbleClass} text-center text-gray-800 font-semibold transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:bg-white pointer-events-auto select-none border border-gray-100 cursor-pointer group`}>
    <div className="group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <span className="leading-tight font-medium">{text}</span>
  </div>
);

export default SaraXoraSection;