import { apiGet } from './client'
import type { FormationSession } from '../types/session'

export function fetchSessionsByFormation(formationId: string): Promise<FormationSession[]> {
  return apiGet<FormationSession[]>('/api/sessions', { formation_id: formationId })
}
