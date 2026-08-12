import type { Formation } from './formation'

export type Objectif = 'parent' | 'jeune_adulte' | 'professionnel' | 'candidat_emigration'
export type NiveauOrientation = 'debutant' | 'intermediaire' | 'avance'
export type ModeOrientation = 'presentiel' | 'en_ligne' | 'peu_importe'

export interface OrientationReponses {
  objectif: Objectif
  filiere_cible: string
  niveau: NiveauOrientation
  mode: ModeOrientation
  age: number | null
}

export interface Recommandation {
  formation_principale: Formation
  alternatives: Formation[]
  justification: string
  source: 'ia' | 'regles'
}
