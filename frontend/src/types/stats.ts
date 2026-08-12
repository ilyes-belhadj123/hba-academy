export interface StatParSource {
  source: string
  total: number
  convertis: number
  taux_conversion: number
}

export interface StatFormationDemandee {
  formation_id: string | null
  formation_titre: string
  total: number
}

export interface Stats {
  total_leads: number
  total_convertis: number
  taux_conversion_global: number
  par_source: StatParSource[]
  formations_les_plus_demandees: StatFormationDemandee[]
}
