import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import Select from 'react-select';
import { useLanguage } from '../../context/LanguageContext';
import { providersFormTranslation } from './providersFormTranslation';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabase';
import { BackButton } from '../common/BackButton';

const allowedFileTypes = {
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/vnd.ms-excel': '.xls',
  'text/csv': '.csv',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'image/jpeg': '.jpg,.jpeg',
  'image/png': '.png'
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB en bytes

// Componente del indicador de pasos minimalista y profesional
const StepIndicator = ({ currentStep, totalSteps, stepLabels, completedSteps }: {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  completedSteps: boolean[];
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep + 1;
            const isCompleted = completedSteps[index];

            return (
              <React.Fragment key={stepNumber}>
                <div className="flex flex-col items-center flex-1">
                  {/* Círculo del paso - diseño minimalista */}
                  <div
                    className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold border-2 transition-all duration-200
                      ${isCompleted
                        ? 'bg-green-600 border-green-600 text-white'
                        : isActive
                          ? 'bg-[#139ED4] border-[#139ED4] text-white'
                          : 'bg-white border-gray-300 text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-500'
                      }
                    `}
                  >
                    {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : stepNumber}
                  </div>
                  
                  {/* Etiqueta del paso */}
                  <span className={`
                    mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-center leading-tight px-1
                    ${isActive 
                      ? 'text-[#139ED4]' 
                      : isCompleted 
                        ? 'text-green-600' 
                        : 'text-gray-500 dark:text-gray-400'
                    }
                  `}>
                    {stepLabels[index]}
                  </span>
                </div>
                
                {/* Línea conectora entre pasos */}
                {stepNumber < totalSteps && (
                  <div className="flex-1 px-4">
                    <div className={`
                      h-px transition-all duration-200
                      ${isCompleted ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'}
                    `} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        
        {/* Barra de progreso simple */}
        <div className="mt-6 bg-gray-100 dark:bg-gray-700 rounded-full h-1">
          <div 
            className="h-full bg-[#139ED4] transition-all duration-300 rounded-full"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export const ProveedorForm = () => {
  const { lang } = useLanguage();
    const t = providersFormTranslation[lang] || {};
  const navigate = useNavigate();
  const {
    getPaises,
    getMarcas,
    getMonedas,
    insertCondicionesComerciales,
    insertProveedor,
    insertProveedorMarca,
    uploadProveedorFiles
  } = useSupabaseData();

  // Estado del formulario multi-paso
  const [currentStep, setCurrentStep] = useState(0); // Comenzamos en 0 para el acuerdo
  const [completedSteps, setCompletedSteps] = useState([false, false, false, false]); // Agregamos un paso más
  const totalSteps = 4; // Aumentamos a 4 pasos
  const stepLabels = ["Acuerdo", t.paso1, t.paso2, t.paso3]; // Agregamos el acuerdo

  // Estado para el acuerdo
  const [acuerdoAceptado, setAcuerdoAceptado] = useState(false);

  // Estados para datos de referencia
  const [paises, setPaises] = useState<any[]>([]);
  const [marcasDisponibles, setMarcasDisponibles] = useState<any[]>([]);
  const [monedas, setMonedas] = useState<any[]>([]);
  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState<any[]>([]);
  const [paisSeleccionado, setPaisSeleccionado] = useState<any>(null);

  // Estados del formulario
  const [enviado, setEnviado] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para cada campo del formulario
  const [razonSocial, setRazonSocial] = useState("");
  const [documentoEmpresa, setDocumentoEmpresa] = useState(""); // Cambio: era 'ruc'
  const [direccion, setDireccion] = useState("");
  const [nombreContacto, setNombreContacto] = useState(""); // Cambio: era 'contacto'
  const [apellidosContacto, setApellidosContacto] = useState(""); // NUEVO campo
  const [correoContacto, setCorreoContacto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [whatsapp, setWhatsapp] = useState(""); // NUEVO campo
  const [soporteTecnico, setSoporteTecnico] = useState("");
  const [entregaNacional, setEntregaNacional] = useState(true); // NUEVO campo
  const [entregaInternacional, setEntregaInternacional] = useState(false); // NUEVO campo
  const [minimoPedido, setMinimoPedido] = useState("");
  const [monedaMinimoPedido, setMonedaMinimoPedido] = useState(1); // Default USD o PEN
  const [margenNegociado, setMargenNegociado] = useState(""); // NUEVO campo
  const [paisId, setPaisId] = useState(1); // NUEVO campo - default Perú
  const [comentarios, setComentarios] = useState("");

  // Campos para condiciones comerciales
  const [ofreceCredito, setOfreceCredito] = useState("");
  const [diasCredito, setDiasCredito] = useState("");
  const [condicionesCredito, setCondicionesCredito] = useState("");
  const [descuentoVolumen, setDescuentoVolumen] = useState("");
  const [detalleEntrega, setDetalleEntrega] = useState("");

  const API_TOKEN = '2118121196497c1c1cc6dfbe5dc1342b7edba43c9f9ba855fd5f7a68ab2db781';
  const [apiFeedback, setApiFeedback] = useState<{ type: 'loading' | 'error' | 'success'; message: string } | null>(null);
  const [direccionBloqueada, setDireccionBloqueada] = useState(false);
  const [razonSocialBloqueado, setRazonSocialBloqueado] = useState(false);

  // Cargar datos de referencia al montar el componente
  useEffect(() => {
    const cargarDatosReferencia = async () => {
      try {
        const [paisesData, marcasData, monedasData] = await Promise.all([
          getPaises(),
          getMarcas(),
          getMonedas()
        ]);

        setPaises(paisesData);
        setMarcasDisponibles(marcasData);
        setMonedas(monedasData);

        // Establecer país por defecto (Perú)
        const peru = paisesData.find(p => p.iso_code_2 === 'PE');
        if (peru) {
          setPaisSeleccionado(peru);
          setPaisId(peru.id);
        }
      } catch (error) {
        console.error('Error al cargar datos de referencia:', error);
      }
    };

    cargarDatosReferencia();
  }, []);

  // Actualizar país seleccionado cuando cambia paisId
  useEffect(() => {
    const pais = paises.find(p => p.id === paisId);
    setPaisSeleccionado(pais);
  }, [paisId, paises]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Validaciones por paso
  const validateStep = (step: number): string | null => {
    switch (step) {
      case 0: // Acuerdo de colaboración
        if (!acuerdoAceptado) return "Debe aceptar el acuerdo de colaboración comercial para continuar";
        return null;
      
      case 1: // Datos de la empresa
        if (!razonSocial.trim()) return t.validaciones.razonSocial;
        if (!documentoEmpresa.trim()) return t.validaciones.ruc;
        if (!direccion.trim()) return t.validaciones.direccion;
        if (!nombreContacto.trim()) return t.validaciones.contacto;
        if (!apellidosContacto.trim()) return "Los apellidos del contacto son obligatorios";
        if (!correoContacto.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) return t.validaciones.correoContacto;
        if (!telefono.trim()) return t.validaciones.telefono;
        // Validar teléfono según el patrón del país seleccionado
        if (paisSeleccionado && paisSeleccionado.patron_telefono) {
          const patronTelefono = new RegExp(paisSeleccionado.patron_telefono);
          if (!patronTelefono.test(telefono)) return t.validaciones.telefonoFormato;
        } else {
          // Fallback para países sin patrón definido
          if (!telefono.match(/^[0-9]{7,15}$/)) return "Formato de teléfono inválido";
        }
        if (marcasSeleccionadas.length === 0) return "Debe seleccionar al menos una marca";
        if (!soporteTecnico) return t.validaciones.soporteTecnico;
        return null;

      case 2: // Documentos - es opcional
        if (files.length > 5) return t.validaciones.maxArchivos;
        for (const file of files) {
          if (!Object.keys(allowedFileTypes).includes(file.type)) {
            return t.validaciones.archivoNoPermitido.replace('{file}', file.name);
          }
        }
        return null;

      case 3: // Condiciones comerciales - es opcional
        return null;

      default:
        return null;
    }
  };

  const validateFile = (file: File): string | null => {
    if (!Object.keys(allowedFileTypes).includes(file.type)) {
      return t.validaciones.tipoArchivo.replace('{file}', file.name);
    }
    if (file.size > MAX_FILE_SIZE) {
      return t.validaciones.tamanoArchivo.replace('{file}', file.name);
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s_\-.()'´]+$/.test(file.name)) {
      return t.validaciones.nombreArchivo.replace('{file}', file.name);
    }
    return null;
  };

  // Navegación entre pasos
  const goToNextStep = () => {
    const error = validateStep(currentStep);
    if (error) {
      setFeedback({ type: 'error', message: error });
      return;
    }

    setFeedback(null);
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[currentStep - 1] = true;
    setCompletedSteps(newCompletedSteps);

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    setFeedback(null);
    if (currentStep > 0) {  // Cambiado de 1 a 0 para manejar el paso del acuerdo
      setCurrentStep(currentStep - 1);
    } else {
      // Si estamos en el paso 0 (acuerdo), ir hacia atrás significa salir del formulario
      navigate(-1);
    }
  };

  // Manejo de archivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);

    if (selected.length + files.length > 5) {
      setFeedback({ type: 'error', message: t.validaciones.maxArchivos });
      return;
    }

    for (const file of selected) {
      const error = validateFile(file);
      if (error) {
        setFeedback({ type: 'error', message: error });
        return;
      }
    }

    setFiles(prev => [...prev, ...selected]);
    setFeedback(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setFeedback(null);
  };

  // API para autocompletar datos de SUNAT
  const buscarDatosRUC = async () => {
    // Solo buscar datos para Perú
    if (!paisSeleccionado || paisSeleccionado.iso_code_2 !== 'PE') {
      setApiFeedback({ type: 'error', message: 'Búsqueda de RUC solo disponible para Perú' });
      return;
    }

    if (!documentoEmpresa.trim() || documentoEmpresa.length !== 11) {
      setApiFeedback({ type: 'error', message: 'RUC debe tener 11 dígitos' });
      return;
    }

    setApiFeedback(null);

    setApiFeedback({ type: 'loading', message: t.buscando || 'Buscando datos de SUNAT...' });

    try {
      const response = await fetch(`https://apiperu.dev/api/ruc/${documentoEmpresa}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        }
      });

      if (!response.ok) {
        setApiFeedback({ type: 'error', message: 'El servicio de autocompletado está temporalmente no disponible. Por favor, ingresa los datos manualmente.' });
        return;
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'RUC no encontrado');
      }

      if (result.data && result.data.nombre_o_razon_social && result.data.direccion_completa) {
        setRazonSocial(result.data.nombre_o_razon_social);
        setDireccion(result.data.direccion_completa);
        setRazonSocialBloqueado(true);
        setDireccionBloqueada(true);

        setApiFeedback({ type: 'success', message: t.datosEncontrados || 'Datos encontrados con éxito.' });
      } else {
        setApiFeedback({ type: 'error', message: 'El servicio de autocompletado está temporalmente no disponible. Por favor, ingresa los datos manualmente.' });
      }
    } catch (error) {
      setApiFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Error desconocido' });
    }
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Validar todos los pasos
    for (let i = 1; i <= totalSteps; i++) {
      const error = validateStep(i);
      if (error && i === 1) { // Solo el paso 1 es obligatorio
        setFeedback({ type: 'error', message: error });
        setCurrentStep(i);
        return;
      }
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      // 1. Crear condiciones comerciales
      const condicionesData = {
        ofrece_credito: ofreceCredito === 'si',
        dias_credito: diasCredito ? parseInt(diasCredito) : 0,
        condiciones_credito: condicionesCredito || null,
        monto_min_pedido: minimoPedido ? parseFloat(minimoPedido) : null,
        id_moneda_min_pedido: monedaMinimoPedido || null,
        descuento_volumen: descuentoVolumen ? parseFloat(descuentoVolumen) : 0,
        detalle_entrega: detalleEntrega || null
      };

      const condicionesResult = await insertCondicionesComerciales(condicionesData);

      if (!condicionesResult.success) {
        throw new Error('Error al crear condiciones comerciales');
      }

      const condicionesId = condicionesResult.data?.[0]?.id;

      // 2. Crear proveedor
      const proveedorData = {
        razon_social: razonSocial,
        documento_empresa: documentoEmpresa,
        nombre_contacto: nombreContacto,
        apellidos_contacto: apellidosContacto || null,
        correo: correoContacto,
        telefono: telefono || null,
        whatsapp: whatsapp || null,
        soporte_productos: soporteTecnico === 'si',
        entrega_nacional: entregaNacional,
        entrega_internacional: entregaInternacional,
        margen_negociado: margenNegociado ? parseFloat(margenNegociado) : null,
        id_condiciones_comerciales: condicionesId,
        id_pais: paisId,
        activo: true
      };

      const proveedorResult = await insertProveedor(proveedorData);

      if (!proveedorResult.success) {
        throw new Error('Error al crear proveedor');
      }

      const proveedorId = proveedorResult.data?.[0]?.id;

      // 3. Crear relaciones proveedor-marca si hay marcas seleccionadas
      if (marcasSeleccionadas.length > 0) {
        const relacionesMarca = marcasSeleccionadas.map(marca => ({
          id_proveedor: proveedorId,
          id_marca: marca.value,
          es_distribuidor_oficial: false,
          descuento_especial: 0,
          activo: true
        }));

        const relacionesResult = await insertProveedorMarca(relacionesMarca);

        if (!relacionesResult.success) {
          console.warn('Error al crear relaciones proveedor-marca, pero proveedor creado exitosamente');
        }
      }

      // 4. Subir archivos si los hay
      if (files.length > 0) {
        const fileUploadResult = await uploadProveedorFiles(files, proveedorId);
        
        if (!fileUploadResult.success) {
          console.warn('Error al subir archivos, pero proveedor creado exitosamente');
          setFeedback({ 
            type: 'success', 
            message: 'Proveedor registrado exitosamente, pero hubo problemas al subir algunos archivos. Puede contactarnos para enviarlos posteriormente.' 
          });
        } else {
          setFeedback({ 
            type: 'success', 
            message: `Proveedor registrado exitosamente con ${fileUploadResult.archivos?.length || 0} archivo(s) adjunto(s).` 
          });
        }
      } else {
        setFeedback({ type: 'success', message: 'Proveedor registrado exitosamente en la base de datos.' });
      }

      setEnviado(true);

    } catch (error) {
      console.error('Error en el envío:', error);
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error al registrar el proveedor. Intenta nuevamente.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Renderizado de cada paso
  const renderStep = () => {
    switch (currentStep) {
      case 0: // Acuerdo de colaboración
        return (
          <div className="space-y-6 h-full flex flex-col">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 flex flex-col overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t.introTitulo || 'Título por defecto'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Para proveedores interesados en nuestra plataforma
                  </p>
                </div>
                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {t.introLinea1 || 'Línea de introducción por defecto'}
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        {t.introQuienes || 'Quiénes somos'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                        {t.introQuienesDesc || 'Descripción por defecto'}
                      </p>
                      <ul className="space-y-2 ml-4">
                        {t.introQuienesBullets && t.introQuienesBullets.map((item: string, i: number) => (
                          <li key={i} className="text-gray-700 dark:text-gray-300 text-sm relative">
                            <span className="absolute -left-4 top-2 w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        {t.introQueBuscamos || 'Qué buscamos'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                        {t.introQueBuscamosDesc || 'Descripción por defecto'}
                      </p>
                      <ul className="space-y-2 ml-4">
                        {t.introQueBuscamosBullets && t.introQueBuscamosBullets.map((item: string, i: number) => (
                          <li key={i} className="text-gray-700 dark:text-gray-300 text-sm relative">
                            <span className="absolute -left-4 top-2 w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        {t.introQueNecesitamos || 'Qué necesitamos'}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {t.introQueNecesitamosDesc || 'Descripción por defecto'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="acuerdo"
                      checked={acuerdoAceptado}
                      onChange={(e) => setAcuerdoAceptado(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#139ED4] bg-white border-gray-300 rounded focus:ring-0 focus:outline-none"
                    />
                    <label htmlFor="acuerdo" className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed cursor-pointer">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {t.aceptoAcuerdo || 'Acepto el acuerdo de colaboración comercial'}
                      </span>
                      {" "}{t.aceptoDesc || 'y confirmo que he leído y entendido los términos para ser proveedor de INXORA.'}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          );
      case 1:
        return (
          <div className="space-y-6 h-full flex flex-col">
            {/* Acuerdo de colaboración comercial - diseño minimalista */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 flex flex-col overflow-hidden">
              
              {/* Header simple y profesional */}
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t.introTitulo}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Para proveedores interesados en nuestra plataforma
                </p>
              </div>

              {/* Contenido del acuerdo */}
              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                
                {/* Introducción */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t.introLinea1 || 'Línea de introducción por defecto'}
                  </p>
                </div>

                {/* Contenido organizado en secciones simples */}
                <div className="space-y-6">
                  
                  {/* Quiénes somos */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#139ED4] rounded-full"></div>
                      {t.introQuienes}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                      {t.introQuienesDesc}
                    </p>
                    <ul className="space-y-2 ml-4">
                      {t.introQuienesBullets.map((item: string, i: number) => (
                        <li key={i} className="text-gray-700 dark:text-gray-300 text-sm relative">
                          <span className="absolute -left-4 top-2 w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Qué buscamos */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#139ED4] rounded-full"></div>
                      {t.introQueBuscamos}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                      {t.introQueBuscamosDesc}
                    </p>
                    <ul className="space-y-2 ml-4">
                      {t.introQueBuscamosBullets.map((item: string, i: number) => (
                        <li key={i} className="text-gray-700 dark:text-gray-300 text-sm relative">
                          <span className="absolute -left-4 top-2 w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Qué necesitamos */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#139ED4] rounded-full"></div>
                      {t.introQueNecesitamos}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {t.introQueNecesitamosDesc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Checkbox de aceptación minimalista */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="acuerdo"
                    checked={acuerdoAceptado}
                    onChange={(e) => setAcuerdoAceptado(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-[#139ED4] bg-white border-gray-300 rounded focus:ring-[#139ED4] focus:ring-1"
                  />
                  <label htmlFor="acuerdo" className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed cursor-pointer">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Acepto el acuerdo de colaboración comercial
                    </span>
                    {" "}y confirmo que he leído y entendido los términos para ser proveedor de INXORA.
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#139ED4] mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-[#139ED4] text-white rounded-full flex items-center justify-center text-lg font-bold">1</span>
              {t.datosEmpresa}
            </h2>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                País <span className="text-red-500">*</span>
              </label>
              <select
                value={paisId}
                onChange={e => setPaisId(parseInt(e.target.value))}
                className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white shadow-sm transition-all duration-200"
              >
                {paises.map(pais => (
                  <option key={pais.id} value={pais.id}>
                    {pais.nombre}
                  </option>
                ))}
              </select>
            </div>

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
                  readOnly={razonSocialBloqueado}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {paisSeleccionado && paisSeleccionado.iso_code_2 === 'PE' ? t.ruc : 'Documento de Identidad Fiscal'} <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    required
                    type="text"
                    placeholder="20123456789"
                    className="flex-1 border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                    value={documentoEmpresa}
                    onChange={e => setDocumentoEmpresa(e.target.value)}
                    autoComplete="off"
                    maxLength={11}
                  />
                  {paisSeleccionado && paisSeleccionado.iso_code_2 === 'PE' && (
                    <button
                      type="button"
                      onClick={buscarDatosRUC}
                      disabled={!documentoEmpresa.trim() || documentoEmpresa.length !== 11}
                      className="px-4 py-3 bg-[#139ED4] hover:bg-[#0f7ba3] disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors duration-200 whitespace-nowrap"
                    >
                      {t.buscar || 'Buscar'}
                    </button>
                  )}
                </div>

                {apiFeedback && (
                  <div className={`text-sm p-2 rounded ${apiFeedback.type === 'loading' ? 'bg-blue-50 text-blue-700' :
                      apiFeedback.type === 'error' ? 'bg-red-50 text-red-700' :
                        'bg-green-50 text-green-700'
                    }`}>
                    {apiFeedback.message}
                  </div>
                )}
              </div>

              <div className="space-y-2 lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t.direccion} <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Av. Principal 123, Distrito, Provincia"
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                  value={direccion}
                  onChange={e => setDireccion(e.target.value)}
                  autoComplete="address-line1"
                  readOnly={direccionBloqueada}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Nombre del contacto <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Juan"
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                  value={nombreContacto}
                  onChange={e => setNombreContacto(e.target.value)}
                  autoComplete="given-name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Apellidos del contacto <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Pérez García"
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                  value={apellidosContacto}
                  onChange={e => setApellidosContacto(e.target.value)}
                  autoComplete="family-name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t.correoContacto} <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  placeholder="contacto@empresa.com"
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                  value={correoContacto}
                  onChange={e => setCorreoContacto(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t.telefono} <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {paisSeleccionado && (
                    <span className="px-3 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium">
                      {paisSeleccionado.prefijo_telefonico}
                    </span>
                  )}
                  <input
                    required
                    type="tel"
                    placeholder="987654321"
                    className="flex-1 border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                    value={telefono}
                    onChange={e => setTelefono(e.target.value)}
                    pattern={paisSeleccionado?.patron_telefono || ''}
                    autoComplete="tel"
                    maxLength={9}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  WhatsApp <span className="text-gray-400">(opcional)</span>
                </label>
                <div className="flex gap-2">
                  {paisSeleccionado && (
                    <span className="px-3 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium">
                      {paisSeleccionado.prefijo_telefonico}
                    </span>
                  )}
                  <input
                    type="tel"
                    placeholder="987654321"
                    className="flex-1 border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    pattern={paisSeleccionado?.patron_telefono || ''}
                    autoComplete="tel"
                    maxLength={9}
                  />
                </div>
              </div>

              <div className="space-y-2 lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Marcas que distribuye <span className="text-red-500">*</span>
                </label>
                <Select
                  isMulti
                  value={marcasSeleccionadas}
                  onChange={(selectedOptions) => setMarcasSeleccionadas(selectedOptions as any[])}
                  options={marcasDisponibles.map(marca => ({
                    value: marca.id,
                    label: marca.nombre
                  }))}
                  placeholder="Selecciona las marcas que distribuyes..."
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
                {marcasSeleccionadas.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    También puedes escribir las marcas en el campo de comentarios al final si no las encuentras en la lista.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t.soporteTecnico} <span className="text-red-500">*</span>
                </label>
                <Select
                  options={[
                    { value: 'si', label: t.si },
                    { value: 'no', label: t.no }
                  ]}
                  placeholder={t.selecciona}
                  value={soporteTecnico ? { value: soporteTecnico, label: soporteTecnico === 'si' ? t.si : t.no } : null}
                  onChange={(option) => setSoporteTecnico(option?.value || '')}
                  classNamePrefix="react-select"
                  className="react-select-container"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#139ED4] mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-[#139ED4] text-white rounded-full flex items-center justify-center text-lg font-bold">2</span>
              {t.archivos}
            </h2>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">{t.archivosDesc1}</h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">{t.archivosDesc2}</p>
              <a
                href="/PLANTILLA EJEMPLO LISTA DE PRODUCTOS NUEVO PROVEEDOR.xlsx"
                download
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                📥 {t.descargarPlantilla}
              </a>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={Object.values(allowedFileTypes).join(',')}
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-[#139ED4] hover:bg-[#0f7ba3] text-white rounded-lg font-semibold transition-colors duration-200"
                >
                  📎 {t.elegirArchivos}
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {t.archivosNota}
                </p>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">Archivos seleccionados:</h4>
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                        📄 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="ml-2 text-red-600 hover:text-red-800 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#139ED4] mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-[#139ED4] text-white rounded-full flex items-center justify-center text-lg font-bold">3</span>
              {t.condicionesComerciales}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t.ofreceCredito}
                </label>
                <Select
                  options={[
                    { value: 'si', label: t.si },
                    { value: 'no', label: t.no }
                  ]}
                  placeholder={t.selecciona}
                  value={ofreceCredito ? { value: ofreceCredito, label: ofreceCredito === 'si' ? t.si : t.no } : null}
                  onChange={(option) => setOfreceCredito(option?.value || '')}
                  classNamePrefix="react-select"
                  className="react-select-container"
                />
              </div>

              {ofreceCredito === 'si' && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Días de crédito
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="365"
                      placeholder="30"
                      className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                      value={diasCredito}
                      onChange={e => setDiasCredito(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t.condicionesCredito}
                    </label>
                    <textarea
                      placeholder="Condiciones específicas del crédito..."
                      className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200 resize-none"
                      rows={3}
                      value={condicionesCredito}
                      onChange={e => setCondicionesCredito(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Moneda para pedido mínimo
                </label>
                <select
                  value={monedaMinimoPedido}
                  onChange={e => setMonedaMinimoPedido(parseInt(e.target.value))}
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white shadow-sm transition-all duration-200"
                >
                  {monedas.map(moneda => (
                    <option key={moneda.id} value={moneda.id}>
                      {moneda.codigo} - {moneda.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Descuento por volumen (%) <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="5.50"
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                  value={descuentoVolumen}
                  onChange={e => setDescuentoVolumen(e.target.value)}
                />
              </div>

              <div className="space-y-4 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Capacidades de entrega</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={entregaNacional}
                      onChange={e => setEntregaNacional(e.target.checked)}
                      className="w-5 h-5 text-[#139ED4] border-2 border-gray-300 rounded focus:ring-[#139ED4] focus:ring-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Entrega nacional</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={entregaInternacional}
                      onChange={e => setEntregaInternacional(e.target.checked)}
                      className="w-5 h-5 text-[#139ED4] border-2 border-gray-300 rounded focus:ring-[#139ED4] focus:ring-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Entrega internacional</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t.minimoPedido}
                </label>
                <input
                  type="text"
                  placeholder="Ejemplo: $500 USD mínimo"
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                  value={minimoPedido}
                  onChange={e => setMinimoPedido(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Margen negociado (%) <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="15.5"
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                  value={margenNegociado}
                  onChange={e => setMargenNegociado(e.target.value)}
                />
              </div>

              <div className="space-y-2 lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Detalles de entrega <span className="text-gray-400">(opcional)</span>
                </label>
                <textarea
                  placeholder="Detalles específicos sobre condiciones de entrega, tiempo de procesamiento, etc."
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200 resize-none"
                  rows={3}
                  value={detalleEntrega}
                  onChange={e => setDetalleEntrega(e.target.value)}
                />
              </div>

              <div className="space-y-2 lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t.comentarios}
                </label>
                <textarea
                  placeholder="Información adicional que consideres relevante..."
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#139ED4] focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200 resize-none"
                  rows={4}
                  value={comentarios}
                  onChange={e => setComentarios(e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (enviado) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-[#f8fcff] via-[#e9f6fc] to-[#daf2f9] dark:from-dark-bg dark:via-dark-surface dark:to-dark-accent pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t.gracias}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">{t.contactoProximo}</p>
            <BackButton 
              to="/"
              customText="Volver al inicio"
              variant="default"
              size="lg"
              className="px-6 py-3 bg-[#139ED4] hover:bg-[#0f7ba3] text-white rounded-lg font-semibold transition-colors duration-200"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#f8fcff] via-[#e9f6fc] to-[#daf2f9] dark:from-dark-bg dark:via-dark-surface dark:to-dark-accent">
      {/* Contenedor principal con padding superior para evitar superposición con header */}
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto h-full flex flex-col">

          {/* Botón Atrás */}
          <div className="mb-6">
            <BackButton 
              onClick={() => navigate(-1)}
              aria-label={t.atras || "Atrás"}
            />
          </div>

          {/* Header principal con título y indicador de pasos integrado */}
          <div className="mb-6">
            {/* Título del formulario */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {t.titulo}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
                {t.subtitulo}
              </p>
            </div>

          {/* Indicador de pasos integrado */}
          <StepIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepLabels={stepLabels}
            completedSteps={completedSteps}
          />
        </div>

        {/* Tarjeta principal del formulario optimizada para altura viewport */}
        <div className="bg-white/95 dark:bg-dark-surface/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden flex-1 flex flex-col">
          
          {/* Contenido del paso actual optimizado para altura */}
          <div className="p-6 flex-1 overflow-auto">
            {renderStep()}

            {/* Feedback */}
            {feedback && (
              <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${feedback.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                {feedback.message}
              </div>
            )}
          </div>

          {/* Botones de navegación fijos en la parte inferior */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex justify-between items-center">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="inline-flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t.anterior}
                </button>
              ) : (
                /* Botón "Atrás" para el paso 0 (acuerdo) - regresa al landing page */
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Atrás
                </button>
              )}

              <div className="flex gap-3">
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#139ED4] hover:bg-[#0f7ba3] text-white rounded-lg font-medium transition-all duration-200"
                  >
                    {t.siguiente}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {t.enviando}
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        {t.finalizar}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
};

export default ProveedorForm;
