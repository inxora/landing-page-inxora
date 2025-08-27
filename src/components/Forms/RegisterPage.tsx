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
    <div className="min-h-screen bg-gray-50">
      {/* Contenedor principal con padding superior para evitar superposición con header */}
      <div className="pt-20 pb-10">
        
        {/* Contenido principal - Layout horizontal responsive */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
              
              {/* Columna izquierda - Información y beneficios */}
              <div className="lg:col-span-2 lg:sticky lg:top-8">
                {/* Header de la página */}
                <div className="text-center lg:text-left mb-8">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-primary-dark mb-4 leading-tight">
                    {t.uneteA} <span className="text-primary">{t.inxora}</span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 mb-3 leading-relaxed">
                    {t.plataformaLider}
                  </p>
                  <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                    {t.registrateParaCotizar}
                  </p>
                </div>
                
                {/* Beneficios */}
                <div className="space-y-6">
                  <h2 className="text-xl md:text-2xl font-bold text-primary-dark mb-6">
                    {t.porQueRegistrarte}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="text-primary flex-shrink-0 bg-blue-50 p-2 rounded-lg">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1h-6a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1h-6a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-primary-dark mb-2">
                            {t.cotizacionesRapidas.titulo}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {t.cotizacionesRapidas.descripcion}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="text-primary flex-shrink-0 bg-blue-50 p-2 rounded-lg">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-primary-dark mb-2">
                            {t.accesoPrioritario.titulo}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {t.accesoPrioritario.descripcion}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="text-primary flex-shrink-0 bg-blue-50 p-2 rounded-lg">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-primary-dark mb-2">
                            {t.productosCertificados.titulo}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {t.productosCertificados.descripcion}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Columna derecha - Formulario de registro */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
