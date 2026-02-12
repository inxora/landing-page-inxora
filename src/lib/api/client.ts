/**
 * Cliente API - Mismo patrón que ecommerce-inxora
 * En browser: baseUrl = '' → fetch /api/* (mismo origen, proxy evita CORS)
 * VITE_API_URL vacío o no definido = usar proxy. Definir para llamar backend directo.
 */
const getApiBaseUrl = (): string => {
  const configured = import.meta.env.VITE_API_URL ?? ''
  return configured
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string
  ) {
    super(message || `API Error: ${status} ${statusText}`)
    this.name = 'ApiError'
  }
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${endpoint}`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(options?.headers ?? {}),
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
      credentials: 'omit',
    })

    clearTimeout(timeoutId)

    const text = await response.text()
    if (!response.ok) {
      let errorMessage = response.statusText
      try {
        const json = text ? JSON.parse(text) : null
        errorMessage = json?.message ?? json?.error ?? errorMessage
      } catch {
        if (text) errorMessage = text
      }
      throw new ApiError(response.status, response.statusText, errorMessage)
    }

    return (text ? JSON.parse(text) : {}) as T
  } catch (err) {
    clearTimeout(timeoutId)
    if (err instanceof ApiError) throw err
    throw err
  }
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean>) => {
    let url = endpoint
    if (params) {
      const qs = new URLSearchParams()
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined) qs.append(k, String(v))
      })
      const s = qs.toString()
      if (s) url += (endpoint.includes('?') ? '&' : '?') + s
    }
    return apiClient<T>(url)
  },
}
