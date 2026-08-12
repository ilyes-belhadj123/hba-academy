export interface FormationSuivie {
  formation_id: string
  session_id: string | null
  progression: number
}

export interface Apprenant {
  _id: string
  email: string
  nom: string
  formations_suivies: FormationSuivie[]
}
