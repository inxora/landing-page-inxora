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
      <div className="bg-white rounded-lg border border-gray-200 p-6">
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
                          ? 'bg-primary border-primary text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                      }
                    `}
                  >
                    {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : stepNumber}
                  </div>
                  
                  {/* Etiqueta del paso */}
                  <span className={`
                    mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-center leading-tight px-1
                    ${isActive 
                      ? 'text-primary' 
                      : isCompleted 
                        ? 'text-green-600' 
                        : 'text-gray-500'
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
                      ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}
                    `} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        
        {/* Barra de progreso simple */}
        <div className="mt-6 bg-gray-100 rounded-full h-1">
          <div 
            className="h-full bg-primary transition-all duration-300 rounded-full"
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
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([false, false, false, false]);
  const totalSteps = 4;
  const stepLabels = ["Acuerdo", t.paso1 || "Datos Empresa", t.paso2 || "Archivos", t.paso3 || "Condiciones"];

  // Estado para el acuerdo
  const [acuerdoAceptado, setAcuerdoAceptado] = useState(false);

  // Estados para datos de referencia
  const [paises, setPaises] = useState<any[]>([]);
  const [marcasDisponibles, setMarcasDisponibles] = useState<any[]>([]);
  const [monedas, setMonedas] = useState<any[]>([]);
  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState<any[]>([]);
  const [paisSeleccionado, setPaisSeleccionado] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [dataLoadError, setDataLoadError] = useState(false);

  // Estados del formulario
  const [enviado, setEnviado] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para cada campo del formulario
  const [razonSocial, setRazonSocial] = useState("");
  const [documentoEmpresa, setDocumentoEmpresa] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nombreContacto, setNombreContacto] = useState("");
  const [apellidosContacto, setApellidosContacto] = useState("");
  const [correoContacto, setCorreoContacto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [soporteTecnico, setSoporteTecnico] = useState("");
  const [entregaNacional, setEntregaNacional] = useState(true);
  const [entregaInternacional, setEntregaInternacional] = useState(false);
  const [minimoPedido, setMinimoPedido] = useState("");
  const [monedaMinimoPedido, setMonedaMinimoPedido] = useState(1);
  const [margenNegociado, setMargenNegociado] = useState("");
  const [paisId, setPaisId] = useState(1);
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

  // Datos fallback para cuando Supabase no esté disponible
  const getFallbackData = () => {
    const paisesFallback = [
      { 
        id: 1, 
        nombre: 'Perú', 
        iso_code_2: 'PE', 
        prefijo_telefonico: '+51', 
        patron_telefono: '^[0-9]{9}$' 
      }
    ];
    
    const monedasFallback = [
      { id: 1, codigo: 'PEN', nombre: 'Sol Peruano', simbolo: 'S/' },
      { id: 2, codigo: 'USD', nombre: 'Dólar Americano', simbolo: '$' }
    ];
    
    return { paisesFallback, monedasFallback };
  };

  // Cargar datos de referencia al montar el componente - MEJORADO
  useEffect(() => {
    const cargarDatosReferencia = async () => {
      setLoadingData(true);
      setDataLoadError(false);
      
      try {
        console.log('Iniciando carga de datos de referencia...');
        
        // Timeout para evitar esperas infinitas
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 10000)
        );
        
        const dataPromises = Promise.all([
          getPaises().catch(err => { console.error('Error países:', err); return []; }),
          getMarcas().catch(err => { console.error('Error marcas:', err); return []; }),
          getMonedas().catch(err => { console.error('Error monedas:', err); return []; })
        ]);
        
        const [paisesData, marcasData, monedasData] = await Promise.race([
          dataPromises,
          timeoutPromise
        ]) as [any[], any[], any[]];

        console.log('Datos cargados - Países:', paisesData?.length, 'Marcas:', marcasData?.length, 'Monedas:', monedasData?.length);

        // Usar datos cargados o fallback
        const { paisesFallback, monedasFallback } = getFallbackData();
        
        setPaises(paisesData?.length > 0 ? paisesData : paisesFallback);
        setMarcasDisponibles(marcasData || []);
        setMonedas(monedasData?.length > 0 ? monedasData : monedasFallback);

        // Establecer país por defecto (Perú)
        const paisesActuales = paisesData?.length > 0 ? paisesData : paisesFallback;
        const peru = paisesActuales.find(p => p.iso_code_2 === 'PE');
        if (peru) {
          setPaisSeleccionado(peru);
          setPaisId(peru.id);
        }

        // Mostrar advertencia si hay problemas de conectividad
        if (!paisesData?.length || !monedasData?.length) {
          setDataLoadError(true);
          setFeedback({
            type: 'error',
            message: 'Conexión limitada detectada. El formulario funcionará con datos básicos. Las marcas pueden agregarse en comentarios.'
          });
        }

      } catch (error) {
        console.error('Error al cargar datos de referencia:', error);
        setDataLoadError(true);
        
        // Usar datos fallback
        const { paisesFallback, monedasFallback } = getFallbackData();
        setPaises(paisesFallback);
        setMonedas(monedasFallback);
        setPaisSeleccionado(paisesFallback[0]);
        setPaisId(1);
        setMarcasDisponibles([]);

        setFeedback({
          type: 'error',
          message: 'Error de conectividad. El formulario funcionará con datos básicos. Puede especificar las marcas en comentarios.'
        });
      } finally {
        setLoadingData(false);
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

  // Validaciones por paso - MEJORADAS
  const validateStep = (step: number): string | null => {
    console.log('Validando paso:', step);
    
    switch (step) {
      case 0: // Acuerdo de colaboración
        if (!acuerdoAceptado) return "Debe aceptar el acuerdo de colaboración comercial para continuar";
        return null;
      
      case 1: // Datos de la empresa
        if (!razonSocial.trim()) return t.validaciones?.razonSocial || "Razón social es obligatoria";
        if (!documentoEmpresa.trim()) return t.validaciones?.ruc || "Documento de empresa es obligatorio";
        if (!direccion.trim()) return t.validaciones?.direccion || "Dirección es obligatoria";
        if (!nombreContacto.trim()) return t.validaciones?.contacto || "Nombre de contacto es obligatorio";
        if (!apellidosContacto.trim()) return "Los apellidos del contacto son obligatorios";
        if (!correoContacto.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) return t.validaciones?.correoContacto || "Email inválido";
        if (!telefono.trim()) return t.validaciones?.telefono || "Teléfono es obligatorio";
        
        // Validar teléfono según el patrón del país seleccionado
        if (paisSeleccionado && paisSeleccionado.patron_telefono) {
          const patronTelefono = new RegExp(paisSeleccionado.patron_telefono);
          if (!patronTelefono.test(telefono)) return t.validaciones?.telefonoFormato || "Formato de teléfono inválido";
        } else if (!telefono.match(/^[0-9]{7,15}$/)) {
          return "Formato de teléfono inválido";
        }
        
        // Solo validar marcas si están disponibles (conectividad OK)
        if (!dataLoadError && marcasDisponibles.length > 0 && marcasSeleccionadas.length === 0) {
          return "Debe seleccionar al menos una marca o especificarlas en comentarios";
        }
        
        if (!soporteTecnico) return t.validaciones?.soporteTecnico || "Soporte técnico es obligatorio";
        return null;

      case 2: // Documentos - es opcional
        if (files.length > 5) return t.validaciones?.maxArchivos || "Máximo 5 archivos";
        for (const file of files) {
          if (!Object.keys(allowedFileTypes).includes(file.type)) {
            return (t.validaciones?.archivoNoPermitido || "Archivo no permitido: {file}").replace('{file}', file.name);
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
      return (t.validaciones?.tipoArchivo || "Tipo de archivo no válido: {file}").replace('{file}', file.name);
    }
    if (file.size > MAX_FILE_SIZE) {
      return (t.validaciones?.tamanoArchivo || "Archivo muy grande: {file}").replace('{file}', file.name);
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s_\-.()'´]+$/.test(file.name)) {
      return (t.validaciones?.nombreArchivo || "Nombre de archivo inválido: {file}").replace('{file}', file.name);
    }
    return null;
  };

  // Navegación entre pasos - MEJORADA
  const goToNextStep = () => {
    console.log('goToNextStep llamado - currentStep:', currentStep, 'acuerdoAceptado:', acuerdoAceptado);
    
    const error = validateStep(currentStep);
    if (error) {
      console.log('Error de validación:', error);
      setFeedback({ type: 'error', message: error });
      return;
    }

    console.log('Validación pasada, avanzando paso...');
    setFeedback(null);
    
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[currentStep] = true;
    setCompletedSteps(newCompletedSteps);

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      console.log('Nuevo currentStep será:', currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    setFeedback(null);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  // Manejo de archivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);

    if (selected.length + files.length > 5) {
      setFeedback({ type: 'error', message: t.validaciones?.maxArchivos || "Máximo 5 archivos" });
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
    if (!paisSeleccionado || paisSeleccionado.iso_code_2 !== 'PE') {
      setApiFeedback({ type: 'error', message: 'Búsqueda de RUC solo disponible para Perú' });
      return;
    }

    if (!documentoEmpresa.trim() || documentoEmpresa.length !== 11) {
      setApiFeedback({ type: 'error', message: 'RUC debe tener 11 dígitos' });
      return;
    }

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
        throw new Error('Servicio no disponible');
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
        throw new Error('Datos incompletos');
      }
    } catch (error) {
      console.error('Error API RUC:', error);
      setApiFeedback({ 
        type: 'error', 
        message: 'Servicio temporalmente no disponible. Ingrese los datos manualmente.' 
      });
    }
  };

  // Manejo del envío del formulario - MEJORADO
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    console.log('Iniciando envío del formulario...');

    // Validar paso obligatorio (solo paso 1)
    const error = validateStep(1);
    if (error) {
      setFeedback({ type: 'error', message: error });
      setCurrentStep(1);
      return;
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

      // 2. Crear proveedor con comentarios mejorados
      let comentariosFinal = comentarios;
      if (dataLoadError && marcasSeleccionadas.length === 0) {
        comentariosFinal += (comentariosFinal ? '\n\n' : '') + 
          'NOTA: Marcas no especificadas debido a problemas de conectividad. Favor contactar para completar información.';
      }

      const proveedorData = {
        razon_social: razonSocial,
        documento_empresa: documentoEmpresa,
        direccion: direccion,
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
        comentarios: comentariosFinal,
        activo: true
      };

      const proveedorResult = await insertProveedor(proveedorData);
      if (!proveedorResult.success) {
        throw new Error('Error al crear proveedor');
      }

      const proveedorId = proveedorResult.data?.[0]?.id;

      // 3. Crear relaciones proveedor-marca solo si hay marcas seleccionadas
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
        try {
          const fileUploadResult = await uploadProveedorFiles(files, proveedorId);
          if (fileUploadResult.success) {
            setFeedback({ 
              type: 'success', 
              message: `Proveedor registrado exitosamente con ${fileUploadResult.archivos?.length || 0} archivo(s) adjunto(s).` 
            });
          } else {
            setFeedback({ 
              type: 'success', 
              message: 'Proveedor registrado exitosamente, pero hubo problemas al subir algunos archivos.' 
            });
          }
        } catch (fileError) {
          console.warn('Error al subir archivos:', fileError);
          setFeedback({ 
            type: 'success', 
            message: 'Proveedor registrado exitosamente, pero hubo problemas al subir los archivos.' 
          });
        }
      } else {
        setFeedback({ type: 'success', message: 'Proveedor registrado exitosamente.' });
      }

      setEnviado(true);
      console.log('Formulario enviado exitosamente');

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

  // Renderizado de cada paso - CORREGIDO
  const renderStep = () => {
    console.log('Renderizando paso:', currentStep); // Debug
    
    switch (currentStep) {
      case 0: // Acuerdo de colaboración
        return (
          <div className="space-y-6 h-full flex flex-col">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 flex flex-col overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t.introTitulo || 'Acuerdo de Colaboración Comercial'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Para proveedores interesados en nuestra plataforma
                </p>
              </div>
              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t.introLinea1 || 'INXORA es una plataforma B2B que conecta proveedores industriales con empresas compradoras, facilitando transacciones comerciales eficientes y transparentes.'}
                  </p>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      {t.introQuienes || 'Quiénes somos'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                      {t.introQuienesDesc || 'Somos INXORA, un marketplace B2B especializado en suministros industriales que opera como intermediario comercial inteligente.'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      {t.introQueBuscamos || 'Qué buscamos'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                      {t.introQueBuscamosDesc || 'Buscamos proveedores confiables que puedan ofrecer productos industriales de calidad con condiciones comerciales competitivas.'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      {t.introQueNecesitamos || 'Qué necesitamos'}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {t.introQueNecesitamosDesc || 'Necesitamos que complete este formulario con información precisa y actualizada de su empresa y productos.'}
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
                    onChange={(e) => {
                      console.log('Checkbox cambiado a:', e.target.checked);
                      setAcuerdoAceptado(e.target.checked);
                    }}
                    className="mt-0.5 w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-1 focus:ring-primary"
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

      case 1: // Datos de la empresa - CORREGIDO: No duplicar el acuerdo
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold">1</span>
              {t.datosEmpresa || "Datos de la Empresa"}
            </h2>

            {loadingData && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-700">Cargando datos...</span>
              </div>
            )}

            {dataLoadError && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>Modo offline:</strong> Funcionando con datos básicos. Las marcas pueden especificarse en comentarios.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                País <span className="text-red-500">*</span>
              </label>
              <select
                value={paisId}
                onChange={e => setPaisId(parseInt(e.target.value))}
                className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white shadow-sm transition-all duration-200"
                disabled={loadingData}
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
                  {t.razonSocial || "Razón Social"} <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder={(t.razonSocial || "Razón Social") + ' (se autocompletará con el RUC)'}
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                  value={razonSocial}
                  onChange={e => setRazonSocial(e.target.value)}
                  autoComplete="organization"
                  readOnly={razonSocialBloqueado}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {paisSeleccionado && paisSeleccionado.iso_code_2 === 'PE' ? (t.ruc || 'RUC') : 'Documento de Identidad Fiscal'} <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    required
                    type="text"
                    placeholder="20123456789"
                    className="flex-1 border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
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
                      className="px-4 py-3 bg-primary hover:bg-primary/80 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors duration-200 whitespace-nowrap"
                    >
                      {t.buscar || 'Buscar'}
                    </button>
                  )}
                </div>

                {apiFeedback && (
                  <div className={`text-sm p-2 rounded ${
                    apiFeedback.type === 'loading' ? 'bg-blue-50 text-blue-700' :
                    apiFeedback.type === 'error' ? 'bg-red-50 text-red-700' :
                    'bg-green-50 text-green-700'
                  }`}>
                    {apiFeedback.message}
                  </div>
                )}
              </div>

              <div className="space-y-2 lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t.direccion || "Dirección"} <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Av. Principal 123, Distrito, Provincia"
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
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
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
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
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                  value={apellidosContacto}
                  onChange={e => setApellidosContacto(e.target.value)}
                  autoComplete="family-name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t.correoContacto || "Correo de Contacto"} <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  placeholder="contacto@empresa.com"
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                  value={correoContacto}
                  onChange={e => setCorreoContacto(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t.telefono || "Teléfono"} <span className="text-red-500">*</span>
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
                    className="flex-1 border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
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
                    className="flex-1 border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
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
                  Marcas que distribuye {!dataLoadError && <span className="text-red-500">*</span>}
                  {dataLoadError && <span className="text-gray-400">(especificar en comentarios)</span>}
                </label>
                <Select
                  isMulti
                  isDisabled={loadingData || marcasDisponibles.length === 0}
                  value={marcasSeleccionadas}
                  onChange={(selectedOptions) => setMarcasSeleccionadas(selectedOptions as any[])}
                  options={marcasDisponibles.map(marca => ({
                    value: marca.id,
                    label: marca.nombre
                  }))}
                  placeholder={
                    loadingData ? "Cargando marcas..." : 
                    marcasDisponibles.length === 0 ? "Sin conexión - especificar en comentarios" :
                    "Selecciona las marcas que distribuyes..."
                  }
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
                {(marcasSeleccionadas.length === 0 || dataLoadError) && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {dataLoadError 
                      ? "Especifique las marcas que distribuye en el campo de comentarios al final del formulario."
                      : "También puedes escribir las marcas en el campo de comentarios al final si no las encuentras en la lista."
                    }
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t.soporteTecnico || "Soporte Técnico"} <span className="text-red-500">*</span>
                </label>
                <Select
                  options={[
                    { value: 'si', label: t.si || 'Sí' },
                    { value: 'no', label: t.no || 'No' }
                  ]}
                  placeholder={t.selecciona || "Selecciona una opción"}
                  value={soporteTecnico ? { 
                    value: soporteTecnico, 
                    label: soporteTecnico === 'si' ? (t.si || 'Sí') : (t.no || 'No') 
                  } : null}
                  onChange={(option) => setSoporteTecnico(option?.value || '')}
                  classNamePrefix="react-select"
                  className="react-select-container"
                />
              </div>
            </div>
          </div>
        );

      case 2: // Archivos
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold">2</span>
              {t.archivos || "Documentos"}
            </h2>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                {t.archivosDesc1 || "Documentos opcionales"}
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                {t.archivosDesc2 || "Puede adjuntar catálogos, listas de precios, certificados, etc."}
              </p>
              <a
                href="/PLANTILLA EJEMPLO LISTA DE PRODUCTOS NUEVO PROVEEDOR.xlsx"
                download
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                📥 {t.descargarPlantilla || "Descargar plantilla"}
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
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-lg font-semibold transition-colors duration-200"
                >
                  📎 {t.elegirArchivos || "Elegir archivos"}
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {t.archivosNota || "Máximo 5 archivos de 10MB cada uno"}
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

      case 3: // Condiciones comerciales
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold">3</span>
              {t.condicionesComerciales || "Condiciones Comerciales"}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t.ofreceCredito || "¿Ofrece crédito?"}
                </label>
                <Select
                  options={[
                    { value: 'si', label: t.si || 'Sí' },
                    { value: 'no', label: t.no || 'No' }
                  ]}
                  placeholder={t.selecciona || "Selecciona una opción"}
                  value={ofreceCredito ? { 
                    value: ofreceCredito, 
                    label: ofreceCredito === 'si' ? (t.si || 'Sí') : (t.no || 'No') 
                  } : null}
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
                      className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                      value={diasCredito}
                      onChange={e => setDiasCredito(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t.condicionesCredito || "Condiciones de crédito"}
                    </label>
                    <textarea
                      placeholder="Condiciones específicas del crédito..."
                      className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200 resize-none"
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
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white shadow-sm transition-all duration-200"
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
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
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
                      className="w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Entrega nacional</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={entregaInternacional}
                      onChange={e => setEntregaInternacional(e.target.checked)}
                      className="w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Entrega internacional</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t.minimoPedido || "Pedido mínimo"}
                </label>
                <input
                  type="text"
                  placeholder="Ejemplo: $500 USD mínimo"
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
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
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
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
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200 resize-none"
                  rows={3}
                  value={detalleEntrega}
                  onChange={e => setDetalleEntrega(e.target.value)}
                />
              </div>

              <div className="space-y-2 lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t.comentarios || "Comentarios adicionales"}
                  {dataLoadError && <span className="text-primary"> - Especificar marcas aquí</span>}
                </label>
                <textarea
                  placeholder={
                    dataLoadError 
                      ? "IMPORTANTE: Especifique aquí las marcas que distribuye y cualquier información adicional relevante..."
                      : "Información adicional que consideres relevante..."
                  }
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200 resize-none"
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
      <section className="min-h-screen bg-white pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gray-50 rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.gracias || "¡Gracias!"}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {t.contactoProximo || "Nos contactaremos contigo pronto para continuar el proceso de colaboración."}
            </p>
            <BackButton 
              to="/"
              customText="Volver al inicio"
              variant="default"
              size="lg"
              className="px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-lg font-semibold transition-colors duration-200"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto h-full flex flex-col">

          {/* Header principal con título y indicador de pasos integrado */}
          <div className="mb-8">
            {/* Botón Atrás integrado en el header */}
            <div className="mb-6">
              <BackButton 
                onClick={() => navigate(-1)}
                variant="ghost"
                size="md"
                className="text-gray-600 hover:text-primary"
                aria-label={t.atras || "Atrás"}
              />
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {t.titulo || "Registro de Proveedor"}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                {t.subtitulo || "Complete la información para ser parte de nuestra red de proveedores"}
              </p>
            </div>

            <StepIndicator
              currentStep={currentStep}
              totalSteps={totalSteps}
              stepLabels={stepLabels}
              completedSteps={completedSteps}
            />
          </div>

          {/* Tarjeta principal del formulario */}
          <div className="bg-white/95 dark:bg-dark-surface/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden flex-1 flex flex-col">
            
            {/* Contenido del paso actual */}
            <div className="p-6 flex-1 overflow-auto">
              {renderStep()}

              {/* Feedback */}
              {feedback && (
                <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
                  feedback.type === 'error'
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
                    {t.anterior || "Anterior"}
                  </button>
                ) : (
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
                  {currentStep < totalSteps - 1 ? (
                    <button
                      type="button"
                      onClick={goToNextStep}
                      disabled={loadingData && currentStep === 0}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 disabled:bg-primary/50 text-white rounded-lg font-medium transition-all duration-200"
                    >
                      {t.siguiente || "Siguiente"}
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
                          {t.enviando || "Enviando..."}
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          {t.finalizar || "Finalizar"}
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