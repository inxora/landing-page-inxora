/**
 * Configuración central de la aplicación
 * Centraliza URLs y configuraciones importantes para facilitar el mantenimiento
 */

// Configuración del entorno
export const APP_CONFIG = {
  // URL base de la aplicación (producción)
  BASE_URL: 'https://www.inxora.com',
  
  // URLs de desarrollo (comentadas para usar en development)
  // BASE_URL: 'http://localhost:5173',
  
  // Rutas de redirección para autenticación
  REDIRECT_URLS: {
    EMAIL_VERIFICATION: '/verificar-email',
    EMAIL_VERIFICATION_EN: '/verify-email', 
    PASSWORD_RESET: '/auth/update-password',
    AUTH_CALLBACK: '/auth/callback'
  },
  
  // API: ruta relativa /api/* → proxy/rewrite a app.inxora.com (evita CORS, mismo patrón que ecommerce-inxora)
  API_CATEGORIAS: '/api/categorias/',

  // WhatsApp (números con +51 Perú)
  WHATSAPP: {
    SARA: '51946885531',
    COTIZAR: '51946885531',
    getUrl: (phone: string, text?: string) => {
      const base = `https://wa.me/${phone}`;
      return text ? `${base}?text=${encodeURIComponent(text)}` : base;
    },
  },

  // Configuración de Supabase Auth
  getEmailRedirectUrl: (path: string) => `${APP_CONFIG.BASE_URL}${path}`,
  
  // URLs completas para redirección
  get EMAIL_VERIFICATION_URL() {
    return this.getEmailRedirectUrl(this.REDIRECT_URLS.EMAIL_VERIFICATION);
  },
  
  get EMAIL_VERIFICATION_EN_URL() {
    return this.getEmailRedirectUrl(this.REDIRECT_URLS.EMAIL_VERIFICATION_EN);
  },
  
  get PASSWORD_RESET_URL() {
    return this.getEmailRedirectUrl(this.REDIRECT_URLS.PASSWORD_RESET);
  },
  
  get AUTH_CALLBACK_URL() {
    return this.getEmailRedirectUrl(this.REDIRECT_URLS.AUTH_CALLBACK);
  }
};

export default APP_CONFIG;
