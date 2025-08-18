import { InvestorSection } from './InvestorSection';
import { investorSectionTranslation } from './investorSectionTranslation';
import { useLanguage } from '../../../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../../../common/BackButton';

export const InvestorPage = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const t = investorSectionTranslation[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      {/* Contenedor principal con padding superior para evitar superposición con header */}
      <div className="pt-32 pb-10">
        {/* Botón Atrás - posicionado a la izquierda y con margen del header */}
        <div className="container mx-auto px-4 lg:px-8 mb-12">
          <div className="max-w-6xl mx-auto">
            <BackButton 
              onClick={() => navigate(-1)}
              size="lg"
              className="px-6 py-3 shadow-lg backdrop-blur-sm"
            />
          </div>
        </div>
        
        {/* Sección principal de inversores */}
        <InvestorSection />
      </div>
    </div>
  );
};
