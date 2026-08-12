export type TypeRealisation = 'chiffre_cle' | 'concours' | 'partenariat' | 'evenement'

export interface Realisation {
  _id: string
  type: TypeRealisation
  titre: string
  description: string
  date: string
  media: string[]
  mise_en_avant: boolean
  valeur: number | null
}

export type RealisationInput = Omit<Realisation, '_id'>
