import { apiPost } from './client'
import type { OrientationReponses, Recommandation } from '../types/orientation'

export function fetchRecommandation(reponses: OrientationReponses): Promise<Recommandation> {
  return apiPost<Recommandation>('/api/orientation/recommander', reponses)
}

export function envoyerResultatParEmail(payload: {
  email: string
  formation_principale_id: string
  alternatives_ids: string[]
  justification: string
}): Promise<void> {
  return apiPost<void>('/api/orientation/envoyer-email', payload)
}
