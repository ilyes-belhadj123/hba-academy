export interface Lead {
  _id: string
  source: string
  coordonnees: {
    nom: string
    email: string
    telephone: string
  }
  formation_interet: string | null
  formation_titre: string | null
  statut: 'nouveau' | 'qualifie' | 'converti' | 'perdu'
  created_at: string | null
}
