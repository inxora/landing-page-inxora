/**
 * Utilidad para construir URLs de categorías compatibles con tienda.inxora.com
 * Misma lógica que ecommerce-inxora/lib/product-url.ts
 */

const TIENDA_BASE_URL = 'https://tienda.inxora.com'

/**
 * Normaliza un nombre para usarlo en la URL (categoría, etc.)
 * Convierte a minúsculas, reemplaza espacios por guiones y limpia caracteres especiales
 */
export function normalizeName(name: string | undefined | null): string | undefined {
  if (!name || typeof name !== 'string') return undefined
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Construye la URL completa de una categoría en tienda.inxora.com
 * Formato: https://tienda.inxora.com/{locale}/{category-slug}
 */
export function buildCategoryUrl(
  categoryName: string,
  locale: string = 'es'
): string {
  const categorySlug = normalizeName(categoryName)
  if (!categorySlug) return `${TIENDA_BASE_URL}/${locale}/catalogo`
  return `${TIENDA_BASE_URL}/${locale}/${categorySlug}`
}

/**
 * Construye la URL del catálogo completo
 */
export function buildCatalogUrl(locale: string = 'es'): string {
  return `${TIENDA_BASE_URL}/${locale}/catalogo`
}
