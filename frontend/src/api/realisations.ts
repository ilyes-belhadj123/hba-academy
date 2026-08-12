import { apiDelete, apiGet, apiPost, apiPut } from './client'
import type { Realisation, RealisationInput } from '../types/realisation'

export function fetchRealisations(
  filters: { type?: string; mise_en_avant?: string } = {},
): Promise<Realisation[]> {
  return apiGet<Realisation[]>('/api/realisations', filters)
}

export function fetchChiffresCles(): Promise<Realisation[]> {
  return apiGet<Realisation[]>('/api/realisations/chiffres-cles')
}

export function fetchAllRealisationsAdmin(token: string): Promise<Realisation[]> {
  return apiGet<Realisation[]>('/api/admin/realisations', undefined, token)
}

export function createRealisation(payload: RealisationInput, token: string): Promise<Realisation> {
  return apiPost<Realisation>('/api/admin/realisations', payload, token)
}

export function updateRealisation(
  id: string,
  payload: Partial<RealisationInput>,
  token: string,
): Promise<Realisation> {
  return apiPut<Realisation>(`/api/admin/realisations/${id}`, payload, token)
}

export function deleteRealisation(id: string, token: string): Promise<void> {
  return apiDelete<void>(`/api/admin/realisations/${id}`, token)
}
