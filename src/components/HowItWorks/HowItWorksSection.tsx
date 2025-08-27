import { ClipboardList, FileText, TruckIcon, HeadsetIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { howItWorksSectionTranslation } from './howItWorksSectionTranslation';
export const HowItWorksSection = () => {
  const { lang } = useLanguage();
  const t = howItWorksSectionTranslation[lang];
  return <section id="comoFunciona" className="py-8 md:py-12 lg:py-16 bg-white dark:bg-dark-bg w-full scroll-mt-20 md:scroll-mt-32">
    <div className="container mx-auto px-3 sm:px-4 lg:px-8">
      <div className="text-center mb-6 md:mb-10 lg:mb-12">
        <h2 className="font-orbitron text-2xl md:text-4xl font-bold text-primary-dark dark:text-dark-text mb-2 md:mb-4 line-clamp-2 drop-shadow-sm">
          <span className="font-orbitron text-primary-dark dark:text-dark-text">{t.titleMain} </span>
          <span className="font-orbitron text-accent-bright">{t.titleAccent}</span>
        </h2>
        <p className="font-montserrat text-base md:text-lg text-primary dark:text-primary-light max-w-3xl mx-auto line-clamp-2 md:line-clamp-none">
          {t.subtitle}
        </p>
      </div>
      {/* Colores para cada card: icono, borde y número */}
      {(() => {
        const colors = [
          'var(--color-accent-bright)', // Paso 1: Fucsia
          'var(--color-primary)', // Paso 2: Azul
          'var(--color-primary-light)', // Paso 3
          'var(--color-accent)', // Paso 4
        ];
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {t.steps.map((step, idx) => (
              <div
                key={step.title}
                className={`bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md p-6 rounded-xl shadow-md border-b-4 relative transition-all duration-200 min-h-[220px] flex flex-col hover:scale-105 hover:shadow-xl`}
                style={{ borderBottomColor: '#fff' }}
              >
                <div
                  className="absolute -top-3 -left-3 text-white h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center font-bold text-base md:text-lg shadow-md"
                  style={{ background: colors[idx] }}
                >
                  {idx + 1}
                </div>
                <div className="mb-4 pt-6 flex items-center justify-center">
                  {idx === 0 && <ClipboardList size={44} className="drop-shadow" style={{ color: colors[0] }} />}
                  {idx === 1 && <FileText size={44} className="drop-shadow" style={{ color: colors[1] }} />}
                  {idx === 2 && <TruckIcon size={44} className="drop-shadow" style={{ color: colors[2] }} />}
                  {idx === 3 && <HeadsetIcon size={44} className="drop-shadow" style={{ color: colors[3] }} />}
                </div>
                <h3 className="font-orbitron text-base md:text-lg font-semibold mb-2 text-primary-dark dark:text-dark-text line-clamp-2 drop-shadow-sm">
                  {step.title}
                </h3>
                <p className="text-primary dark:text-primary-light text-sm md:text-base line-clamp-3 md:line-clamp-none flex-1">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        );
      })()}
      <div className="mt-8 md:mt-12 text-center">
        <a href="#contacto" className="bg-primary text-white px-4 md:px-6 py-2 md:py-3 rounded-md font-medium hover:bg-[var(--color-accent-bright)] transition-all duration-200 inline-block shadow-md hover:shadow-lg text-sm md:text-base hover:scale-105">
          {t.cta}
        </a>
      </div>
    </div>
  </section>;
}