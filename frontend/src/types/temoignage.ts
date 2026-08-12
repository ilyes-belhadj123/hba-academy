export interface Temoignage {
  _id: string
  formation_id: string
  auteur: string
  contenu: string
  media: string[]
  statut_publication: 'brouillon' | 'publie'
}
