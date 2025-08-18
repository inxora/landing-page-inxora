import React, { useState } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { investorSectionTranslation } from './investorSectionTranslation';
import { useSupabaseData } from '../../../../hooks/useSupabase';
import { TrendingUp, Shield, FileText, BarChart3, Eye } from 'lucide-react';

export const InvestorSection = () => {
  const { lang } = useLanguage();
  const t = investorSectionTranslation[lang];
  const { registrarInversionista } = useSupabaseData();
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    telefono_directo: '',
    contrasena: '',
    confirmarContrasena: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError(null);
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validaciones
    if (formData.contrasena !== formData.confirmarContrasena) {
      setError(t.passwordMismatch || 'Las contraseñas no coinciden');
      setIsSubmitting(false);
      return;
    }

    if (formData.contrasena.length < 6) {
      setError(t.passwordLength || 'La contraseña debe tener al menos 6 caracteres');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const result = await registrarInversionista({
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.correo,
        telefono_directo: formData.telefono_directo,
        contrasena: formData.contrasena
      });
      
      if (!result.success) {
        // Traducir errores según el idioma
        const errorMessage = result.error?.message || result.error;
        if (typeof errorMessage === 'string') {
          if (errorMessage.includes('already registered') || errorMessage.includes('ya está registrado')) {
            setError(t.emailExists || 'Este correo ya está registrado en el sistema');
          } else {
            setError(t.registrationError || 'Error al registrar inversionista');
          }
        } else {
          setError(t.unexpectedError || 'Error inesperado. Por favor, intenta nuevamente.');
        }
      } else {
        setIsSubmitted(true);
        // Resetear formulario después de 4 segundos
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ 
            nombre: '', 
            apellidos: '', 
            correo: '', 
            telefono_directo: '',
            contrasena: '',
            confirmarContrasena: ''
          });
        }, 4000);
      }
    } catch (err) {
      setError(t.unexpectedError || 'Error inesperado. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

    const isFormValid = formData.nombre.trim() && 
                       formData.apellidos.trim() && 
                       formData.correo.trim() && 
                       formData.telefono_directo.trim() &&
                       formData.contrasena.trim() &&
                       formData.confirmarContrasena.trim();

  return (
    <section className="py-8 lg:py-12 bg-gradient-to-br from-[#f0f9fd] to-[#e9f6fc] dark:from-dark-bg dark:to-dark-surface">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">
              <span className="text-[#139ED4]">{t.title} </span>
              <span className="text-[#D90E8C]">{t.titleAccent}</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-dark-muted max-w-3xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Información principal consolidada */}
            <div className="space-y-6">
              {/* Propuesta de valor principal */}
              <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-md p-6 rounded-xl shadow-xl border border-gray-100 dark:border-dark-accent">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-8 h-8 text-[#139ED4] mr-3" />
                  <h3 className="font-orbitron font-semibold text-xl text-[#171D4C] dark:text-dark-text">
                    {t.howItWorks}
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-dark-muted mb-6 leading-relaxed">
                  {t.description}
                </p>
                
                {/* Métricas clave */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-[#139ED4]/5 rounded-lg border border-[#139ED4]/20">
                    <div className="text-2xl font-bold text-[#139ED4]">1.5% - 3%</div>
                    <div className="text-sm text-gray-600 dark:text-dark-muted">{t.returns}</div>
                  </div>
                  <div className="text-center p-4 bg-[#D90E8C]/5 rounded-lg border border-[#D90E8C]/20">
                    <div className="text-2xl font-bold text-[#D90E8C]">30-90</div>
                    <div className="text-sm text-gray-600 dark:text-dark-muted">Días promedio</div>
                  </div>
                </div>

                {/* Beneficios clave */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#D90E8C]" />
                    <span className="text-sm text-gray-700 dark:text-dark-muted">{t.securedDesc}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#88D4E4]" />
                    <span className="text-sm text-gray-700 dark:text-dark-muted">{t.flexibleDesc}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700 dark:text-dark-muted">{t.transparentDesc}</span>
                  </div>
                </div>
              </div>

              {/* Proceso simplificado */}
              <div className="bg-gradient-to-r from-[#139ED4]/5 to-[#D90E8C]/5 p-6 rounded-xl border border-gray-100 dark:border-dark-accent">
                <h4 className="font-semibold text-[#171D4C] dark:text-dark-text mb-4 flex items-center">
                  <Eye className="w-5 h-5 text-[#139ED4] mr-2" />
                  {t.processTitle}
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#139ED4] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <span className="text-sm text-gray-700 dark:text-dark-muted">{t.step1Desc}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#D90E8C] text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <span className="text-sm text-gray-700 dark:text-dark-muted">{t.step2Desc}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <span className="text-sm text-gray-700 dark:text-dark-muted">{t.step3Desc}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de registro optimizado */}
            <div className="bg-white dark:bg-dark-surface rounded-xl shadow-xl p-6 border border-gray-100 dark:border-dark-accent">
              {!isSubmitted ? (
                <>
                  <div className="text-center mb-6">
                    <h3 className="font-orbitron font-semibold text-xl text-[#171D4C] dark:text-dark-text mb-2">
                      {t.formTitle}
                    </h3>
                    <p className="text-gray-600 dark:text-dark-muted text-sm">
                      {t.formSubtitle}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                      </div>
                    )}
                    
                    {/* Información sobre el proceso */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                      <div className="flex items-start space-x-2">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                          {t.disclaimer}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-dark-accent rounded-lg focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-muted transition-colors"
                        placeholder={t.namePlaceholder}
                      />
                      <input
                        type="text"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-dark-accent rounded-lg focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-muted transition-colors"
                        placeholder="Apellidos"
                      />
                    </div>

                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-dark-accent rounded-lg focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-muted transition-colors"
                      placeholder={t.emailPlaceholder}
                    />

                    <input
                      type="tel"
                      name="telefono_directo"
                      value={formData.telefono_directo}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-dark-accent rounded-lg focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-muted transition-colors"
                      placeholder={t.phonePlaceholder || "Teléfono"}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="password"
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-dark-accent rounded-lg focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-muted transition-colors"
                        placeholder={t.passwordPlaceholder || "Contraseña"}
                      />
                      <input
                        type="password"
                        name="confirmarContrasena"
                        value={formData.confirmarContrasena}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-dark-accent rounded-lg focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-muted transition-colors"
                        placeholder={t.confirmPasswordPlaceholder || "Confirmar contraseña"}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className="w-full bg-gradient-to-r from-[#139ED4] to-[#88D4E4] hover:from-[#D90E8C] hover:to-[#139ED4] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>{t.submitting}</span>
                        </div>
                      ) : (
                        t.submitButton
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg text-[#171D4C] dark:text-dark-text mb-2">
                    {t.confirmationTitle}
                  </h3>
                  <p className="text-gray-600 dark:text-dark-muted text-sm mb-4">
                    {t.confirmationMessage}
                  </p>
                  
                  {/* Pasos siguientes */}
                  <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 text-left">
                    <h4 className="font-medium text-sm text-[#171D4C] dark:text-dark-text mb-2">Próximos pasos:</h4>
                    <ol className="text-xs text-gray-600 dark:text-dark-muted space-y-1">
                      <li className="flex items-center space-x-2">
                        <span className="w-4 h-4 bg-[#139ED4] text-white rounded-full flex items-center justify-center text-xs">1</span>
                        <span>Revisa tu bandeja de entrada (y spam) - recibirás 2 emails</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-4 h-4 bg-[#D90E8C] text-white rounded-full flex items-center justify-center text-xs">2</span>
                        <span>Haz clic en el enlace de confirmación de cuenta</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-4 h-4 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">3</span>
                        <span>Usa el segundo email para establecer tu contraseña</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-4 h-4 bg-gray-500 text-white rounded-full flex items-center justify-center text-xs">4</span>
                        <span>Accede a tu dashboard con email y tu nueva contraseña</span>
                      </li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
