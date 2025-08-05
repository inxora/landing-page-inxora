import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useLanguage } from '../../../context/LanguageContext';
import { libroReclamacionesTranslation } from './libroReclamaciones';

export default function ClaimsBook() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  
  // Debug: verificar que las traducciones se cargan
  console.log('Lang:', lang);
  console.log('Translations:', libroReclamacionesTranslation);
  console.log('Translations[lang]:', libroReclamacionesTranslation[lang]);
  // console.log('Claims translations:', libroReclamacionesTranslation[lang]?.claims);
  
  const t = libroReclamacionesTranslation[lang];
  
  // Si no hay traducciones, usar español por defecto
  if (!t) {
    console.warn('No se encontraron traducciones para claims, usando español por defecto');
  }
  const [form, setForm] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    tipoDoc: "DNI",
    numDoc: "",
    celular: "",
    departamento: "",
    provincia: "",
    distrito: "",
    direccion: "",
    referencia: "",
    email: "",
    menorEdad: "no",
    tutorNombre: "",
    tutorEmail: "",
    tutorTipoDoc: "DNI",
    tutorNumDoc: "",
    tipoReclamo: "Reclamación",
    tipoConsumo: "Producto",
    numPedido: "",
    fechaReclamo: "",
    proveedor: "INXORA (TECNOTOTAL S.A.C.)",
    monto: "",
    descripcion: "",
    fechaCompra: "",
    fechaConsumo: "",
    fechaCaducidad: "",
    detalle: "",
    pedidoCliente: "",
    acepta: false
  });
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validación básica
    if (!form.nombre || !form.apellido1 || !form.tipoDoc || !form.numDoc || !form.celular || !form.departamento || !form.direccion || !form.email || !form.descripcion || !form.detalle || !form.pedidoCliente || !form.acepta) {
      setError(t?.validaciones?.camposObligatorios || "Campos obligatorios incompletos.");
      return;
    }
    
    // Validación de teléfono
    if (!form.celular.match(/^[0-9]{9}$/)) {
      setError(t?.validaciones?.telefonoFormato || "Formato de teléfono inválido.");
      return;
    }
    
    // Validación de email
    if (!form.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setError(t?.validaciones?.emailInvalido || "Correo electrónico inválido.");
      return;
    }
    
    setError("");
    setSubmitting(true);
    setTimeout(() => {
    setEnviado(true);
      setSubmitting(false);
    }, 1800);
  };

  console.log('LANG:', lang, 'T:', t);

  return (
    <section className="max-w-3xl mx-auto px-2 sm:px-4 lg:px-8 py-8 md:py-12 text-gray-800">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-[#139ED4] text-white rounded hover:bg-[#171D4C] transition-colors font-medium shadow"
        aria-label={t?.atras || "← Atrás"}
      >
        {t?.atras || "← Atrás"}
      </button>
      <Helmet>
        <title>{t?.title || "Libro de Reclamaciones"} | INXORA</title>
        <meta name="description" content={t?.subtitle || "Libro de Reclamaciones Virtual de INXORA"} />
        <meta property="og:title" content={`${t?.title || "Libro de Reclamaciones"} | INXORA`} />
        <meta property="og:description" content={t?.subtitle || "Libro de Reclamaciones Virtual de INXORA"} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={lang === 'es' ? 'es_PE' : lang === 'en' ? 'en_US' : 'pt_BR'} />
        <meta property="og:locale:alternate" content={lang === 'es' ? 'en_US' : 'es_PE'} />
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-bold text-[#171D4C] mb-6 text-center">{t?.title || "Libro de Reclamaciones"}</h1>
      <p className="mb-6 text-justify">{t?.subtitle || "Conforme a la Ley N° 29571, ponemos a tu disposición nuestro Libro de Reclamaciones Virtual."}</p>
      {enviado ? (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded text-center text-base md:text-lg">
          {t?.exito || "¡Tu reclamo ha sido enviado correctamente!"}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <fieldset className="border border-[#88D4E4] rounded p-3 sm:p-4">
            <legend className="font-semibold text-[#139ED4]">{t?.datosConsumidor || "Datos del consumidor reclamante"}</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block font-medium mb-1">{t?.nombre || "Nombre *"}</label>
                <input 
                  name="nombre" 
                  value={form.nombre} 
                  onChange={handleChange} 
                  className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                  required 
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t?.primerApellido || "Primer Apellido *"}</label>
                <input 
                  name="apellido1" 
                  value={form.apellido1} 
                  onChange={handleChange} 
                  className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                  required 
                  autoComplete="family-name"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t?.segundoApellido || "Segundo Apellido"}</label>
                <input 
                  name="apellido2" 
                  value={form.apellido2} 
                  onChange={handleChange} 
                  className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                  autoComplete="family-name"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t?.tipoDocumento || "Tipo de Documento *"}</label>
                <select name="tipoDoc" value={form.tipoDoc} onChange={handleChange} className="w-full border border-[#88D4E4] rounded px-3 py-2" autoComplete="off">
                  <option>{t?.dni || "DNI"}</option>
                  <option>{t?.ce || "CE"}</option>
                  <option>{t?.pasaporte || "Pasaporte"}</option>
                  <option>{t?.ruc || "RUC"}</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">{t?.numeroDocumento || "Número de Documento *"}</label>
                <input 
                  name="numDoc" 
                  value={form.numDoc} 
                  onChange={handleChange} 
                  className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                  required 
                  autoComplete="off"
                  maxLength={11}
                  pattern="[0-9]{8,11}"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t?.celular || "Celular *"}</label>
                <input 
                  name="celular" 
                  value={form.celular} 
                  onChange={handleChange} 
                  className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                  required 
                  autoComplete="tel"
                  maxLength={9}
                  pattern="[0-9]{9}"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t?.departamento || "Departamento *"}</label>
                <select name="departamento" value={form.departamento} onChange={handleChange} className="w-full border border-[#88D4E4] rounded px-3 py-2" required autoComplete="off">
                  <option value="">{t?.selecciona || "Selecciona"}</option>
                  {(t?.departamentos || ["Amazonas", "Áncash", "Apurímac", "Arequipa", "Ayacucho", "Cajamarca", "Callao", "Cusco", "Huancavelica", "Huánuco", "Ica", "Junín", "La Libertad", "Lambayeque", "Lima", "Loreto", "Madre de Dios", "Moquegua", "Pasco", "Piura", "Puno", "San Martín", "Tacna", "Tumbes", "Ucayali"]).map((dep: string) => <option key={dep}>{dep}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">{t?.provincia || "Provincia"}</label>
                <input 
                  name="provincia" 
                  value={form.provincia} 
                  onChange={handleChange} 
                  className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                  autoComplete="address-level1"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t?.distrito || "Distrito"}</label>
                <input 
                  name="distrito" 
                  value={form.distrito} 
                  onChange={handleChange} 
                  className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                  autoComplete="address-level2"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t?.direccion || "Dirección *"}</label>
                <input 
                  name="direccion" 
                  value={form.direccion} 
                  onChange={handleChange} 
                  className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                  required 
                  autoComplete="street-address"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t?.referencia || "Referencia"}</label>
                <input 
                  name="referencia" 
                  value={form.referencia} 
                  onChange={handleChange} 
                  className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                  autoComplete="off"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">{t?.correoElectronico || "Correo electrónico *"}</label>
                <input 
                  name="email" 
                  type="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                  required 
                  autoComplete="email"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">{t?.menorEdad || "¿Eres menor de edad?"}</label>
                <select name="menorEdad" value={form.menorEdad} onChange={handleChange} className="w-full border border-[#88D4E4] rounded px-3 py-2" autoComplete="off">
                  <option value="no">{t?.no || "No"}</option>
                  <option value="si">{t?.si || "Sí"}</option>
                </select>
              </div>
              {form.menorEdad === "si" && (
                <>
                  <div>
                    <label className="block font-medium mb-1">{t?.nombreTutor || "Nombre del Tutor"}</label>
                    <input 
                      name="tutorNombre" 
                      value={form.tutorNombre} 
                      onChange={handleChange} 
                      className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">{t?.correoTutor || "Correo del Tutor"}</label>
                    <input 
                      name="tutorEmail" 
                      type="email" 
                      value={form.tutorEmail} 
                      onChange={handleChange} 
                      className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">{t?.tipoDocumentoTutor || "Tipo de Documento del Tutor"}</label>
                    <select name="tutorTipoDoc" value={form.tutorTipoDoc} onChange={handleChange} className="w-full border border-[#88D4E4] rounded px-3 py-2" autoComplete="off">
                      <option>{t?.dni || "DNI"}</option>
                      <option>{t?.ce || "CE"}</option>
                      <option>{t?.pasaporte || "Pasaporte"}</option>
                      <option>{t?.ruc || "RUC"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">{t?.numeroDocumentoTutor || "Número de Documento del Tutor"}</label>
                    <input 
                      name="tutorNumDoc" 
                      value={form.tutorNumDoc} 
                      onChange={handleChange} 
                      className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                      autoComplete="off"
                      maxLength={11}
                      pattern="[0-9]{8,11}"
                    />
                  </div>
                </>
              )}
            </div>
          </fieldset>
          <fieldset className="border border-[#88D4E4] rounded p-3 sm:p-4">
            <legend className="font-semibold text-[#139ED4]">{t?.detalleReclamo || "Detalle del reclamo"}</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block font-medium mb-1">{t?.tipoReclamo || "Tipo de reclamo *"}</label>
                <select name="tipoReclamo" value={form.tipoReclamo} onChange={handleChange} className="w-full border border-[#88D4E4] rounded px-3 py-2" autoComplete="off">
                  <option>{t?.reclamacion || "Reclamación"}</option>
                  <option>{t?.queja || "Queja"}</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">{t?.tipoConsumo || "Tipo de consumo *"}</label>
                <select name="tipoConsumo" value={form.tipoConsumo} onChange={handleChange} className="w-full border border-[#88D4E4] rounded px-3 py-2" autoComplete="off">
                  <option>{t?.producto || "Producto"}</option>
                  <option>{t?.servicio || "Servicio"}</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">{t?.numeroPedido || "N° de pedido *"}</label>
                <input 
                  name="numPedido" 
                  value={form.numPedido} 
                  onChange={handleChange} 
                  className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t?.fechaReclamo || "Fecha de reclamo/queja"}</label>
                <input 
                  name="fechaReclamo" 
                  type="date" 
                  value={form.fechaReclamo} 
                  onChange={handleChange} 
                  className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                  autoComplete="off"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">{t?.proveedor || "Proveedor"}</label>
                <input 
                  name="proveedor" 
                  value={form.proveedor} 
                  onChange={handleChange} 
                  className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                  readOnly 
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t?.montoReclamado || "Monto reclamado (S/.)"}</label>
                <input 
                  name="monto" 
                  value={form.monto} 
                  onChange={handleChange} 
                  className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                  autoComplete="off"
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">{t?.descripcionProducto || "Descripción del producto o servicio *"}</label>
                <textarea 
                  name="descripcion" 
                  value={form.descripcion} 
                  onChange={handleChange} 
                  className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                  required 
                  rows={2} 
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t?.fechaCompra || "Fecha de compra"}</label>
                <input 
                  name="fechaCompra" 
                  type="date" 
                  value={form.fechaCompra} 
                  onChange={handleChange} 
                  className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t?.fechaConsumo || "Fecha de consumo"}</label>
                <input 
                  name="fechaConsumo" 
                  type="date" 
                  value={form.fechaConsumo} 
                  onChange={handleChange} 
                  className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t?.fechaCaducidad || "Fecha de caducidad"}</label>
                <input 
                  name="fechaCaducidad" 
                  type="date" 
                  value={form.fechaCaducidad} 
                  onChange={handleChange} 
                  className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                  autoComplete="off"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">{t?.detalleReclamacion || "Detalle de la Reclamación / Queja *"}</label>
                <textarea 
                  name="detalle" 
                  value={form.detalle} 
                  onChange={handleChange} 
                  className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                  required 
                  rows={2} 
                  autoComplete="off"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">{t?.pedidoCliente || "Pedido del Cliente *"}</label>
                <textarea 
                  name="pedidoCliente" 
                  value={form.pedidoCliente} 
                  onChange={handleChange} 
                  className="w-full border border-[#88D4E4] rounded px-3 py-2" 
                  required 
                  rows={2} 
                  autoComplete="off"
                />
              </div>
            </div>
          </fieldset>
          <div className="text-xs text-gray-600 mt-2 mb-2">
            <p>{t?.avisosLegales?.linea1 || "* La formulación del reclamo no excluye el recurso a otros medios de resolución de controversias."}</p>
            <p>{t?.avisosLegales?.linea2 || "* El proveedor debe responder a la reclamación en un plazo no superior a quince (15) días naturales."}</p>
            <p>{t?.avisosLegales?.linea3 || "* Con la firma de este documento, el cliente autoriza a ser contactado después de la tramitación."}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2 gap-2">
            <input type="checkbox" name="acepta" checked={form.acepta} onChange={handleChange} className="mr-2" required />
            <span className="text-sm">{t?.politicaPrivacidad || "He leído y acepto la Política de Privacidad y la Política de Cookies."}</span>
          </div>
          {error && <div className="text-red-600 font-medium mb-2">{error}</div>}
          <button type="submit" className="w-full bg-[#139ED4] hover:bg-[#171D4C] text-white px-4 py-2 md:py-3 rounded font-semibold shadow transition-colors flex items-center justify-center text-base md:text-lg disabled:opacity-60" disabled={submitting}>
            {submitting ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                {t?.enviando || 'Enviando...'}
              </>
            ) : (t?.enviarReclamo || "Enviar Reclamo")}
          </button>
        </form>
      )}
    </section>
  );
} 