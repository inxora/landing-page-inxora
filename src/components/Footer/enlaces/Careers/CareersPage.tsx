import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Users, Truck, Package, Smartphone, Mail } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useSupabaseData } from '../../../../hooks/useSupabase';
import { BackButton } from '../../../common/BackButton';
import { useLanguage } from '../../../../context/LanguageContext';
import { careersTranslation } from './careersTranslation';

const CareersPage = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = careersTranslation[lang];
  const { registrarRecogedor, getTiposVehiculos, getDistritos } = useSupabaseData();

  // Memoizar las funciones para evitar re-renders
  const loadTiposVehiculos = useCallback(getTiposVehiculos, []);
  const loadDistritos = useCallback(getDistritos, []);

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    contrasena: '',
    distrito_id: '',
    vehiculo: '',
    experiencia: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [tiposVehiculos, setTiposVehiculos] = useState<Array<{ id: number; name: string; description: string }>>([]);
  const [distritos, setDistritos] = useState<Array<{ id: number; nombre: string; descripcion?: string }>>([]);
  const [isLoadingVehiculos, setIsLoadingVehiculos] = useState(true);
  const [isLoadingDistritos, setIsLoadingDistritos] = useState(true);

  // Cargar tipos de vehículos y distritos al montar el componente
  useEffect(() => {
    let isMounted = true; // Prevenir actualizaciones si el componente se desmonta
    
    const loadData = async () => {
      try {
        // Cargar tipos de vehículos
        const vehiculos = await loadTiposVehiculos();
        if (isMounted) {
          setTiposVehiculos(vehiculos);
          setIsLoadingVehiculos(false);
        }

        // Cargar distritos
        const distritosData = await loadDistritos();
        if (isMounted) {
          setDistritos(distritosData);
          setIsLoadingDistritos(false);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        if (isMounted) {
          setFeedback({ type: 'error', message: 'Error al cargar datos del formulario' });
          setIsLoadingVehiculos(false);
          setIsLoadingDistritos(false);
        }
      }
    };

    loadData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []); // Dependencias vacías para evitar re-renders innecesarios

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (feedback) setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    // Validaciones básicas simples
    if (!formData.nombre.trim()) {
      setFeedback({ type: 'error', message: 'Por favor ingresa tu nombre' });
      setIsSubmitting(false);
      return;
    }

    if (!formData.correo.trim()) {
      setFeedback({ type: 'error', message: 'Por favor ingresa tu correo' });
      setIsSubmitting(false);
      return;
    }

    if (!formData.telefono.trim()) {
      setFeedback({ type: 'error', message: 'Por favor ingresa tu teléfono' });
      setIsSubmitting(false);
      return;
    }

    if (!formData.contrasena) {
      setFeedback({ type: 'error', message: 'Por favor ingresa una contraseña' });
      setIsSubmitting(false);
      return;
    }

    if (!formData.distrito_id) {
      setFeedback({ type: 'error', message: 'Por favor selecciona tu distrito' });
      setIsSubmitting(false);
      return;
    }

    if (!formData.vehiculo) {
      setFeedback({ type: 'error', message: 'Por favor selecciona tu vehículo' });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await registrarRecogedor({
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.correo,
        telefono: formData.telefono,
        contrasena: formData.contrasena,
        distrito_id: formData.distrito_id,
        vehiculo: formData.vehiculo,
        experiencia: formData.experiencia
      });

      if (result.success) {
        setShowVerificationMessage(true);
        // Limpiar formulario
        setFormData({
          nombre: '',
          apellidos: '',
          correo: '',
          telefono: '',
          contrasena: '',
          distrito_id: '',
          vehiculo: '',
          experiencia: ''
        });
        
        // Mostrar mensaje de éxito
        setFeedback({ 
          type: 'success', 
          message: result.message || 'Registro exitoso' 
        });
      } else {
        // Manejo de errores simple
        setFeedback({ 
          type: 'error', 
          message: result.error || 'Error en el registro' 
        });
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      setFeedback({ type: 'error', message: 'Error inesperado. Por favor, intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fcff] via-[#e9f6fc] to-[#daf2f9] dark:from-dark-bg dark:via-dark-surface dark:to-dark-accent">
      {/* Contenedor principal con padding superior */}
      <div className="pt-32 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Botón Atrás */}
          <div className="mb-12">
            <BackButton onClick={() => navigate('/')} />
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t.title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          {/* Layout principal en grid de 2 columnas */}
          <div className="grid lg:grid-cols-2 gap-8">

            {/* Columna izquierda: Información general */}
            <div className="space-y-6">

              {/* Posición destacada */}
              <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  {t.joinTeam}
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#139ED4] rounded-lg flex items-center justify-center">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t.position}
                  </h2>
                </div>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t.description}
                </p>
              </div>

              {/* Cómo funciona */}
              <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6 text-[#139ED4]" />
                  {t.howItWorks}
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#139ED4] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">1</div>
                    <p className="text-gray-600 dark:text-gray-300">{t.step1}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#139ED4] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">2</div>
                    <p className="text-gray-600 dark:text-gray-300">{t.step2}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#139ED4] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">3</div>
                    <p className="text-gray-600 dark:text-gray-300">{t.step3}</p>
                  </div>
                </div>
              </div>

              {/* Beneficios */}
              <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  {t.benefits}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">{t.benefit1}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">{t.benefit2}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">{t.benefit3}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-orange-600" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">{t.benefit4}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-teal-600" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">{t.benefit5}</span>
                  </div>
                </div>
              </div>

              {/* Zonas */}
              <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-red-600" />
                  {t.zones}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-600 dark:text-gray-300 text-sm">{t.zone1}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-600 dark:text-gray-300 text-sm">{t.zone2}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-600 dark:text-gray-300 text-sm">{t.zone3}</span>
                  </div>
                </div>
              </div>

              {/* Requisitos */}
              <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {t.requirements}
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-gray-600 dark:text-gray-300">{t.requirement1}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-gray-600 dark:text-gray-300">{t.requirement2}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-gray-600 dark:text-gray-300">{t.requirement3}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-gray-600 dark:text-gray-300">{t.requirement4}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-gray-600 dark:text-gray-300">{t.requirement5}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Columna derecha: Formulario */}
            <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 h-fit">
              {!showVerificationMessage ? (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {t.formTitle}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {t.formSubtitle}
                  </p>

                  {feedback && (
                    <div className={`mb-4 p-3 rounded-lg ${feedback.type === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                      : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                      }`}>
                      {feedback.message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder={t.namePlaceholder}
                      />
                      <input
                        type="text"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder={t.lastnamePlaceholder}
                      />
                    </div>

                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder={t.emailPlaceholder}
                    />

                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder={t.phonePlaceholder}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="password"
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder={t.passwordPlaceholder}
                      />
                      <select
                        name="distrito_id"
                        value={formData.distrito_id}
                        onChange={handleInputChange}
                        required
                        disabled={isLoadingDistritos}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {isLoadingDistritos ? 'Cargando distritos...' : 'Selecciona tu distrito'}
                        </option>
                        {distritos.map((distrito) => (
                          <option key={distrito.id} value={distrito.id.toString()}>
                            {distrito.nombre}
                          </option>
                        ))}
                      </select>
                      <select
                        name="vehiculo"
                        value={formData.vehiculo}
                        onChange={handleInputChange}
                        required
                        disabled={isLoadingVehiculos}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {isLoadingVehiculos ? t.loadingVehicles || 'Cargando vehículos...' : t.selectVehicle || 'Selecciona tu vehículo'}
                        </option>
                        {tiposVehiculos.map((vehiculo) => (
                          <option key={vehiculo.id} value={vehiculo.name}>
                            {vehiculo.name} {vehiculo.description && `- ${vehiculo.description}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <textarea
                      name="experiencia"
                      value={formData.experiencia}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      placeholder={t.experiencePlaceholder}
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#139ED4] hover:bg-[#0f7ba3] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? t.submitting : t.submitButton}
                    </button>

                    <div className="text-center">
                      <a
                        href="https://wa.me/51949165670"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                      >
                        <Smartphone className="w-4 h-4" />
                        {t.contactWhatsApp}
                      </a>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      {t.verificationNote}
                    </p>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {t.successTitle}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {t.successMessage}
                  </p>
                  <button
                    onClick={() => setShowVerificationMessage(false)}
                    className="text-[#139ED4] hover:text-[#0f7ba3] font-medium"
                  >
                    {t.registerAnother}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;
