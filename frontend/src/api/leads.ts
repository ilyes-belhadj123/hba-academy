import { API_BASE_URL, apiGet, apiPatch } from './client'
import type { Lead } from '../types/lead'

export function fetchLeads(
  filters: { source?: string; statut?: string },
  token: string,
): Promise<Lead[]> {
  return apiGet<Lead[]>('/api/admin/leads', filters, token)
}

export function updateLeadStatut(id: string, statut: string, token: string): Promise<Lead> {
  return apiPatch<Lead>(`/api/admin/leads/${id}`, { statut }, token)
}

export async function downloadLeadsCsv(token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/leads/export`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    throw new Error("Échec de l'export CSV")
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'leads.csv'
  link.click()
  URL.revokeObjectURL(url)
}
