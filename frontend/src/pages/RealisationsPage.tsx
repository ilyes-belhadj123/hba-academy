import { useEffect, useState } from 'react'
import { fetchChiffresCles, fetchRealisations } from '../api/realisations'
import { RealisationsTimeline } from '../components/RealisationsTimeline/RealisationsTimeline'
import { StatsCounters } from '../components/StatsCounters/StatsCounters'
import { useSeo } from '../hooks/useSeo'
import type { Realisation } from '../types/realisation'
import './RealisationsPage.css'

export function RealisationsPage() {
  const [chiffresCles, setChiffresCles] = useState<Realisation[]>([])
  const [autresRealisations, setAutresRealisations] = useState<Realisation[]>([])

  useEffect(() => {
    fetchChiffresCles().then(setChiffresCles)
    fetchRealisations().then((all) => setAutresRealisations(all.filter((r) => r.type !== 'chiffre_cle')))
  }, [])

  useSeo({
    title: 'Nos réalisations — HBA Academy',
    description: "Chiffres clés, concours, partenariats et événements marquants d'HBA Academy.",
  })

  return (
    <main className="realisations-page">
      <h1>Nos réalisations</h1>

      <section>
        <StatsCounters chiffresCles={chiffresCles} />
      </section>

      <section>
        <h2>Concours, partenariats & événements</h2>
        <RealisationsTimeline realisations={autresRealisations} />
      </section>
    </main>
  )
}
