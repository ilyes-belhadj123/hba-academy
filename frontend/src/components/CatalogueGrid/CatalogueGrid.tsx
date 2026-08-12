import { Link } from 'react-router-dom'
import type { Formation } from '../../types/formation'
import './CatalogueGrid.css'

interface CatalogueGridProps {
  formations: Formation[]
}

const MODE_LABELS: Record<Formation['mode'], string> = {
  presentiel: 'Présentiel',
  en_ligne: 'En ligne',
}

const NIVEAU_LABELS: Record<Formation['niveau'], string> = {
  debutant: 'Débutant',
  intermediaire: 'Intermédiaire',
  avance: 'Avancé',
}

export function CatalogueGrid({ formations }: CatalogueGridProps) {
  if (formations.length === 0) {
    return <p className="catalogue-grid__empty">Aucune formation ne correspond à ces critères.</p>
  }

  return (
    <div className="catalogue-grid">
      {formations.map((formation) => (
        <Link key={formation._id} to={`/formations/${formation._id}`} className="catalogue-grid__card">
          <span className="catalogue-grid__filiere">{formation.filiere}</span>
          <h3>{formation.titre}</h3>
          <p>{formation.description}</p>
          <dl className="catalogue-grid__meta">
            <div>
              <dt>Durée</dt>
              <dd>{formation.duree}</dd>
            </div>
            <div>
              <dt>Niveau</dt>
              <dd>{NIVEAU_LABELS[formation.niveau]}</dd>
            </div>
            <div>
              <dt>Mode</dt>
              <dd>{MODE_LABELS[formation.mode]}</dd>
            </div>
            <div>
              <dt>Prix</dt>
              <dd>{formation.prix} TND</dd>
            </div>
          </dl>
        </Link>
      ))}
    </div>
  )
}
