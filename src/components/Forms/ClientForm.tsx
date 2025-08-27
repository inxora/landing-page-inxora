import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { clientFormTranslation } from './clientFormTranslation';
import { useSupabaseData } from '../../hooks/useSupabase';
import { useTranslatedRubros } from '../../hooks/useTranslatedRubros';

const API_TOKEN = '2118121196497c1c1cc6dfbe5dc1342b7edba43c9f9ba855fd5f7a68ab2db781';

const allowedFileTypes = {
  // Documentos
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/vnd.ms-excel': '.xls',
  'text/csv': '.csv',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  // Imágenes
  'image/jpeg': '.jpg,.jpeg',
  'image/png': '.png'
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB en bytes

export const ContactForm = () => {
  const { lang } = useLanguage();
  const t = clientFormTranslation[lang];
  const { getPaises, getRubros, getTiposCliente, insertCliente, uploadClienteFiles } = useSupabaseData();
  
  const [clientType, setClientType] = useState<'PERSONA_NATURAL' | 'EMPRESA'>('EMPRESA');
  
  // Estados para datos de referencia
  const [paises, setPaises] = useState<any[]>([]);
  const [rubros, setRubros] = useState<any[]>([]);
  const [tiposCliente, setTiposCliente] = useState<any[]>([]);
  const [paisSeleccionado, setPaisSeleccionado] = useState<any>(null);
  
  // Hook para traducir rubros automáticamente
  const { rubrosTraducidos, isTranslating } = useTranslatedRubros(rubros);
  
  // Formulario según estructura de BD
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    contrasena: '',
    razon_social: '',
    documento_personal: '',
    documento_empresa: '',
    id_rubro: 1, // Default: primer rubro disponible
    id_tipo_cliente: 2, // Default: EMPRESA
    id_pais: 1, // Default: Perú
    activo: true
  });
  
  const [files, setFiles] = useState<File[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiFeedback, setApiFeedback] = useState<{ type: 'loading' | 'error' | 'success'; message: string } | null>(null);
  const [nombreBloqueado, setNombreBloqueado] = useState(false);
  const [razonBloqueada, setRazonBloqueada] = useState(false);

  // Cargar datos de referencia al montar el componente
  useEffect(() => {
    const cargarDatosReferencia = async () => {
      try {
        const [paisesData, rubrosData, tiposData] = await Promise.all([
          getPaises(),
          getRubros(),
          getTiposCliente()
        ]);
        
        setPaises(paisesData);
        setRubros(rubrosData);
        setTiposCliente(tiposData);
        
        // Establecer país por defecto (Perú)
        const peru = paisesData.find(p => p.iso_code_2 === 'PE');
        if (peru) {
          setPaisSeleccionado(peru);
          setFormData(prev => ({ ...prev, id_pais: peru.id }));
        }
        
        // Establecer rubro por defecto si hay rubros disponibles
        if (rubrosData.length > 0) {
          setFormData(prev => ({ ...prev, id_rubro: rubrosData[0].id }));
        }
      } catch (error) {
        console.error('Error al cargar datos de referencia:', error);
      }
    };
    
    cargarDatosReferencia();
  }, []);

  // Actualizar país seleccionado cuando cambia el formulario
  useEffect(() => {
    const pais = paises.find(p => p.id === formData.id_pais);
    setPaisSeleccionado(pais);
  }, [formData.id_pais, paises]);

  // Actualizar tipo de cliente cuando cambia
  useEffect(() => {
    const tipoCliente = tiposCliente.find(t => t.nombre === clientType);
    if (tipoCliente) {
      setFormData(prev => ({ ...prev, id_tipo_cliente: tipoCliente.id }));
    }
  }, [clientType, tiposCliente]);

  // Manejar consulta SUNAT para RUC
  const consultarSunat = async (ruc: string) => {
    try {
      setApiFeedback({ type: 'loading', message: t.consultandoSunat });
      
      const response = await fetch(`https://apiperu.dev/api/ruc/${ruc}`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(t.errorSunat);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        const empresa = data.data;
        
        // Actualizar campos con datos de SUNAT
        setFormData(prev => ({
          ...prev,
          razon_social: empresa.nombre_o_razon_social || '',
        }));
        
        setRazonBloqueada(true);
        setApiFeedback({ type: 'success', message: t.datosObtenidosSunat });
        
        setTimeout(() => {
          setApiFeedback(null);
        }, 3000);
      } else {
        throw new Error(t.rucNoEncontrado);
      }
    } catch (error) {
      console.error('Error al consultar SUNAT:', error);
      setApiFeedback({ 
        type: 'error', 
        message: t.noPudoConsultarRuc 
      });
      
      setTimeout(() => {
        setApiFeedback(null);
      }, 3000);
    }
  };

  // Manejar consulta RENIEC para DNI
  const consultarReniec = async (dni: string) => {
    try {
      setApiFeedback({ type: 'loading', message: t.consultandoReniec });
      
      const response = await fetch(`https://apiperu.dev/api/dni/${dni}`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(t.errorReniec);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        const persona = data.data;
        
        // Actualizar campos con datos de RENIEC
        setFormData(prev => ({
          ...prev,
          nombre: persona.nombres || '',
          apellidos: `${persona.apellido_paterno || ''} ${persona.apellido_materno || ''}`.trim(),
        }));
        
        setNombreBloqueado(true);
        setApiFeedback({ type: 'success', message: t.datosObtenidosReniec });
        
        setTimeout(() => {
          setApiFeedback(null);
        }, 3000);
      } else {
        throw new Error(t.dniNoEncontrado);
      }
    } catch (error) {
      console.error('Error al consultar RENIEC:', error);
      setApiFeedback({ 
        type: 'error', 
        message: t.noPudoConsultarDni 
      });
      
      setTimeout(() => {
        setApiFeedback(null);
      }, 3000);
    }
  };

  const validateFile = (file: File): string | null => {
    // Validar tipo de archivo
    if (!allowedFileTypes[file.type as keyof typeof allowedFileTypes]) {
      return `Tipo de archivo inválido: ${file.name}`;
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return `Archivo muy grande: ${file.name}`;
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles: File[] = [];
    const errors: string[] = [];

    selectedFiles.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setFeedback({ type: 'error', message: errors.join(', ') });
      setTimeout(() => setFeedback(null), 5000);
    }

    setFiles(prev => {
      const newFiles = [...prev, ...validFiles];
      // Limitar a máximo 10 archivos según validación
      if (newFiles.length > 10) {
        setFeedback({ type: 'error', message: 'Máximo 10 archivos permitidos' });
        setTimeout(() => setFeedback(null), 5000);
        return prev;
      }
      return newFiles;
    });

    // Limpiar el input
    if (e.target) {
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    // Validaciones según tipo de cliente
    if (clientType === 'PERSONA_NATURAL') {
      if (!formData.documento_personal.trim()) {
        setFeedback({ type: 'error', message: 'El documento personal es obligatorio.' });
        setSubmitting(false);
        return;
      }
    } else {
      if (!formData.documento_empresa.trim() || !formData.razon_social.trim()) {
        setFeedback({ type: 'error', message: 'El documento de empresa y razón social son obligatorios.' });
        setSubmitting(false);
        return;
      }
    }

    // Validar campos comunes
    if (!formData.nombre.trim() || !formData.apellidos.trim() || !formData.correo.trim() || !formData.contrasena.trim()) {
      setFeedback({ type: 'error', message: 'Nombre, apellidos, correo y contraseña son obligatorios.' });
      setSubmitting(false);
      return;
    }

    // Validar contraseña mínima
    if (formData.contrasena.length < 6) {
      setFeedback({ type: 'error', message: 'La contraseña debe tener al menos 6 caracteres.' });
      setSubmitting(false);
      return;
    }

    try {
      // Preparar datos para inserción en Supabase
      const clienteData = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.correo,
        telefono: formData.telefono,
        contrasena: formData.contrasena,
        razon_social: clientType === 'EMPRESA' ? formData.razon_social : null,
        documento_personal: clientType === 'PERSONA_NATURAL' ? formData.documento_personal : null,
        documento_empresa: clientType === 'EMPRESA' ? formData.documento_empresa : null,
        id_rubro: formData.id_rubro && formData.id_rubro > 0 ? formData.id_rubro : (rubros.length > 0 ? rubros[0].id : 1),
        id_tipo_cliente: formData.id_tipo_cliente,
        id_pais: formData.id_pais,
        activo: true
      };

      const result = await insertCliente(clienteData);
      
      if (result.success) {
        const clienteId = result.data?.[0]?.id;
        
        // Subir archivos si existen
        if (files.length > 0) {
          try {
            const uploadResult = await uploadClienteFiles(files, clienteId);
            
            if (uploadResult.success) {
              setFeedback({ 
                type: 'success', 
                message: `¡Registro exitoso! 🎉 Ya puedes cotizar productos con ${uploadResult.archivos?.length || 0} archivo(s) adjunto(s). Cuando el marketplace esté disponible, podrás iniciar sesión con tu correo y contraseña.` 
              });
            } else {
              setFeedback({ 
                type: 'warning', 
                message: '¡Registro exitoso! 🎉 Hubo un problema al subir algunos archivos, pero ya puedes cotizar productos.' 
              });
            }
          } catch (uploadError) {
            console.error('Error al subir archivos:', uploadError);
            // No bloquear el registro por error en archivos
            setFeedback({ 
              type: 'warning', 
              message: '¡Registro exitoso! 🎉 Hubo un problema al subir algunos archivos, pero ya puedes cotizar productos.' 
            });
          }
        } else {
          setFeedback({ 
            type: 'success', 
            message: '¡Registro exitoso! 🎉 Ya puedes cotizar productos. Cuando el marketplace esté disponible, podrás iniciar sesión con tu correo y contraseña.' 
          });
        }
        
        // Limpiar formulario
        setFormData({
          nombre: '',
          apellidos: '',
          correo: '',
          telefono: '',
          contrasena: '',
          razon_social: '',
          documento_personal: '',
          documento_empresa: '',
          id_rubro: rubros.length > 0 ? rubros[0].id : 1,
          id_tipo_cliente: 2,
          id_pais: 1,
          activo: true
        });
        
        setFiles([]);
        setNombreBloqueado(false);
        setRazonBloqueada(false);
        
      } else {
        throw new Error('Error al registrar el cliente');
      }
      
    } catch (error) {
      console.error('Error en el envío:', error);
      setFeedback({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Error al registrar el cliente. Intenta nuevamente.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-8 lg:p-12 max-w-4xl mx-auto">
      {/* Header del formulario */}
      <div className="mb-10">
        <h3 className="text-2xl lg:text-3xl font-bold text-primary-dark mb-3 text-center">
          {t.title || 'Solicita tu Cotización'}
        </h3>
        
        {/* Mensaje informativo */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-700">
              <p className="font-medium">{t.cotizaProductosInstante}</p>
              <p className="text-xs text-blue-600 mt-1">Acceso al marketplace más completo disponible</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información del País */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label htmlFor="pais" className="block text-sm font-semibold text-gray-700 mb-3">
                {t.pais} <span className="text-red-500">*</span>
              </label>
              <select
                id="pais"
                value={formData.id_pais}
                onChange={(e) => setFormData(prev => ({ ...prev, id_pais: parseInt(e.target.value) }))}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 shadow-sm transition-all duration-200"
                required
              >
                <option value="">{t.seleccionarPais}</option>
                {paises.map(pais => (
                  <option key={pais.id} value={pais.id}>
                    {pais.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tipo de Cliente */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            {t.tipoCliente || 'Tipo de Cliente'} <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <label className="flex items-center p-5 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary hover:bg-blue-50 transition-all duration-200 bg-white shadow-sm">
              <input
                type="radio"
                value="PERSONA_NATURAL"
                checked={clientType === 'PERSONA_NATURAL'}
                onChange={(e) => setClientType(e.target.value as 'PERSONA_NATURAL' | 'EMPRESA')}
                className="mr-4 text-primary w-5 h-5"
              />
              <div>
                <span className="font-semibold text-gray-900 text-base">{t.persona}</span>
              </div>
            </label>
            <label className="flex items-center p-5 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary hover:bg-blue-50 transition-all duration-200 bg-white shadow-sm">
              <input
                type="radio"
                value="EMPRESA"
                checked={clientType === 'EMPRESA'}
                onChange={(e) => setClientType(e.target.value as 'EMPRESA')}
                className="mr-4 text-primary w-5 h-5"
              />
              <div>
                <span className="font-semibold text-gray-900 text-base">{t.empresa}</span>
              </div>
            </label>
          </div>
        </div>

        {/* Documento Personal (para personas) */}
        {clientType === 'PERSONA_NATURAL' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label htmlFor="documentoPersonal" className="block text-sm font-semibold text-gray-700 mb-3">
                  {paisSeleccionado?.nombre_doc_personal || 'Documento Personal'} <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    id="documentoPersonal"
                    value={formData.documento_personal}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({ ...prev, documento_personal: value }));
                      
                      // Auto-consulta si es DNI peruano y tiene 8 dígitos
                      if (paisSeleccionado?.iso_code_2 === 'PE' && value.length === 8 && /^\d{8}$/.test(value)) {
                        consultarReniec(value);
                      }
                    }}
                    pattern={paisSeleccionado?.patron_doc_personal || ''}
                    placeholder={`Ingrese su ${paisSeleccionado?.nombre_doc_personal || 'documento'}`}
                    className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 shadow-sm transition-all duration-200"
                    required
                  />
                  {paisSeleccionado?.iso_code_2 === 'PE' && (
                    <button
                      type="button"
                      onClick={() => formData.documento_personal && consultarReniec(formData.documento_personal)}
                      disabled={!formData.documento_personal || formData.documento_personal.length !== 8}
                      className="px-6 py-4 bg-primary text-white rounded-xl hover:bg-[#0D7BA7] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                    >
                      {t.consultar}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documento Empresa (para empresas) */}
        {clientType === 'EMPRESA' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label htmlFor="documentoEmpresa" className="block text-sm font-semibold text-gray-700 mb-3">
                  {paisSeleccionado?.nombre_doc_empresa || 'Documento Empresa'} <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    id="documentoEmpresa"
                    value={formData.documento_empresa}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({ ...prev, documento_empresa: value }));
                      
                      // Auto-consulta si es RUC peruano y tiene 11 dígitos
                      if (paisSeleccionado?.iso_code_2 === 'PE' && value.length === 11 && /^\d{11}$/.test(value)) {
                        consultarSunat(value);
                      }
                    }}
                    pattern={paisSeleccionado?.patron_doc_empresa || ''}
                    placeholder={`Ingrese su ${paisSeleccionado?.nombre_doc_empresa || 'documento'}`}
                    className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 shadow-sm transition-all duration-200"
                    required
                  />
                  {paisSeleccionado?.iso_code_2 === 'PE' && (
                    <button
                      type="button"
                      onClick={() => formData.documento_empresa && consultarSunat(formData.documento_empresa)}
                      disabled={!formData.documento_empresa || formData.documento_empresa.length !== 11}
                      className="px-6 py-4 bg-primary text-white rounded-xl hover:bg-[#0D7BA7] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                    >
                      {t.consultar}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Información Personal */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-3">
                {t.nombre} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={(e) => !nombreBloqueado && setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                className={`w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 shadow-sm transition-all duration-200 ${nombreBloqueado ? 'bg-gray-100' : ''}`}
                placeholder="Ingrese su nombre"
                required
                readOnly={nombreBloqueado}
              />
            </div>

            <div>
              <label htmlFor="apellidos" className="block text-sm font-semibold text-gray-700 mb-3">
                {t.apellido} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="apellidos"
                value={formData.apellidos}
                onChange={(e) => !nombreBloqueado && setFormData(prev => ({ ...prev, apellidos: e.target.value }))}
                className={`w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 shadow-sm transition-all duration-200 ${nombreBloqueado ? 'bg-gray-100' : ''}`}
                placeholder="Ingrese sus apellidos"
                required
                readOnly={nombreBloqueado}
              />
            </div>
          </div>
        </div>

        {/* Razón Social (para empresas) */}
        {clientType === 'EMPRESA' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <label htmlFor="razonSocial" className="block text-sm font-semibold text-gray-700 mb-3">
              {t.razonSocial || 'Razón Social'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="razonSocial"
              value={formData.razon_social}
              onChange={(e) => !razonBloqueada && setFormData(prev => ({ ...prev, razon_social: e.target.value }))}
              className={`w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 shadow-sm transition-all duration-200 ${razonBloqueada ? 'bg-gray-100' : ''}`}
              placeholder="Ingrese la razón social"
              required
              readOnly={razonBloqueada}
            />
          </div>
        )}

        {/* Rubro */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <label htmlFor="rubroEmpresa" className="block text-sm font-semibold text-gray-700 mb-3">
            {clientType === 'EMPRESA' ? (t.rubroEmpresa || 'Rubro de la Empresa') : (t.sectorInteres || 'Sector de Interés')}
            {clientType === 'EMPRESA' && <span className="text-red-500"> *</span>}
          </label>
          <select
            id="rubroEmpresa"
            value={formData.id_rubro}
            onChange={(e) => setFormData(prev => ({ ...prev, id_rubro: parseInt(e.target.value) }))}
            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 shadow-sm transition-all duration-200"
            required={clientType === 'EMPRESA'}
            disabled={isTranslating}
          >
            {isTranslating ? (
              <option value="">Traduciendo rubros...</option>
            ) : (
              rubrosTraducidos.map(rubro => (
                <option key={rubro.id} value={rubro.id}>
                  {rubro.nombre}
                </option>
              ))
            )}
          </select>
          {isTranslating && (
            <div className="mt-3 text-sm text-blue-600 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Traduciendo opciones...
            </div>
          )}
        </div>

        {/* Información de contacto */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Información de Contacto</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label htmlFor="correo" className="block text-sm font-semibold text-gray-700 mb-3">
                {t.correo || 'Correo Electrónico'} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="correo"
                value={formData.correo}
                onChange={(e) => setFormData(prev => ({ ...prev, correo: e.target.value }))}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 shadow-sm transition-all duration-200"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div>
              <label htmlFor="contrasena" className="block text-sm font-semibold text-gray-700 mb-3">
                {t.contrasena || 'Contraseña'} <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="contrasena"
                value={formData.contrasena}
                onChange={(e) => setFormData(prev => ({ ...prev, contrasena: e.target.value }))}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 shadow-sm transition-all duration-200"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>
          </div>
        </div>

        {/* Teléfono */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700 mb-3">
            {t.telefono || 'Teléfono'}
          </label>
          <div className="flex gap-4">
            {paisSeleccionado && (
              <span className="px-4 py-4 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-700 font-medium min-w-[100px] text-center">
                {paisSeleccionado.prefijo_telefonico}
              </span>
            )}
            <input
              type="tel"
              id="telefono"
              value={formData.telefono}
              onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
              pattern={paisSeleccionado?.patron_telefono || ''}
              className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 shadow-sm transition-all duration-200"
              placeholder="Número de teléfono"
            />
          </div>
        </div>

        {/* Archivos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            {t.subirArchivos || 'Archivos de Requerimiento'}
          </label>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-blue-50 transition-all duration-200"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-gray-500">
              <svg className="mx-auto h-16 w-16 mb-4 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-base font-medium text-gray-700 mb-2">{t.elegirArchivos || 'Elegir archivos'}</p>
              <p className="text-sm text-gray-500">{t.formatos || 'Excel, PDF, Word, imágenes'}</p>
              <p className="text-xs text-gray-400 mt-2">Arrastra y suelta o haz clic para seleccionar</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.xlsx,.xls,.csv,.doc,.docx,.jpg,.jpeg,.png"
              className="hidden"
            />
          </div>

          {/* Lista de archivos seleccionados */}
          {files.length > 0 && (
            <div className="mt-6 space-y-3 max-h-48 overflow-y-auto">
              <h5 className="text-sm font-semibold text-gray-700">Archivos seleccionados:</h5>
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <svg className="h-6 w-6 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 transition-colors ml-3 p-1 hover:bg-red-50 rounded"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feedback de APIs */}
        {apiFeedback && (
          <div className={`p-6 rounded-xl border ${
            apiFeedback.type === 'loading' ? 'bg-blue-50 text-blue-800 border-blue-200' :
            apiFeedback.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' :
            'bg-yellow-50 text-yellow-800 border-yellow-200'
          }`}>
            {apiFeedback.type === 'loading' && (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-800 mr-3"></div>
                <span className="font-medium">{apiFeedback.message}</span>
              </div>
            )}
            {apiFeedback.type !== 'loading' && (
              <span className="font-medium">{apiFeedback.message}</span>
            )}
          </div>
        )}

        {/* Feedback general */}
        {feedback && (
          <div className={`p-6 rounded-xl border ${
            feedback.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 
            feedback.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
            'bg-red-50 text-red-800 border-red-200'
          }`}>
            <span className="font-medium">{feedback.message}</span>
          </div>
        )}

        {/* Botón de envío */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-[#0D7BA7] text-white font-bold py-5 px-8 rounded-xl transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                {t.enviando || 'Enviando...'}
              </>
            ) : (
              t.registrarmeAhora || 'Registrarme Ahora'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};