// Constants for Header components
export const LANGUAGE_OPTIONS = [
  { value: 'es', label: 'Español', code: 'ES' },
  { value: 'en', label: 'English', code: 'EN' },
  { value: 'pt', label: 'Português', code: 'PT' },
] as const;

export const WHATSAPP_URL = "https://wa.me/51946885531?text=Hola%2C%20estoy%20interesado%20en%20cotizar%20productos%20industriales";

export const GEOIP_COUNTRIES = {
  PORTUGUESE: ["BR"],
  ENGLISH: ["US", "GB", "CA", "AU", "IE", "NZ", "ZA"],
} as const;

export const NAVIGATION_ITEMS = [
  { key: 'how-it-works', sectionId: 'comoFunciona', label: 'comoFunciona' },
  { key: 'products', sectionId: 'productos', label: 'productos' },
  { key: 'clients', sectionId: 'beneficios', label: 'clientes' },
  { key: 'providers', sectionId: 'proveedores', label: 'proveedores' },
] as const;
