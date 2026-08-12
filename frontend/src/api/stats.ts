import { apiGet } from './client'
import type { Stats } from '../types/stats'

export function fetchStats(
  filters: { date_debut?: string; date_fin?: string },
  token: string,
): Promise<Stats> {
  return apiGet<Stats>('/api/admin/stats', filters, token)
}
