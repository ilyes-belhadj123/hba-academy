import { API_BASE_URL, apiDelete, apiGet, apiPost, apiPut } from './client'
import type { Temoignage } from '../types/temoignage'

export interface TemoignageInput {
  formation_id: string
  auteur: string
  contenu: string
  media: string[]
  statut_publication: 'brouillon' | 'publie'
}

export function fetchTemoignagesPublies(): Promise<Temoignage[]> {
  return apiGet<Temoignage[]>('/api/temoignages')
}

export function fetchAllTemoignages(token: string): Promise<Temoignage[]> {
  return apiGet<Temoignage[]>('/api/admin/temoignages', undefined, token)
}

export function createTemoignage(payload: TemoignageInput, token: string): Promise<Temoignage> {
  return apiPost<Temoignage>('/api/admin/temoignages', payload, token)
}

export function updateTemoignage(
  id: string,
  payload: Partial<TemoignageInput>,
  token: string,
): Promise<Temoignage> {
  return apiPut<Temoignage>(`/api/admin/temoignages/${id}`, payload, token)
}

export function deleteTemoignage(id: string, token: string): Promise<void> {
  return apiDelete<void>(`/api/admin/temoignages/${id}`, token)
}

export async function uploadMedia(file: File, token: string): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/api/admin/medias`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Échec de l'upload du média")
  }
  const data = await response.json()
  return data.url
}
