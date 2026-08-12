export interface FormationSession {
  _id: string
  formation_id: string
  date_debut: string
  date_fin: string
  capacite_max: number
  places_prises: number
  places_restantes: number
  formateur_id: string | null
}
