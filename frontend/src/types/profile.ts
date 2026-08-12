export type VisitorProfileId = 'parent' | 'jeune_adulte' | 'professionnel' | 'candidat_emigration'

export interface VisitorProfileContent {
  id: VisitorProfileId
  label: string
  accroche: string
  description: string
  filieresMisesEnAvant: string[]
  temoignage: {
    auteur: string
    contenu: string
  }
}
