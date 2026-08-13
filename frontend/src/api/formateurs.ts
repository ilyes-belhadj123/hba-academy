import { clearCache, withCache } from './cache'
import { apiDelete, apiGet, apiPost, apiPut } from './client'
import type { Formateur, FormateurInput } from '../types/formateur'

export function fetchFormateurs(filters: { filiere?: string; formation_id?: string } = {}): Promise<Formateur[]> {
  const key = `/api/formateurs?${new URLSearchParams(filters as Record<string, string>).toString()}`
  return withCache(key, () => apiGet<Formateur[]>('/api/formateurs', filters))
}

export function fetchFormateurById(id: string): Promise<Formateur> {
  return withCache(`/api/formateurs/${id}`, () => apiGet<Formateur>(`/api/formateurs/${id}`))
}

export function createFormateur(payload: FormateurInput, token: string): Promise<Formateur> {
  return apiPost<Formateur>('/api/admin/formateurs', payload, token).then((result) => {
    clearCache('/api/formateurs')
    return result
  })
}

export function updateFormateur(
  id: string,
  payload: Partial<FormateurInput>,
  token: string,
): Promise<Formateur> {
  return apiPut<Formateur>(`/api/admin/formateurs/${id}`, payload, token).then((result) => {
    clearCache('/api/formateurs')
    return result
  })
}

export function deleteFormateur(id: string, token: string): Promise<void> {
  return apiDelete<void>(`/api/admin/formateurs/${id}`, token).then((result) => {
    clearCache('/api/formateurs')
    return result
  })
}
