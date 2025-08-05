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