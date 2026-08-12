export interface Formateur {
  _id: string
  nom: string
  photo: string | null
  filieres: string[]
  bio: string
  experiences_professionnelles: string[]
  certifications: string[]
  formations_dispensees: string[]
  temoignages_specifiques: string[]
}

export type FormateurInput = Omit<Formateur, '_id'>
