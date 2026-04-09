/**
 * Servicio de categorías - Consume /api/categorias (mismo patrón que ecommerce-inxora)
 * Ruta relativa /api/categorias → proxy a api.inxora.com
 */

import { apiClient } from './client'

export interface CategoriaApi {
  id: number
  nombre: string
  descripcion: string
  activo: boolean
  logo_url: string | null
}

interface CategoriasResponse {
  success: boolean
  /** API actual (api.inxora.com) usa `categorias`; `categoria` por compatibilidad */
  data: { categorias?: CategoriaApi[]; categoria?: CategoriaApi[]; total?: number }
  message?: string
}

export async function getCategorias(): Promise<CategoriaApi[]> {
  const response = await apiClient<CategoriasResponse>('/api/categorias/')

  const lista =
    response?.data?.categorias ?? response?.data?.categoria ?? null

  if (!response?.success || !lista || !Array.isArray(lista)) {
    throw new Error(response?.message ?? 'Error al cargar categorías')
  }

  return lista.filter((c) => c.activo)
}
