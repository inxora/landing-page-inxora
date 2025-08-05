import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { clientFormTranslation } from './clientFormTranslation';

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
  const [clientType, setClientType] = useState<'persona' | 'empresa'>('empresa');
  const [formData, setFormData] = useState({
    nombrecompleto: '',
    dni: '',
    ruc: '',
    razonsocial: '',
    rubroempresa: '',
    telefono: '',
    correo: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiFeedback, setApiFeedback] = useState<{ type: 'loading' | 'error' | 'success'; message: string } | null>(null);
  const [nombreBloqueado, setNombreBloqueado] = useState(true);
  const [razonBloqueada, setRazonBloqueada] = useState(true);

  // Validaciones
  const validate = () => {
    if (!formData.nombrecompleto.trim()) return t.validaciones.nombre;
    if (clientType === 'persona') {
      if (!formData.dni.match(/^[0-9]{8}$/)) return t.validaciones.dni;
    } else {
      if (!formData.ruc.match(/^[0-9]{11}$/)) return t.validaciones.ruc;
      if (!formData.razonsocial.trim()) return t.validaciones.razon;
      if (!formData.rubroempresa.trim()) return t.validaciones.rubro;
    }
    if (!formData.correo.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) return t.validaciones.correo;
    if (formData.telefono && !formData.telefono.match(/^[0-9]+$/)) return t.validaciones.telefono;
    if (files.length > 10) return t.validaciones.maxArchivos;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApiLookup = async (lookupType: 'dni' | 'ruc') => {
    const value = lookupType === 'dni' ? formData.dni : formData.ruc;
    const expectedLength = lookupType === 'dni' ? 8 : 11;

    if (value.length !== expectedLength) {
      setApiFeedback(null);
      return;
    }

    setApiFeedback({ type: 'loading', message: t.buscando });

    try {
      const response = await fetch(`https://apiperu.dev/api/${lookupType}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({ [lookupType]: value })
      });

      if (response.status === 429 || response.status === 403) {
        setApiFeedback({ type: 'error', message: 'El servicio de autocompletado está temporalmente no disponible. Por favor, ingresa los datos manualmente.' });
        // Desbloquea el campo para ingreso manual
        if (lookupType === 'dni') setNombreBloqueado(false);
        if (lookupType === 'ruc') setRazonBloqueada(false);
        return;
      }

      const result = await response.json();

      if (result.success && result.data) {
        if (lookupType === 'dni') {
          setFormData(prev => ({ ...prev, nombrecompleto: result.data.nombre_completo }));
          setNombreBloqueado(true);
        } else {
          setFormData(prev => ({ ...prev, razonsocial: result.data.nombre_o_razon_social }));
          setRazonBloqueada(true);
        }
        setApiFeedback({ type: 'success', message: t.datosEncontrados });
      } else if (result.message && result.message.toLowerCase().includes('límite')) {
        setApiFeedback({ type: 'error', message: 'El servicio de autocompletado está temporalmente no disponible. Por favor, ingresa los datos manualmente.' });
        if (lookupType === 'dni') setNombreBloqueado(false);
        if (lookupType === 'ruc') setRazonBloqueada(false);
      } else {
        throw new Error(result.message || t.feedback.noEncontrado);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t.feedback.errorApi;
      setApiFeedback({ type: 'error', message: errorMessage });
      if (lookupType === 'dni') setNombreBloqueado(false);
      if (lookupType === 'ruc') setRazonBloqueada(false);
    }
  };

  const handleClientTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'persona' | 'empresa';
    setClientType(value);
    setFormData(prev => ({
      ...prev,
      dni: '',
      ruc: '',
      razonsocial: '',
      rubroempresa: '',
    }));
    setApiFeedback(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    
    // Validar número máximo de archivos
    if (selected.length + files.length > 10) {
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
      // Validar y convertir archivos a base64
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

      // Crear el objeto de datos
      const data = {
        tipo_cliente: clientType === 'persona' ? 'Persona Natural' : 'Empresa',
        nombrecompleto: formData.nombrecompleto,
        dni: formData.dni,
        ruc: formData.ruc,
        razonsocial: formData.razonsocial,
        rubroempresa: formData.rubroempresa,
        telefono: formData.telefono,
        correo: formData.correo,
        requerimientos: filesBase64 // Mantener la estructura original
      };

      const response = await fetch('https://script.google.com/macros/s/AKfycbx4-bz25xgw80gWYJvQyouE6k-8-AovmsdrT426zmLb1w70JkYlXVTm3esMIA_Muewe/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      // Debido a que estamos usando mode: 'no-cors', no podemos acceder a la respuesta JSON
      // En su lugar, asumimos éxito si la solicitud se completa
      if (response.type === 'opaque') {
        setFeedback({ type: 'success', message: t.feedback.exito });
        setShowSuccess(true);
        setTimeout(() => {
          setFeedback(null);
          setShowSuccess(false);
        }, 2500);
        setFormData({
          nombrecompleto: '',
          dni: '',
          ruc: '',
          razonsocial: '',
          rubroempresa: '',
          telefono: '',
          correo: '',
        });
        setFiles([]);
      } else {
        throw new Error(t.feedback.error);
      }
    } catch (err) {
      setFeedback({ type: 'error', message: (err instanceof Error ? err.message : t.feedback.error) });
    } finally {
      setSubmitting(false);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg border border-[#88D4E4] max-w-xl mx-auto w-full">
      <h3 className="text-xl sm:text-2xl font-bold text-[#171D4C] mb-6 text-center">{t.title}</h3>
      {/* 1. Tipo de cliente */}
      <div className="mb-3 sm:mb-4">
        <label htmlFor="tipo_cliente" className="block text-[#171D4C] font-medium mb-2">
          {t.tipoCliente}
        </label>
        <select
          id="tipo_cliente"
          name="tipo_cliente"
          value={clientType}
          onChange={handleClientTypeChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-[#139ED4] transition-colors"
          required
        >
          <option value="persona">{t.persona}</option>
          <option value="empresa">{t.empresa}</option>
        </select>
      </div>
      {/* 2. Nombre Completo */}
      <div className="mb-3 sm:mb-4">
        <label htmlFor="nombrecompleto" className="block text-[#171D4C] font-medium mb-2">
          {t.nombreCompleto}
        </label>
        <input
          type="text"
          id="nombrecompleto"
          name="nombrecompleto"
          value={formData.nombrecompleto}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-[#139ED4] transition-colors"
          required
          autoComplete="name"
          readOnly={clientType === 'persona'}
          placeholder={clientType === 'persona' ? 'Se autocompletará al ingresar el DNI' : ''}
        />
      </div>
      {/* 3. DNI (solo persona) */}
      {clientType === 'persona' && (
        <div className="mb-3 sm:mb-4">
          <label htmlFor="dni" className="block text-[#171D4C] font-medium mb-2">
            {t.dni}
          </label>
          <input
            type="text"
            id="dni"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            onBlur={() => handleApiLookup('dni')}
            maxLength={8}
            pattern="\d{8}"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-[#139ED4] transition-colors"
            required
            autoComplete="off"
          />
        </div>
      )}
      {/* 4. RUC, Razón Social, Rubro (solo empresa) */}
      {clientType === 'empresa' && (
        <>
          <div className="mb-3 sm:mb-4">
            <label htmlFor="ruc" className="block text-[#171D4C] font-medium mb-2">
              {t.ruc}
            </label>
            <input
              type="text"
              id="ruc"
              name="ruc"
              value={formData.ruc}
              onChange={handleChange}
              onBlur={() => handleApiLookup('ruc')}
              maxLength={11}
              pattern="\d{11}"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-[#139ED4] transition-colors"
              required
              autoComplete="off"
            />
          </div>
          <div className="mb-3 sm:mb-4">
            <label htmlFor="razonsocial" className="block text-[#171D4C] font-medium mb-2">
              {t.razonSocial}
            </label>
            <input
              type="text"
              id="razonsocial"
              name="razonsocial"
              value={formData.razonsocial}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-[#139ED4] transition-colors"
              required
              autoComplete="organization"
              readOnly={clientType === 'empresa'}
              placeholder={clientType === 'empresa' ? 'Se autocompletará al ingresar el RUC' : ''}
            />
          </div>
          <div className="mb-3 sm:mb-4">
            <label htmlFor="rubroempresa" className="block text-[#171D4C] font-medium mb-2">
              {t.rubroEmpresa}
            </label>
            <select
              id="rubroempresa"
              name="rubroempresa"
              value={formData.rubroempresa}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-[#139ED4] transition-colors"
              required
              autoComplete="off"
            >
              <option value="">{t.seleccionarOpcion}</option>
              <option value="Contratista">{t.rubroContratista}</option>
              <option value="Manufacturera">{t.rubroManufacturera}</option>
              <option value="Aeropuerto">{t.rubroAeropuerto}</option>
              <option value="Puerto">{t.rubroPuerto}</option>
              <option value="Transporte">{t.rubroTransporte}</option>
              <option value="Logística">{t.rubroLogistica}</option>
              <option value="Naval">{t.rubroNaval}</option>
              <option value="Pesquera">{t.rubroPesquera}</option>
              <option value="Agroindustria">{t.rubroAgroindustria}</option>
              <option value="Alimentaria">{t.rubroAlimentaria}</option>
              <option value="Constructora">{t.rubroConstructora}</option>
              <option value="Minería">{t.rubroMineria}</option>
              <option value="Oil&Gas">{t.rubroOilGas}</option>
              <option value="Energía">{t.rubroEnergia}</option>
              <option value="Distribuidor">{t.rubroDistribuidor}</option>
              <option value="Otro">{t.rubroOtro}</option>
            </select>
          </div>
        </>
      )}
      {/* API Feedback */}
      {apiFeedback && (
        <div className={`text-sm mb-4 p-2 rounded-md text-center
          ${apiFeedback.type === 'loading' ? 'bg-blue-100 text-blue-700' : ''}
          ${apiFeedback.type === 'error' ? 'bg-red-100 text-red-700' : ''}
          ${apiFeedback.type === 'success' ? 'bg-green-100 text-green-700' : ''}`}>
          {apiFeedback.message}
        </div>
      )}
      {/* 5. Teléfono */}
      <div className="mb-3 sm:mb-4">
        <label htmlFor="telefono" className="block text-[#171D4C] font-medium mb-2">
          {t.telefono}
        </label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-[#139ED4] transition-colors"
          autoComplete="tel"
          maxLength={9}
          pattern="[0-9]{9}"
        />
      </div>
      {/* 6. Correo electrónico */}
      <div className="mb-3 sm:mb-4">
        <label htmlFor="correo" className="block text-[#171D4C] font-medium mb-2">
          {t.correo}
        </label>
        <input
          type="email"
          id="correo"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-[#139ED4] transition-colors"
          required
          autoComplete="email"
        />
      </div>
      {/* 7. Archivos */}
      <div className="mb-3 sm:mb-4">
        <label className="block text-[#171D4C] font-medium mb-2">
          {t.requerimiento}
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-[#139ED4] text-white px-4 py-2 rounded font-semibold"
        >
          {t.elegirArchivos}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          multiple
          accept=".xlsx,.xls,.pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileChange}
        />
        <p className="text-xs text-gray-500 mt-1">
          {t.subirArchivos}<br />
          {t.formatos}
        </p>
        {/* Recomendación de nombre de archivo, bien formateada */}
        <div className="mt-2 text-xs text-yellow-600 flex flex-col gap-0.5">
          <span className="font-semibold">{t.recomendacionArchivoTitulo}</span>
          <span>{t.recomendacionArchivoLinea1}</span>
          <span className="font-semibold">{t.recomendacionArchivoEjemploTitulo}</span>
          <span className="text-gray-600">{t.recomendacionArchivoEjemplo}</span>
        </div>
        {/* Lista de archivos seleccionados */}
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
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}
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
      {feedback && feedback.type === 'success' && showSuccess && (
        <div className="flex flex-col items-center justify-center animate-fade-in mb-2">
          <div className="mb-2">
            <svg className="w-12 h-12 text-[#139ED4] animate-bounce-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke="#139ED4" strokeWidth="2" fill="#e9f6fc"/>
              <path stroke="#139ED4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-5"/>
            </svg>
          </div>
          <span className="text-[#139ED4] font-bold text-lg">{feedback.message}</span>
        </div>
      )}
      <button
        type="submit"
        className="w-full bg-[#139ED4] hover:bg-[#171D4C] text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-md transition-colors shadow-md disabled:opacity-60 flex items-center justify-center text-base md:text-lg"
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
  );
};