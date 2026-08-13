import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchFormateurById } from '../api/formateurs'
import { fetchFormationById } from '../api/formations'
import { useSeo } from '../hooks/useSeo'
import type { Formateur } from '../types/formateur'
import type { Formation } from '../types/formation'
import './FormateurDetailPage.css'

export function FormateurDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [formateur, setFormateur] = useState<Formateur | null>(null)
  const [formationsDispensees, setFormationsDispensees] = useState<Formation[]>([])
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return

    fetchFormateurById(id)
      .then(async (result) => {
        setFormateur(result)
        const formations = await Promise.all(
          result.formations_dispensees.map((formationId) =>
            fetchFormationById(formationId).catch(() => null),
          ),
        )
        setFormationsDispensees(formations.filter((f): f is Formation => f !== null))
      })
      .catch(() => setNotFound(true))
  }, [id])

  useSeo({
    title: formateur ? `${formateur.nom} — HBA Academy` : 'Formateur — HBA Academy',
    description: formateur?.bio ?? 'Découvrez nos formateurs chez HBA Academy.',
    image: formateur?.photo ?? undefined,
    type: 'profile',
  })

  if (notFound) {
    return <p className="formateur-detail__not-found">Ce formateur n'existe pas ou plus.</p>
  }

  if (!formateur) {
    return <p className="formateur-detail__loading">Chargement…</p>
  }

  return (
    <main className="formateur-detail">
      {formateur.photo ? (
        <img src={formateur.photo} alt={formateur.nom} className="formateur-detail__photo" />
      ) : (
        <div className="formateur-detail__photo-placeholder" aria-hidden="true" />
      )}

      <h1>{formateur.nom}</h1>

      <div className="formateur-detail__filieres">
        {formateur.filieres.map((filiere) => (
          <span key={filiere}>{filiere}</span>
        ))}
      </div>

      <p className="formateur-detail__bio">{formateur.bio}</p>

      {formateur.experiences_professionnelles.length > 0 && (
        <section>
          <h2>Expériences professionnelles</h2>
          <ul>
            {formateur.experiences_professionnelles.map((experience) => (
              <li key={experience}>{experience}</li>
            ))}
          </ul>
        </section>
      )}

      {formateur.certifications.length > 0 && (
        <section>
          <h2>Certifications</h2>
          <ul>
            {formateur.certifications.map((certification) => (
              <li key={certification}>{certification}</li>
            ))}
          </ul>
        </section>
      )}

      {formationsDispensees.length > 0 && (
        <section>
          <h2>Formations dispensées</h2>
          <ul className="formateur-detail__formations">
            {formationsDispensees.map((formation) => (
              <li key={formation._id}>
                <Link to={`/formations/${formation._id}`}>{formation.titre}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
