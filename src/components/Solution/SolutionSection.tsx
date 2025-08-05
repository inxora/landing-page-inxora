import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { solutionSectionTranslation } from './solutionSectionTranslation';
import { Clock, DollarSign, CheckCircle, Headphones } from 'lucide-react';

export const SolutionSection = () => {
  const { lang } = useLanguage();
  const t = solutionSectionTranslation[lang];
  return (
    <section className="py-8 md:py-12 lg:py-16 bg-white w-full">
      {/* Degradado superior para continuidad visual con el Hero */}
      <div className="absolute top-0 left-0 w-full h-14 pointer-events-none" style={{background: 'linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)'}} />
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4 text-center">
            <span className="font-orbitron text-[#171D4C]">{t.titleMain} </span>
            <span className="font-orbitron text-[#D90E8C]">{t.titleAccent}</span>
          </h2>
          <p className="font-montserrat text-lg text-gray-500 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>
        {/* Comparativo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10">
          <div className="bg-[#fbe6f3] rounded-xl shadow p-6 border-l-8 border-[#D90E8C]">
            <h3 className="font-orbitron font-bold text-lg text-[#D90E8C] mb-3">{t.tradicional.title}</h3>
            <ul className="space-y-2">
              {t.tradicional.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2"><span className="text-[#D90E8C] font-bold">✗</span><span className="text-gray-700">{item}</span></li>
              ))}
            </ul>
          </div>
          <div className="bg-[#e9f6fc] rounded-xl shadow p-6 border-l-8 border-[#139ED4]">
            <h3 className="font-orbitron font-bold text-lg text-[#139ED4] mb-3">{t.inxora.title}</h3>
            <ul className="space-y-2">
              {t.inxora.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2"><span className="text-[#139ED4] font-bold">✓</span><span className="text-gray-700">{item}</span></li>
              ))}
            </ul>
          </div>
        </div>
        {/* Beneficios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mt-6 md:mt-8">
          <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-md transition-all duration-200 hover:scale-105 hover:shadow-xl">
            <Clock size={48} className="text-[#D90E8C] mb-2 drop-shadow" />
            <h4 className="font-orbitron font-bold text-[#171D4C] mb-1 text-lg drop-shadow-sm">{t.benefits[0].title}</h4>
            <p className="text-[#139ED4] text-sm">{t.benefits[0].desc}</p>
          </div>
          <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-md transition-all duration-200 hover:scale-105 hover:shadow-xl">
            <DollarSign size={48} className="text-[#139ED4] mb-2 drop-shadow" />
            <h4 className="font-orbitron font-bold text-[#171D4C] mb-1 text-lg drop-shadow-sm">{t.benefits[1].title}</h4>
            <p className="text-[#139ED4] text-sm">{t.benefits[1].desc}</p>
          </div>
          <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-md transition-all duration-200 hover:scale-105 hover:shadow-xl">
            <CheckCircle size={48} className="text-[#88D4E4] mb-2 drop-shadow" />
            <h4 className="font-orbitron font-bold text-[#171D4C] mb-1 text-lg drop-shadow-sm">{t.benefits[2].title}</h4>
            <p className="text-[#139ED4] text-sm">{t.benefits[2].desc}</p>
          </div>
          <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-md transition-all duration-200 hover:scale-105 hover:shadow-xl">
            <Headphones size={48} className="text-[#771A53] mb-2 drop-shadow" />
            <h4 className="font-orbitron font-bold text-[#171D4C] mb-1 text-lg drop-shadow-sm">{t.benefits[3].title}</h4>
            <p className="text-[#139ED4] text-sm">{t.benefits[3].desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
};