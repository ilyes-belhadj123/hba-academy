import { apiGet } from './client'
import type { Certificat } from '../types/certificat'
import type { DocumentItem, PlanningItem } from '../types/portail'

export function fetchPlanning(token: string): Promise<PlanningItem[]> {
  return apiGet<PlanningItem[]>('/api/portail/planning', undefined, token)
}

export function fetchDocuments(token: string): Promise<DocumentItem[]> {
  return apiGet<DocumentItem[]>('/api/portail/documents', undefined, token)
}

export function fetchMesCertificats(token: string): Promise<Certificat[]> {
  return apiGet<Certificat[]>('/api/portail/certificats', undefined, token)
}
