import { ContactForm } from './ClientForm';
import { registerPageTranslation } from './registerPageTranslation';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../common/BackButton';

export const RegisterPage = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const t = registerPageTranslation[lang];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-dark-bg dark:to-dark-surface">
      {/* Contenedor principal con padding superior para evitar superposición con header */}
      <div className="pt-20 pb-10">
        {/* Botón Atrás - posicionado a la izquierda y con margen del header */}
        <div className="container mx-auto px-4 lg:px-8 mt-8 md:mt-12 lg:mt-16 mb-8">
          <div className="max-w-6xl mx-auto">
            <BackButton 
              onClick={() => navigate(-1)}
              size="lg"
              className="px-6 py-3 shadow-lg backdrop-blur-sm"
              customText={t.volver}
            />
          </div>
        </div>
        
        {/* Contenido principal - Layout horizontal */}
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              
              {/* Columna izquierda - Información y beneficios */}
              <div className="lg:sticky lg:top-8">
                {/* Header de la página */}
                <div className="text-center lg:text-left mb-8">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#171D4C] dark:text-white mb-4">
                    {t.uneteA} <span className="text-[#139ED4]">{t.inxora}</span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-2">
                    {t.plataformaLider}
                  </p>
                  <p className="text-md text-gray-500 dark:text-gray-400">
                    {t.registrateParaCotizar}
                  </p>
                </div>
                
                {/* Beneficios */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-[#171D4C] dark:text-white mb-6">
                    {t.porQueRegistrarte}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-lg border border-gray-200 dark:border-dark-accent">
                      <div className="flex items-start space-x-4">
                        <div className="text-[#139ED4] flex-shrink-0">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1h-6a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1h-6a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[#171D4C] dark:text-white mb-2">
                            {t.cotizacionesRapidas.titulo}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            {t.cotizacionesRapidas.descripcion}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-lg border border-gray-200 dark:border-dark-accent">
                      <div className="flex items-start space-x-4">
                        <div className="text-[#139ED4] flex-shrink-0">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[#171D4C] dark:text-white mb-2">
                            {t.accesoPrioritario.titulo}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            {t.accesoPrioritario.descripcion}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-lg border border-gray-200 dark:border-dark-accent">
                      <div className="flex items-start space-x-4">
                        <div className="text-[#139ED4] flex-shrink-0">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[#171D4C] dark:text-white mb-2">
                            {t.productosCertificados.titulo}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            {t.productosCertificados.descripcion}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Columna derecha - Formulario de registro */}
              <div className="lg:max-w-2xl">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
