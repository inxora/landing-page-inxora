import { Language } from './language';

export const routeSlugs = {
  home: {
    es: '/',
    en: '/',
    pt: '/',
  },
  providersForm: {
    es: '/formulario-para-proveedores',
    en: '/suppliers-form',
    pt: '/formulario-para-fornecedores',
  },
  privacy: {
    es: '/politica-de-privacidad',
    en: '/privacy-policy',
    pt: '/politica-de-privacidade',
  },
  cookies: {
    es: '/politica-de-cookies',
    en: '/cookies-policy',
    pt: '/politica-de-cookies',
  },
  terms: {
    es: '/terminos-y-condiciones',
    en: '/terms-and-conditions',
    pt: '/termos-e-condicoes',
  },
  legal: {
    es: '/aviso-legal',
    en: '/legal-notice',
    pt: '/aviso-legal',
  },
  claims: {
    es: '/libro-de-reclamaciones',
    en: '/claims-book',
    pt: '/livro-de-reclamacoes',
  },
  investors: {
    es: '/inversores',
    en: '/investors',
    pt: '/investidores',
  },
  register: {
    es: '/registro',
    en: '/register',
    pt: '/registro',
  },
  updatePassword: {
    es: '/auth/update-password',
    en: '/auth/update-password',
    pt: '/auth/update-password',
  },
  emailConfirmed: {
    es: '/correo-confirmado',
    en: '/email-confirmed',
    pt: '/email-confirmado',
  },
  careers: {
    es: '/trabaja-con-nosotros',
    en: '/careers',
    pt: '/trabalhe-conosco',
  },
  emailVerification: {
    es: '/verificar-email',
    en: '/verify-email',
    pt: '/verificar-email',
  },
};

export function getRouteByLang(routeKey: keyof typeof routeSlugs, lang: Language): string {
  return routeSlugs[routeKey][lang] || routeSlugs[routeKey]['es'];
}

// Helper para encontrar la clave de ruta a partir de un pathname
export function getRouteKeyByPath(path: string): keyof typeof routeSlugs | null {
  for (const key in routeSlugs) {
    if (Object.values(routeSlugs[key as keyof typeof routeSlugs]).includes(path)) {
      return key as keyof typeof routeSlugs;
    }
  }
  return null;
} 