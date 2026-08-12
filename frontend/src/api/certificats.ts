import { apiGet, apiPost } from './client'
import type { Certificat, CertificatVerification } from '../types/certificat'

export function fetchVerification(code: string): Promise<CertificatVerification> {
  return apiGet<CertificatVerification>(`/api/certificats/verifier/${code}`)
}

export function genererCertificat(
  userId: string,
  formationId: string,
  token: string,
): Promise<Certificat> {
  return apiPost<Certificat>('/api/certificats/generer', { user_id: userId, formation_id: formationId }, token)
}
