import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const loaderTranslation = {
  es: "Cargando...",
  en: "Loading...",
  pt: "Carregando..."
};

const Loader = () => {
  const { lang } = useLanguage();
  const t = loaderTranslation[lang];
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen bg-white flex items-center justify-center z-[9999] transition-opacity duration-700 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-3">
        {/* Conejo SVG animado */}
        <svg
          className="w-24 h-24 animate-bounceRabbit"
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <image href="logo_inxora/LOGO-03.svg" width="128" height="128" />
        </svg>

        {/* Líneas animadas */}
        <div className="flex items-center justify-center gap-2">
          <span className="block h-2 w-24 bg-[#139ED4] rounded-full animate-pathline" />
          <span className="block h-2 w-16 bg-[#88D4E4] rounded-full animate-pathline" />
          <span className="block h-2 w-10 bg-[#D90E8C] rounded-full animate-pathline" />
        </div>

        {/* Texto de carga */}
        <span className="text-[#139ED4] text-base font-medium animate-pulse">
          {t}
        </span>
      </div>

      <style>{`
        @keyframes bounceRabbit {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-bounceRabbit {
          animation: bounceRabbit 0.7s infinite cubic-bezier(.4,0,.2,1);
        }
        @keyframes pathline {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
        .animate-pathline {
          animation: pathline 1.2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Loader;
