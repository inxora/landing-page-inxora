import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { solutionSectionTranslation } from './solutionSectionTranslation';
import { Clock, DollarSign, CheckCircle, Headphones } from 'lucide-react';

export const SolutionSection = () => {
  const { lang } = useLanguage();
  const t = solutionSectionTranslation[lang];
  return (
    <section className="py-8 md:py-12 lg:py-16 bg-white dark:bg-dark-bg w-full">
      {/* Degradado superior para continuidad visual con el Hero */}
      <div className="absolute top-0 left-0 w-full h-14 pointer-events-none" style={{background: 'linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)'}} />
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4 text-center">
            <span className="font-orbitron text-primary-dark dark:text-dark-text">{t.titleMain} </span>
            <span className="font-orbitron text-accent-bright">{t.titleAccent}</span>
          </h2>
          <p className="font-montserrat text-lg text-foreground-secondary max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>
        {/* Comparativo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10">
          <div className="bg-red-50 dark:bg-dark-surface rounded-xl shadow p-6 border-l-8 border-accent-bright">
            <h3 className="font-orbitron font-bold text-lg text-accent-bright mb-3">{t.tradicional.title}</h3>
            <ul className="space-y-2">
              {t.tradicional.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2"><span className="text-accent-bright font-bold">✗</span><span className="text-foreground-secondary">{item}</span></li>
              ))}
            </ul>
          </div>
          <div className="bg-blue-50 dark:bg-dark-accent rounded-xl shadow p-6 border-l-8 border-primary">
            <h3 className="font-orbitron font-bold text-lg text-primary mb-3">{t.inxora.title}</h3>
            <ul className="space-y-2">
              {t.inxora.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2"><span className="text-primary font-bold">✓</span><span className="text-gray-700 dark:text-dark-text">{item}</span></li>
              ))}
            </ul>
          </div>
        </div>
        {/* Beneficios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6 md:mt-8 overflow-hidden px-2">
          {(() => {
            const colors = [
              'var(--color-accent-bright)', // Beneficio 1: Fucsia
              'var(--color-primary)', // Beneficio 2: Azul
              'var(--color-primary-light)', // Beneficio 3: Azul claro
              'var(--color-accent)', // Beneficio 4: Accent
            ];
            return t.benefits.map((benefit, idx) => (
              <div
                key={idx}
                className={`bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-md border border-b-4 transition-all duration-200 flex flex-col hover:shadow-lg text-center`}
                style={{ 
                  borderColor: colors[idx],        // Color sólido para borde perimetral
                  borderBottomColor: colors[idx]   // Color sólido para borde inferior
                }}
              >
                {/* Solo el icono centrado, SIN numeración */}
                <div className="mb-3 flex items-center justify-center">
                  {idx === 0 && <Clock size={36} className="drop-shadow" style={{ color: colors[0] }} />}
                  {idx === 1 && <DollarSign size={36} className="drop-shadow" style={{ color: colors[1] }} />}
                  {idx === 2 && <CheckCircle size={36} className="drop-shadow" style={{ color: colors[2] }} />}
                  {idx === 3 && <Headphones size={36} className="drop-shadow" style={{ color: colors[3] }} />}
                </div>
                <h4 className="font-orbitron text-sm md:text-base font-semibold mb-2 text-primary-dark">
                  {benefit.title}
                </h4>
                <p className="text-primary text-xs md:text-sm leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ));
          })()}
        </div>
      </div>
    </section>
  );
};