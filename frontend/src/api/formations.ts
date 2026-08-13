import { withCache } from './cache'
import { apiGet } from './client'
import type { Formation, FormationFilters } from '../types/formation'
import type { Temoignage } from '../types/temoignage'

export function fetchFormations(filters: FormationFilters): Promise<Formation[]> {
  const key = `/api/formations?${new URLSearchParams(filters as Record<string, string>).toString()}`
  return withCache(key, () => apiGet<Formation[]>('/api/formations', filters))
}

export function fetchFilieres(): Promise<string[]> {
  return withCache('/api/formations/filieres', () => apiGet<string[]>('/api/formations/filieres'))
}

export function fetchFormationById(id: string): Promise<Formation> {
  return withCache(`/api/formations/${id}`, () => apiGet<Formation>(`/api/formations/${id}`))
}

export function fetchFormationTemoignages(id: string): Promise<Temoignage[]> {
  return apiGet<Temoignage[]>(`/api/formations/${id}/temoignages`)
}
