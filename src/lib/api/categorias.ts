/**
 * Servicio de categorías - Consume /api/categorias (mismo patrón que ecommerce-inxora)
 * Ruta relativa /api/categorias → proxy a app.inxora.com
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
  data: { categoria: CategoriaApi[]; total: number }
  message?: string
}

export async function getCategorias(): Promise<CategoriaApi[]> {
  const response = await apiClient<CategoriasResponse>('/api/categorias/')

  if (!response?.success || !response?.data?.categoria) {
    throw new Error(response?.message ?? 'Error al cargar categorías')
  }

  const categorias = response.data.categoria as CategoriaApi[]
  return categorias.filter((c) => c.activo)
}
