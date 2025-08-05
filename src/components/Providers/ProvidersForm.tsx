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
    <section className="min-h-screen flex flex-col items-center justify-center bg-[#e9f6fc] py-6 md:py-10 px-2 sm:px-4 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-[#139ED4] text-white rounded hover:bg-[#171D4C] transition-colors font-medium shadow self-start"
        aria-label={t.atras || '← Atrás'}
      >
        {t.atras || '← Atrás'}
      </button>
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 md:p-10 flex flex-col items-center border-t-8 border-[#D90E8C]">
        {/* Logo INXORA */}
        <img src="/logo_inxora/LOGO-01.png" alt="Logo INXORA" className="w-40 mb-6 drop-shadow-lg" />
        <h1 className="text-2xl md:text-3xl font-bold text-center uppercase tracking-wide drop-shadow-sm mb-2">
          <span className="block text-[#139ED4]">{t.titulo}</span>
          <span className="block text-[#D90E8C]">{t.subtitulo}</span>
        </h1>
        {/* Introducción */}
        <div className="w-full bg-[#f2f7fa] border-l-8 border-[#771A53] rounded-lg p-4 mb-6 text-sm md:text-base shadow-sm">
          <p className="font-bold mb-2">🤝 {t.introTitulo}</p>
          <p className="mb-2">{t.introLinea1}</p>
          <p className="font-bold mb-2">🧾 {t.introQuienes}</p>
          <p className="mb-2">{t.introQuienesDesc}</p>
          <ul className="list-disc ml-5 mb-2 text-[#139ED4]">
            {t.introQuienesBullets.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>
          <p className="font-bold mb-2">🔍 {t.introQueBuscamos}</p>
          <p className="mb-2">{t.introQueBuscamosDesc}</p>
          <ul className="list-disc ml-5 mb-2 text-[#139ED4]">
            {t.introQueBuscamosBullets.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>
          <p className="font-bold mb-2">✅ {t.introQueNecesitamos}</p>
          <p>{t.introQueNecesitamosDesc}</p>
        </div>
        {/* Formulario */}
        {!enviado ? (
          <form ref={formRef} className="w-full flex flex-col gap-4 md:gap-6" onSubmit={handleSubmit}>
            {/* Sección 1 – Datos de la empresa */}
            <div className="bg-[#e9f6fc] rounded-lg p-3 sm:p-4 shadow-sm">
              <h2 className="text-lg font-bold text-[#139ED4] mb-2 drop-shadow-sm">1. {t.datosEmpresa}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <input 
                  required 
                  type="text" 
                  placeholder={t.razonSocial + ' (se autocompletará con el RUC)'} 
                  className="border border-[#139ED4] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#139ED4] ring-offset-1 bg-white text-[#171D4C] placeholder-[#88D4E4] shadow-sm"
                  value={razonSocial} 
                  onChange={e => setRazonSocial(e.target.value)}
                  autoComplete="organization"
                  readOnly
                />
                <input 
                  required 
                  type="text" 
                  placeholder={t.ruc} 
                  className="border border-[#139ED4] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#139ED4] ring-offset-1 bg-white text-[#171D4C] placeholder-[#88D4E4] shadow-sm"
                  value={ruc} 
                  onChange={e => setRuc(e.target.value)}
                  onBlur={handleApiLookupRuc}
                  autoComplete="off"
                  maxLength={11}
                  pattern="[0-9]{11}"
                  readOnly={!!razonSocial}
                />
                {apiFeedback && (
                  <div className={`text-sm mb-4 p-2 rounded-md text-center
                    ${apiFeedback.type === 'loading' ? 'bg-blue-100 text-blue-700' : ''}
                    ${apiFeedback.type === 'error' ? 'bg-red-100 text-red-700' : ''}
                    ${apiFeedback.type === 'success' ? 'bg-green-100 text-green-700' : ''}`}>
                    {apiFeedback.message}
                  </div>
                )}
                <input 
                  required 
                  type="text" 
                  placeholder={t.direccion + ' (se autocompletará con el RUC)'} 
                  className="border border-[#139ED4] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#139ED4] ring-offset-1 bg-white text-[#171D4C] placeholder-[#88D4E4] md:col-span-2 shadow-sm"
                  value={direccion} 
                  onChange={e => setDireccion(e.target.value)}
                  autoComplete="street-address"
                  readOnly={direccionBloqueada}
                />
                <input 
                  required 
                  type="text" 
                  placeholder={t.contacto} 
                  className="border border-[#139ED4] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#139ED4] ring-offset-1 bg-white text-[#171D4C] placeholder-[#88D4E4] shadow-sm"
                  value={contacto} 
                  onChange={e => setContacto(e.target.value)}
                  autoComplete="name"
                />
                <input 
                  required 
                  type="email" 
                  placeholder={t.correoContacto} 
                  className="border border-[#88D4E4] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#D90E8C] ring-offset-1 bg-white text-[#171D4C] placeholder-[#88D4E4] shadow-sm"
                  value={correoContacto} 
                  onChange={e => setCorreoContacto(e.target.value)}
                  autoComplete="email"
                />
                <input 
                  required 
                  type="tel" 
                  placeholder={t.telefono} 
                  className="border border-[#771A53] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#771A53] ring-offset-1 bg-white text-[#171D4C] placeholder-[#88D4E4] shadow-sm"
                  value={telefono} 
                  onChange={e => setTelefono(e.target.value)}
                  autoComplete="tel"
                  maxLength={9}
                  pattern="[0-9]{9}"
                />
                <input 
                  required 
                  type="text" 
                  placeholder={t.marcas} 
                  className="border border-[#139ED4] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#139ED4] ring-offset-1 bg-white text-[#171D4C] placeholder-[#88D4E4] md:col-span-2 shadow-sm"
                  value={marcas} 
                  onChange={e => setMarcas(e.target.value)}
                  autoComplete="off"
                />
                <div className="md:col-span-2">
                  <label className="block font-medium text-[#771A53] mb-1">{t.soporteTecnico}</label>
                  <select
                    required
                    className="w-full border border-[#139ED4] rounded-lg px-3 py-2 bg-white text-[#171D4C] focus:outline-none focus:ring-1 focus:ring-[#139ED4] ring-offset-1 shadow-sm"
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
            <div className="bg-[#f2f7fa] rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-bold text-[#139ED4] mb-2 drop-shadow-sm">2. {t.archivos}</h2>
              <div className="bg-[#e9f6fc] border-l-4 border-[#88D4E4] rounded-lg p-3 sm:p-4 mb-2">
                <p className="mb-2 text-[#139ED4] font-semibold">{t.archivosDesc1}</p>
                <p className="mb-2 text-[#771A53]">{t.archivosDesc2}</p>
                <a
                  href="/PLANTILLA%20EJEMPLO%20LISTA%20DE%20PRODUCTOS%20NUEVO%20PROVEEDOR.xlsx"
                  download
                  className="inline-block bg-[#D90E8C] text-white px-4 py-2 rounded-lg hover:bg-[#771A53] transition-colors font-semibold shadow mb-2"
                >
                  {t.descargarPlantilla}
                </a>
                <p className="text-xs text-[#139ED4]">{t.archivosNota}</p>
              </div>
              <input 
                type="file"
                accept=".xlsx,.xls,.pdf,.doc,.docx,.jpg,.jpeg,.png"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#139ED4] text-white px-4 py-2 rounded font-semibold mb-2"
              >
                {t.elegirArchivos || 'Elegir archivos'}
              </button>
              {files.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {files.map((file, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded">
                      <span className="truncate text-xs">{file.name}</span>
                      <button
                        type="button"
                        className="ml-2 text-red-500 hover:text-red-700 text-xs"
                        onClick={() => removeFile(idx)}
                        tabIndex={0}
                      >
                        {t.quitar}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Sección 3 – Condiciones comerciales */}
            <div className="bg-[#e9f6fc] rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-bold text-[#139ED4] mb-2 drop-shadow-sm">3. {t.condicionesComerciales}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="md:col-span-2">
                  <label className="block font-medium text-[#139ED4] mb-1">{t.ofreceCredito}</label>
                  <select
                    value={ofreceCredito}
                    onChange={e => setOfreceCredito(e.target.value)}
                    required
                    className="w-full border border-[#139ED4] rounded-lg px-3 py-2 bg-white text-[#171D4C] focus:outline-none focus:ring-1 focus:ring-[#139ED4] ring-offset-1 shadow-sm"
                  >
                    <option value="">{t.seleccionarOpcion}</option>
                    <option value="Sí">{t.si}</option>
                    <option value="No">{t.no}</option>
                  </select>
                </div>
                {ofreceCredito === "Sí" && (
                  <div className="md:col-span-2 mt-2">
                    <input
                      type="text"
                      placeholder={t.condicionesCredito}
                      value={condicionesCredito}
                      onChange={e => setCondicionesCredito(e.target.value)}
                      required
                      className="w-full border border-[#139ED4] rounded-lg px-3 py-2 bg-white text-[#171D4C] focus:outline-none focus:ring-1 focus:ring-[#139ED4] ring-offset-1 shadow-sm"
                    />
                  </div>
                )}
                <input type="text" placeholder={t.minimoPedido} className="border border-[#139ED4] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#139ED4] ring-offset-1 bg-white text-[#171D4C] placeholder-[#88D4E4] md:col-span-2 shadow-sm" value={minimoPedido} onChange={e => setMinimoPedido(e.target.value)} autoComplete="off" />
                <div className="md:col-span-2">
                  <label className="block font-medium text-[#771A53] mb-1">{t.entrega}</label>
                  <select required className="w-full border border-[#139ED4] rounded-lg px-3 py-2 bg-white text-[#171D4C] focus:outline-none focus:ring-1 focus:ring-[#139ED4] ring-offset-1 shadow-sm" value={entrega} onChange={e => setEntrega(e.target.value)}>
                    <option value="">{t.seleccionarOpcion}</option>
                    <option value="Entrega en oficina del cliente">{t.entregaOficina}</option>
                    <option value="Recojo en almacén del proveedor">{t.entregaAlmacen}</option>
                    <option value="Ambos (según acuerdo)">{t.entregaAmbos}</option>
                    <option value="Otro">{t.entregaOtro}</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block font-medium text-[#139ED4] mb-1">{t.soporteEquipoComercial}</label>
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
                  />
                </div>
              </div>
            </div>
            {/* Feedback */}
            {feedback && feedback.type === 'error' && (
              <div className="flex items-center justify-center text-[#D90E8C] bg-[#e9f6fc] rounded-lg px-4 py-2 font-medium animate-fade-in mb-2">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="#D90E8C">
                  <circle cx="12" cy="12" r="10" stroke="#D90E8C" strokeWidth="2" fill="#fff"/>
                  <path stroke="#D90E8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01"/>
                </svg>
                {feedback.message}
              </div>
            )}
            {/* Botón de enviar */}
            <button
              type="submit"
              className="w-full bg-[#D90E8C] text-white py-3 md:py-4 rounded-lg font-semibold hover:bg-[#771A53] transition-all duration-200 shadow-lg text-base md:text-lg disabled:opacity-60 flex items-center justify-center mt-4"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  {t.enviando}
                </>
              ) : t.enviar}
            </button>
            {/* Aviso legal internacionalizado */}
            <p className="text-sm text-gray-500 mt-4 text-center" dangerouslySetInnerHTML={{ __html: t.legal }} />
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center animate-fade-in">
            <div className="mb-4">
              <svg className="w-16 h-16 text-[#139ED4] animate-bounce-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke="#139ED4" strokeWidth="2" fill="#e9f6fc"/>
                <path stroke="#139ED4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-5"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#139ED4] mb-2">{t.exito}</h2>
            <p className="text-gray-600 mb-4">{t.gracias}</p>
            <p className="text-sm text-gray-500">{t.contactoProximo}</p>
          </div>
        )}
      </div>
    </section>
  );
};