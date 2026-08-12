import { apiDelete, apiPost, apiPut } from './client'
import type { Formation, FormationInput } from '../types/formation'

export function createFormation(payload: FormationInput, token: string): Promise<Formation> {
  return apiPost<Formation>('/api/admin/formations', payload, token)
}

export function updateFormation(
  id: string,
  payload: Partial<FormationInput>,
  token: string,
): Promise<Formation> {
  return apiPut<Formation>(`/api/admin/formations/${id}`, payload, token)
}

export function deleteFormation(id: string, token: string): Promise<void> {
  return apiDelete<void>(`/api/admin/formations/${id}`, token)
}
