import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchFormateurs } from '../api/formateurs'
import { fetchFormationById, fetchFormationTemoignages } from '../api/formations'
import { fetchSessionsByFormation } from '../api/sessions'
import { PreinscriptionForm } from '../components/PreinscriptionForm/PreinscriptionForm'
import { SessionsCalendar } from '../components/SessionsCalendar/SessionsCalendar'
import { useSeo } from '../hooks/useSeo'
import type { Formateur } from '../types/formateur'
import type { Formation } from '../types/formation'
import type { FormationSession } from '../types/session'
import type { Temoignage } from '../types/temoignage'
import { isVideoUrl } from '../utils/media'
import './FormationDetailPage.css'

export function FormationDetailPage() {
  const { id } = useParams<{ id: string }>()

  const [formation, setFormation] = useState<Formation | null>(null)
  const [temoignages, setTemoignages] = useState<Temoignage[]>([])
  const [sessions, setSessions] = useState<FormationSession[]>([])
  const [formateurs, setFormateurs] = useState<Formateur[]>([])
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return

    fetchFormationById(id)
      .then(setFormation)
      .catch(() => setNotFound(true))

    fetchFormationTemoignages(id)
      .then(setTemoignages)
      .catch(() => setTemoignages([]))

    fetchSessionsByFormation(id)
      .then(setSessions)
      .catch(() => setSessions([]))

    fetchFormateurs({ formation_id: id })
      .then(setFormateurs)
      .catch(() => setFormateurs([]))
  }, [id])

  useSeo({
    title: formation ? `${formation.titre} — HBA Academy` : 'Formation — HBA Academy',
    description: formation?.description ?? 'Découvrez nos formations chez HBA Academy.',
    image: formation?.medias.find((media) => !isVideoUrl(media)),
    type: 'article',
  })

  if (notFound) {
    return <p className="formation-detail__not-found">Cette formation n'existe pas ou plus.</p>
  }

  if (!formation) {
    return <p className="formation-detail__loading">Chargement…</p>
  }

  const videoUrl = formation.medias.find(isVideoUrl)

  return (
    <main className="formation-detail">
      <span className="formation-detail__filiere">{formation.filiere}</span>
      <h1>{formation.titre}</h1>
      <p className="formation-detail__description">{formation.description}</p>

      <dl className="formation-detail__meta">
        <div>
          <dt>Prérequis</dt>
          <dd>{formation.prerequis}</dd>
        </div>
        <div>
          <dt>Durée</dt>
          <dd>{formation.duree}</dd>
        </div>
        <div>
          <dt>Prix</dt>
          <dd>{formation.prix} TND</dd>
        </div>
      </dl>

      {formation.badges_competences.length > 0 && (
        <div className="formation-detail__badges">
          {formation.badges_competences.map((badge) => (
            <span key={badge} className="formation-detail__badge">
              {badge}
            </span>
          ))}
        </div>
      )}

      {videoUrl && (
        <section className="formation-detail__video">
          <video controls src={videoUrl} width="100%">
            <track kind="captions" />
          </video>
        </section>
      )}

      {formateurs.length > 0 && (
        <section className="formation-detail__formateurs">
          <h2>Formateur(s)</h2>
          <ul>
            {formateurs.map((formateur) => (
              <li key={formateur._id}>
                <Link to={`/formateurs/${formateur._id}`}>{formateur.nom}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {temoignages.length > 0 && (
        <section className="formation-detail__temoignages">
          <h2>Avis d'apprenants</h2>
          {temoignages.map((temoignage) => (
            <blockquote key={temoignage._id}>
              <p>« {temoignage.contenu} »</p>
              <cite>{temoignage.auteur}</cite>
            </blockquote>
          ))}
        </section>
      )}

      <section className="formation-detail__rdv" id="rdv">
        <h2>Sessions à venir</h2>
        <SessionsCalendar
          sessions={sessions}
          selectedSessionId={selectedSessionId}
          onSelect={setSelectedSessionId}
        />

        <h2>Préinscription</h2>
        <PreinscriptionForm sessionId={selectedSessionId} />
      </section>
    </main>
  )
}
