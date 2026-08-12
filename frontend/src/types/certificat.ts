export interface Certificat {
  _id: string
  user_id: string
  formation_id: string
  date_emission: string
  code_verification: string
  url_pdf: string
}

export interface CertificatVerification {
  valide: boolean
  nom_affiche: string | null
  formation_titre: string | null
  date_emission: string | null
}
