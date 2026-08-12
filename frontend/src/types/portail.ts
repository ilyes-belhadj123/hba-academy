export interface PlanningItem {
  formation_id: string
  formation_titre: string
  session_id: string | null
  date_debut: string | null
  date_fin: string | null
  progression: number
}

export interface DocumentItem {
  _id: string
  titre: string
  formation_id: string | null
  created_at: string
  download_url: string
}
