import { API_BASE_URL, apiGet, apiPost } from './client'
import type { Apprenant } from '../types/apprenant'

export function fetchApprenants(token: string): Promise<Apprenant[]> {
  return apiGet<Apprenant[]>('/api/admin/apprenants', undefined, token)
}

export function createApprenant(
  payload: { email: string; nom: string; password: string },
  token: string,
): Promise<Apprenant> {
  return apiPost<Apprenant>('/api/admin/apprenants', payload, token)
}

export function enrollApprenant(
  apprenantId: string,
  payload: { formation_id: string; session_id: string | null },
  token: string,
): Promise<Apprenant> {
  return apiPost<Apprenant>(`/api/admin/apprenants/${apprenantId}/formations`, payload, token)
}

export async function uploadDocument(
  apprenantId: string,
  file: File,
  titre: string,
  token: string,
): Promise<void> {
  const formData = new FormData()
  formData.append('file', file)

  const url = new URL(`${API_BASE_URL}/api/admin/apprenants/${apprenantId}/documents`)
  url.searchParams.set('titre', titre)

  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Échec de l'upload du document")
  }
}
