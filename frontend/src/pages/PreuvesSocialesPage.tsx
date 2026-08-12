import { useEffect, useState } from 'react'
import { fetchTemoignagesPublies } from '../api/temoignages'
import { MediaGallery } from '../components/MediaGallery/MediaGallery'
import { useSeo } from '../hooks/useSeo'
import type { Temoignage } from '../types/temoignage'
import './PreuvesSocialesPage.css'

export function PreuvesSocialesPage() {
  const [temoignages, setTemoignages] = useState<Temoignage[]>([])

  useEffect(() => {
    fetchTemoignagesPublies()
      .then(setTemoignages)
      .catch(() => setTemoignages([]))
  }, [])

  useSeo({
    title: 'Preuves sociales — HBA Academy',
    description: "Projets d'élèves et témoignages d'apprenants de HBA Academy.",
  })

  const mediaUrls = temoignages.flatMap((temoignage) => temoignage.media)

  return (
    <main className="preuves-sociales">
      <h1>Nos apprenants témoignent</h1>

      <section>
        <h2>Projets réalisés par nos apprenants</h2>
        <MediaGallery mediaUrls={mediaUrls} />
      </section>

      <section className="preuves-sociales__temoignages">
        <h2>Témoignages</h2>
        {temoignages.length === 0 && <p>Aucun témoignage publié pour le moment.</p>}
        {temoignages.map((temoignage) => (
          <blockquote key={temoignage._id}>
            <p>« {temoignage.contenu} »</p>
            <cite>{temoignage.auteur}</cite>
          </blockquote>
        ))}
      </section>
    </main>
  )
}
