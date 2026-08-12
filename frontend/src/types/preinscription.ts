export interface PreinscriptionPayload {
  session_id: string
  nom: string
  email: string
  telephone: string
  mineur: boolean
  consentement_parental: boolean
}

export interface Preinscription {
  _id: string
  lead_id: string
  session_id: string
  statut: 'en_attente' | 'confirmee' | 'annulee'
  date_creation: string
}
