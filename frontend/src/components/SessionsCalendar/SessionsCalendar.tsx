import type { FormationSession } from '../../types/session'
import './SessionsCalendar.css'

interface SessionsCalendarProps {
  sessions: FormationSession[]
  selectedSessionId: string | null
  onSelect: (sessionId: string) => void
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })

export function SessionsCalendar({ sessions, selectedSessionId, onSelect }: SessionsCalendarProps) {
  if (sessions.length === 0) {
    return <p className="sessions-calendar__empty">Aucune session programmée pour le moment.</p>
  }

  return (
    <div className="sessions-calendar">
      {sessions.map((session) => {
        const complete = session.places_restantes <= 0
        return (
          <button
            key={session._id}
            type="button"
            disabled={complete}
            className={
              session._id === selectedSessionId
                ? 'sessions-calendar__item sessions-calendar__item--active'
                : 'sessions-calendar__item'
            }
            onClick={() => onSelect(session._id)}
          >
            <span className="sessions-calendar__dates">
              Du {dateFormatter.format(new Date(session.date_debut))} au{' '}
              {dateFormatter.format(new Date(session.date_fin))}
            </span>
            <span
              className={
                complete ? 'sessions-calendar__places sessions-calendar__places--complet' : 'sessions-calendar__places'
              }
            >
              {complete ? 'Complet' : `${session.places_restantes} place(s) restante(s)`}
            </span>
          </button>
        )
      })}
    </div>
  )
}
