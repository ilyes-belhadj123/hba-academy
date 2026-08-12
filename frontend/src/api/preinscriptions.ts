import { apiPost } from './client'
import type { Preinscription, PreinscriptionPayload } from '../types/preinscription'

export function createPreinscription(payload: PreinscriptionPayload): Promise<Preinscription> {
  return apiPost<Preinscription>('/api/preinscriptions', payload)
}
