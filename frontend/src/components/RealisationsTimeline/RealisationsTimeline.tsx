import type { Realisation } from '../../types/realisation'
import './RealisationsTimeline.css'

interface RealisationsTimelineProps {
  realisations: Realisation[]
}

const TYPE_LABELS: Record<Realisation['type'], string> = {
  chiffre_cle: 'Chiffre clé',
  concours: 'Concours',
  partenariat: 'Partenariat',
  evenement: 'Événement',
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })

export function RealisationsTimeline({ realisations }: RealisationsTimelineProps) {
  if (realisations.length === 0) {
    return <p className="realisations-timeline__empty">Aucune réalisation publiée pour le moment.</p>
  }

  return (
    <ol className="realisations-timeline">
      {realisations.map((realisation) => (
        <li key={realisation._id} className="realisations-timeline__item">
          <span className="realisations-timeline__type">{TYPE_LABELS[realisation.type]}</span>
          <time className="realisations-timeline__date">{dateFormatter.format(new Date(realisation.date))}</time>
          <h3>{realisation.titre}</h3>
          <p>{realisation.description}</p>
          {realisation.media.length > 0 && (
            <img src={realisation.media[0]} alt="" loading="lazy" className="realisations-timeline__media" />
          )}
        </li>
      ))}
    </ol>
  )
}
