export type FormationMode = 'presentiel' | 'en_ligne'
export type FormationNiveau = 'debutant' | 'intermediaire' | 'avance'

export interface Formation {
  _id: string
  filiere: string
  titre: string
  description: string
  prerequis: string
  duree: string
  age_min: number
  age_max: number
  prix: number
  niveau: FormationNiveau
  mode: FormationMode
  medias: string[]
  badges_competences: string[]
}

export type FormationInput = Omit<Formation, '_id'>

export interface FormationFilters {
  filiere?: string
  age?: string
  duree?: string
  prix_max?: string
  niveau?: string
  mode?: string
  [key: string]: string | undefined
}
