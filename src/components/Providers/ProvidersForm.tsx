import React, { useRef, useState, useLayoutEffect } from 'react';
import Select from 'react-select';
import { useLanguage } from '../../context/LanguageContext';
import { providersFormTranslation } from './providersFormTranslation';
import { useNavigate } from 'react-router-dom';

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

export const ProveedorForm = () => {
  const { lang } = useLanguage();
  const t = providersFormTranslation[lang];
  const navigate = useNavigate();
  const [enviado, setEnviado] = useState(false);
  const [ofreceCredito, setOfreceCredito] = useState("");
  const [condicionesCredito, setCondicionesCredito] = useState("");
  const [entrega, setEntrega] = useState('');
  const [soporteOpciones, setSoporteOpciones] = useState<string[]>([]);
  const [otroEntrega, setOtroEntrega] = useState('');
  const [otroSoporte, setOtroSoporte] = useState('');
  const [soporteEquipoComercial, setSoporteEquipoComercial] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para cada campo del formulario
  const [correo, setCorreo] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [ruc, setRuc] = useState("");
  const [direccion, setDireccion] = useState("");
  const [contacto, setContacto] = useState("");
  const [correoContacto, setCorreoContacto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [marcas, setMarcas] = useState("");
  const [soporteTecnico, setSoporteTecnico] = useState("");
  const [minimoPedido, setMinimoPedido] = useState("");
  const [comentarios, setComentarios] = useState("");
  const API_TOKEN = '2118121196497c1c1cc6dfbe5dc1342b7edba43c9f9ba855fd5f7a68ab2db781';
  const [apiFeedback, setApiFeedback] = useState<{ type: 'loading' | 'error' | 'success'; message: string } | null>(null);
  const [direccionBloqueada, setDireccionBloqueada] = useState(false);
  const [razonSocialBloqueado, setRazonSocialBloqueado] = useState(false);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Validaciones
  const validate = () => {
    if (!razonSocial.trim()) return t.validaciones.razonSocial;
    if (!ruc.trim()) return t.validaciones.ruc;
    if (!direccion.trim()) return t.validaciones.direccion;
    if (!contacto.trim()) return t.validaciones.contacto;
    if (!correoContacto.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) return t.validaciones.correoContacto;
    if (!telefono.trim()) return t.validaciones.telefono;
    if (!telefono.match(/^[0-9]{9}$/)) return t.validaciones.telefonoFormato;
    if (!marcas.trim()) return t.validaciones.marcas;
    if (!soporteTecnico) return t.validaciones.soporteTecnico;
    if (files.length > 5) return t.validaciones.maxArchivos;
    for (const file of files) {
      if (!Object.keys(allowedFileTypes).includes(file.type)) {
        return t.validaciones.archivoNoPermitido.replace('{file}', file.name);
      }
    }
    return null;
  };

  const validateFile = (file: File): string | null => {
    // Validar tipo de archivo
    if (!Object.keys(allowedFileTypes).includes(file.type)) {
      return t.validaciones.tipoArchivo.replace('{file}', file.name);
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return t.validaciones.tamanoArchivo.replace('{file}', file.name);
    }

    // Validar nombre de archivo - permitir caracteres especiales comunes
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s_\-.()'´]+$/.test(file.name)) {
      return t.validaciones.nombreArchivo.replace('{file}', file.name);
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    
    // Validar número máximo de archivos
    if (selected.length + files.length > 5) {
      setFeedback({ type: 'error', message: t.validaciones.maxArchivos });
      return;
    }

    // Validar cada archivo
    for (const file of selected) {
      const error = validateFile(file);
      if (error) {
        setFeedback({ type: 'error', message: error });
        return;
      }
    }

    setFiles(prev => [...prev, ...selected]);
    setFeedback(null);
  };

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  // Función para convertir archivo a base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  // Envío del formulario usando FormData

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const error = validate();
    if (error) {
      setFeedback({ type: 'error', message: error });
      return;
    }
    setSubmitting(true);

    try {
      // Convertir archivos a base64
      const filesBase64 = await Promise.all(
        files.map(async (file) => {
          const error = validateFile(file);
          if (error) {
            throw new Error(error);
          }
          return {
            name: file.name,
            type: file.type,
            content: await fileToBase64(file)
          };
        })
      );

      // Crear el objeto de datos exactamente como lo espera el script
      const formData = {
        'Dirección de correo electrónico': correo,
        'Razón Social:': razonSocial,
        'RUC:': ruc,
        'Dirección:': direccion,
        'Nombre del Contacto:': contacto,
        'Correo:': correoContacto,
        'Teléfono:': telefono,
        'Marcas que representa:': marcas,
        'Cuenta con soporte técnico para asesoramiento de productos:': soporteTecnico,
        'Ofrece crédito:': ofreceCredito,
        'Condiciones de crédito:': condicionesCredito,
        'Cantidad mínima por pedido o monto mínimo:': minimoPedido,
        'Entrega en oficina o recojo en almacén:': entrega,
        'Capacitación o soporte para equipo comercial:': soporteEquipoComercial.join(', '),
        files: filesBase64  // Agregamos los archivos en base64
      };

      console.log('Enviando formulario...');
      const response = await fetch('https://script.google.com/macros/s/AKfycby2RF9uulrlRekwPqGc7UnIz0asXsnsZ_ztpqE2fL_odlInYk37RIM8JZSZ-FIKwuIz/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      // Debido a que estamos usando mode: 'no-cors', no podemos acceder a la respuesta JSON
      // En su lugar, asumimos éxito si la solicitud se completa
      if (response.type === 'opaque') {
        setEnviado(true);
        setFeedback({ type: 'success', message: 'Formulario enviado con éxito.' });
        formRef.current?.reset();
        setFiles([]);
        // Limpiar todos los estados
        setRazonSocial('');
        setRuc('');
        setDireccion('');
        setContacto('');
        setCorreoContacto('');
        setTelefono('');
        setMarcas('');
        setSoporteTecnico('');
        setOfreceCredito('');
        setCondicionesCredito('');
        setMinimoPedido('');
        setEntrega('');
        setSoporteEquipoComercial([]);
      } else {
        throw new Error('Error al enviar el formulario');
      }
    } catch (error) {
      console.error('Error:', error);
      setFeedback({ 
        type: 'error', 
        message: `Error al enviar el formulario: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSoporteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setSoporteOpciones([...soporteOpciones, value]);
    } else {
      setSoporteOpciones(soporteOpciones.filter((op) => op !== value));
    }
  };

  const opcionesSoporte = t.opcionesSoporte.map((label: string) => ({ value: label, label }));

  const handleApiLookupRuc = async () => {
    if (ruc.length !== 11) {
      setApiFeedback(null);
      return;
    }
    setApiFeedback({ type: 'loading', message: 'Buscando datos de SUNAT...' });
    try {
      const response = await fetch('https://apiperu.dev/api/ruc', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({ ruc })
      });
      if (response.status === 429 || response.status === 403) {
        setApiFeedback({ type: 'error', message: 'El servicio de autocompletado está temporalmente no disponible. Por favor, ingresa los datos manualmente.' });
        setRazonSocialBloqueado(false);
        setDireccionBloqueada(false);
        return;
      }
      const result = await response.json();
      if (result.success && result.data) {
        setRuc(result.data.ruc || ruc);
        setRazonSocial(result.data.nombre_o_razon_social || '');
        setDireccion(result.data.direccion_completa || result.data.direccion || '');
        setDireccionBloqueada(true);
        setRazonSocialBloqueado(true);
        setApiFeedback({ type: 'success', message: 'Datos autocompletados con éxito.' });
      } else if (result.message && result.message.toLowerCase().includes('límite')) {
        setApiFeedback({ type: 'error', message: 'El servicio de autocompletado está temporalmente no disponible. Por favor, ingresa los datos manualmente.' });
        setRazonSocialBloqueado(false);
        setDireccionBloqueada(false);
      } else {
        throw new Error(result.message || 'No se encontraron datos para el RUC ingresado.');
      }
    } catch (error) {
      setApiFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Error desconocido' });
      setRazonSocialBloqueado(false);
      setDireccionBloqueada(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#f8fcff] via-[#e9f6fc] to-[#daf2f9] dark:from-dark-bg dark:via-dark-surface dark:to-dark-accent pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      {/* Contenedor principal con mejor spacing */}
      <div className="max-w-5xl mx-auto">
        {/* Botón Atrás mejorado - más separado del header */}
        <div className="mb-12 ml-0">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gray-800/90 text-white border-2 border-gray-600 rounded-full hover:bg-[#139ED4] hover:border-[#139ED4] transition-all duration-300 font-medium shadow-lg backdrop-blur-sm"
            aria-label={t.atras || 'Volver atrás'}
          >
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {(t.atras || 'Atrás').replace('← ', '')}
          </button>
        </div>

        {/* Tarjeta principal del formulario */}
        <div className="bg-white/95 dark:bg-dark-surface/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          {/* Header del formulario */}
          <div className="bg-gradient-to-r from-[#139ED4] to-[#D90E8C] p-8 text-center">
            <img src="/logo_inxora/LOGO-01.png" alt="Logo INXORA" className="w-32 mx-auto mb-6 drop-shadow-xl filter brightness-110" />
            <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide drop-shadow-lg">
              <span className="block mb-1">{t.titulo}</span>
              <span className="block text-yellow-300">{t.subtitulo}</span>
            </h1>
          </div>

          {/* Contenido del formulario */}
          <div className="p-6 sm:p-8 md:p-10">
            {/* Introducción mejorada */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-dark-accent/30 dark:to-purple-900/20 border-l-4 border-gradient-to-b from-[#139ED4] to-[#D90E8C] rounded-r-xl p-6 mb-8 shadow-sm">
              <div className="space-y-4">
                <div>
                  <h3 className="flex items-center gap-2 font-bold text-gray-800 dark:text-white text-lg mb-2">
                    🤝 <span>{t.introTitulo}</span>
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t.introLinea1}</p>
                </div>
                
                <div>
                  <h3 className="flex items-center gap-2 font-bold text-gray-800 dark:text-white text-lg mb-2">
                    🧾 <span>{t.introQuienes}</span>
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{t.introQuienesDesc}</p>
                  <ul className="space-y-1 ml-4">
                    {t.introQuienesBullets.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-[#139ED4] font-medium">
                        <span className="w-1.5 h-1.5 bg-[#139ED4] rounded-full mt-2 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="flex items-center gap-2 font-bold text-gray-800 dark:text-white text-lg mb-2">
                    🔍 <span>{t.introQueBuscamos}</span>
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{t.introQueBuscamosDesc}</p>
                  <ul className="space-y-1 ml-4">
                    {t.introQueBuscamosBullets.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-[#D90E8C] font-medium">
                        <span className="w-1.5 h-1.5 bg-[#D90E8C] rounded-full mt-2 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="flex items-center gap-2 font-bold text-gray-800 dark:text-white text-lg mb-2">
                    ✅ <span>{t.introQueNecesitamos}</span>
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t.introQueNecesitamosDesc}</p>
                </div>
              </div>
            </div>

            {/* Formulario mejorado */}
            {!enviado ? (
              <form ref={formRef} className="space-y-8" onSubmit={handleSubmit}>
            {/* Sección 1 – Datos de la empresa */}
            <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-dark-surface/50 dark:to-dark-accent/30 rounded-xl p-6 border border-blue-200/30 dark:border-blue-600/20 shadow-sm">
              <h2 className="text-xl font-bold text-[#139ED4] mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#139ED4] text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                {t.datosEmpresa}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t.razonSocial} <span className="text-red-500">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    placeholder={t.razonSocial + ' (se autocompletará con el RUC)'} 
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                    value={razonSocial} 
                    onChange={e => setRazonSocial(e.target.value)}
                    autoComplete="organization"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t.ruc} <span className="text-red-500">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    placeholder={t.ruc} 
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                    value={ruc} 
                    onChange={e => setRuc(e.target.value)}
                    onBlur={handleApiLookupRuc}
                    autoComplete="off"
                    maxLength={11}
                    pattern="[0-9]{11}"
                    readOnly={!!razonSocial}
                  />
                </div>
                
                {apiFeedback && (
                  <div className={`col-span-full p-4 rounded-lg border text-sm font-medium
                    ${apiFeedback.type === 'loading' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300' : ''}
                    ${apiFeedback.type === 'error' ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300' : ''}
                    ${apiFeedback.type === 'success' ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300' : ''}`}>
                    {apiFeedback.message}
                  </div>
                )}
                
                <div className="lg:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t.direccion} <span className="text-red-500">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    placeholder={t.direccion + ' (se autocompletará con el RUC)'} 
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                    value={direccion} 
                    onChange={e => setDireccion(e.target.value)}
                    autoComplete="street-address"
                    readOnly={direccionBloqueada}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t.contacto} <span className="text-red-500">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    placeholder={t.contacto} 
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                    value={contacto} 
                    onChange={e => setContacto(e.target.value)}
                    autoComplete="name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t.correoContacto} <span className="text-red-500">*</span>
                  </label>
                  <input 
                    required 
                    type="email" 
                    placeholder={t.correoContacto} 
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D90E8C] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                    value={correoContacto} 
                    onChange={e => setCorreoContacto(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t.telefono} <span className="text-red-500">*</span>
                  </label>
                  <input 
                    required 
                    type="tel" 
                    placeholder={t.telefono} 
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#771A53] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                    value={telefono} 
                    onChange={e => setTelefono(e.target.value)}
                    autoComplete="tel"
                    maxLength={9}
                    pattern="[0-9]{9}"
                  />
                </div>
                
                <div className="lg:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t.marcas} <span className="text-red-500">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    placeholder={t.marcas} 
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                    value={marcas} 
                    onChange={e => setMarcas(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                
                <div className="lg:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t.soporteTecnico} <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white shadow-sm transition-all duration-200"
                    value={soporteTecnico}
                    onChange={e => setSoporteTecnico(e.target.value)}
                  >
                    <option value="">{t.seleccionarOpcion}</option>
                    <option value="Sí">{t.si}</option>
                    <option value="No">{t.no}</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Sección 2 – Archivos */}
            <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-dark-surface/50 dark:to-purple-900/20 rounded-xl p-6 border border-purple-200/30 dark:border-purple-600/20 shadow-sm">
              <h2 className="text-xl font-bold text-[#D90E8C] mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#D90E8C] text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                {t.archivos}
              </h2>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-dark-accent/30 dark:to-purple-900/20 border-l-4 border-[#D90E8C] rounded-r-xl p-6 mb-6 shadow-sm">
                <div className="space-y-4">
                  <p className="text-[#139ED4] font-semibold text-lg">{t.archivosDesc1}</p>
                  <p className="text-gray-700 dark:text-gray-300">{t.archivosDesc2}</p>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <a
                      href="/PLANTILLA%20EJEMPLO%20LISTA%20DE%20PRODUCTOS%20NUEVO%20PROVEEDOR.xlsx"
                      download
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D90E8C] to-[#771A53] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {t.descargarPlantilla}
                    </a>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">{t.archivosNota}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <input 
                  type="file"
                  accept=".xlsx,.xls,.pdf,.doc,.docx,.jpg,.jpeg,.png"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#139ED4] to-[#88D4E4] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {t.elegirArchivos || 'Elegir archivos'}
                </button>
                
                {files.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">Archivos seleccionados:</h3>
                    <ul className="space-y-2">
                      {files.map((file, idx) => (
                        <li key={idx} className="flex items-center justify-between bg-gray-50 dark:bg-dark-accent/50 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <span className="truncate text-sm text-gray-700 dark:text-gray-300 font-medium">{file.name}</span>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            className="ml-3 flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded transition-colors duration-200"
                            onClick={() => removeFile(idx)}
                            aria-label={`Quitar ${file.name}`}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {/* Sección 3 – Condiciones comerciales */}
            <div className="bg-gradient-to-r from-green-50/50 to-teal-50/50 dark:from-dark-surface/50 dark:to-green-900/20 rounded-xl p-6 border border-green-200/30 dark:border-green-600/20 shadow-sm">
              <h2 className="text-xl font-bold text-[#139ED4] mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#139ED4] text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                {t.condicionesComerciales}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t.ofreceCredito} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={ofreceCredito}
                    onChange={e => setOfreceCredito(e.target.value)}
                    required
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white shadow-sm transition-all duration-200"
                  >
                    <option value="">{t.seleccionarOpcion}</option>
                    <option value="Sí">{t.si}</option>
                    <option value="No">{t.no}</option>
                  </select>
                </div>
                
                {ofreceCredito === "Sí" && (
                  <div className="lg:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t.condicionesCredito} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={t.condicionesCredito}
                      value={condicionesCredito}
                      onChange={e => setCondicionesCredito(e.target.value)}
                      required
                      className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                    />
                  </div>
                )}
                
                <div className="lg:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t.minimoPedido}
                  </label>
                  <input 
                    type="text" 
                    placeholder={t.minimoPedido} 
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200" 
                    value={minimoPedido} 
                    onChange={e => setMinimoPedido(e.target.value)} 
                    autoComplete="off" 
                  />
                </div>
                
                <div className="lg:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t.entrega} <span className="text-red-500">*</span>
                  </label>
                  <select 
                    required 
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white shadow-sm transition-all duration-200" 
                    value={entrega} 
                    onChange={e => setEntrega(e.target.value)}
                  >
                    <option value="">{t.seleccionarOpcion}</option>
                    <option value="Entrega en oficina del cliente">{t.entregaOficina}</option>
                    <option value="Recojo en almacén del proveedor">{t.entregaAlmacen}</option>
                    <option value="Ambos (según acuerdo)">{t.entregaAmbos}</option>
                    <option value="Otro">{t.entregaOtro}</option>
                  </select>
                </div>
                
                <div className="lg:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t.soporteEquipoComercial}
                  </label>
                  <Select
                    isMulti
                    options={opcionesSoporte}
                    value={opcionesSoporte.filter(option => soporteEquipoComercial.includes(option.value))}
                    onChange={(selectedOptions) => {
                      const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
                      setSoporteEquipoComercial(values);
                    }}
                    placeholder={t.seleccionarOpciones}
                    className="text-sm"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        padding: '0.25rem',
                        '&:hover': {
                          border: '2px solid #139ED4',
                        },
                        '&:focus-within': {
                          border: '2px solid #139ED4',
                          boxShadow: '0 0 0 2px rgba(19, 158, 212, 0.2)',
                        }
                      })
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Feedback de errores mejorado */}
            {feedback && feedback.type === 'error' && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">Error en el formulario</h3>
                  <p className="text-sm text-red-700 dark:text-red-400">{feedback.message}</p>
                </div>
              </div>
            )}
            
            {/* Botón de enviar mejorado */}
            <div className="flex flex-col items-center space-y-4">
              <button
                type="submit"
                className="w-full max-w-md bg-gradient-to-r from-[#D90E8C] to-[#771A53] text-white py-4 px-8 rounded-xl font-bold hover:shadow-xl transition-all duration-300 text-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center group"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    {t.enviando}
                  </>
                ) : (
                  <>
                    <span className="mr-2">{t.enviar}</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
              
              {/* Aviso legal mejorado */}
              <div className="max-w-md text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: t.legal }} />
              </div>
            </div>
          </form>
        ) : (
          <div className="text-center py-16">
            <div className="flex flex-col items-center justify-center animate-fade-in">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-[#139ED4] to-[#D90E8C] rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-[#139ED4] mb-4">{t.exito}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-md">{t.gracias}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-lg border border-blue-200 dark:border-blue-700">
                {t.contactoProximo}
              </p>
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
    </section>
  );
};