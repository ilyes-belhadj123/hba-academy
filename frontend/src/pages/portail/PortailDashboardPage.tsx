import { useEffect, useState } from 'react'
import { fetchDocuments, fetchMesCertificats, fetchPlanning } from '../../api/portail'
import { usePortailAuth } from '../../context/PortailAuthContext'
import type { Certificat } from '../../types/certificat'
import type { DocumentItem, PlanningItem } from '../../types/portail'
import './PortailDashboardPage.css'

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })

export function PortailDashboardPage() {
  const { token, logout } = usePortailAuth()
  const [planning, setPlanning] = useState<PlanningItem[]>([])
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [certificats, setCertificats] = useState<Certificat[]>([])

  useEffect(() => {
    if (!token) return
    fetchPlanning(token).then(setPlanning)
    fetchDocuments(token).then(setDocuments)
    fetchMesCertificats(token).then(setCertificats)
  }, [token])

  if (!token) return null

  return (
    <main className="portail-dashboard">
      <header className="portail-dashboard__header">
        <h1>Mon espace apprenant</h1>
        <button type="button" onClick={logout}>
          Se déconnecter
        </button>
      </header>

      <section>
        <h2>Mon planning</h2>
        {planning.length === 0 && <p>Aucune formation suivie pour le moment.</p>}
        <ul className="portail-dashboard__list">
          {planning.map((item) => (
            <li key={item.formation_id}>
              <strong>{item.formation_titre}</strong>
              {item.date_debut && item.date_fin && (
                <span>
                  {' '}
                  — du {dateFormatter.format(new Date(item.date_debut))} au{' '}
                  {dateFormatter.format(new Date(item.date_fin))}
                </span>
              )}
              <div className="portail-dashboard__progress">
                <div className="portail-dashboard__progress-bar" style={{ width: `${item.progression}%` }} />
              </div>
              <span className="portail-dashboard__progress-label">{item.progression}% complété</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Mes documents</h2>
        {documents.length === 0 && <p>Aucun document partagé pour le moment.</p>}
        <ul className="portail-dashboard__list">
          {documents.map((document) => (
            <li key={document._id}>
              <a href={document.download_url}>{document.titre}</a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Mes certificats</h2>
        {certificats.length === 0 && <p>Aucun certificat délivré pour le moment.</p>}
        <ul className="portail-dashboard__list">
          {certificats.map((certificat) => (
            <li key={certificat._id}>
              <a href={certificat.url_pdf} target="_blank" rel="noreferrer">
                Certificat du {dateFormatter.format(new Date(certificat.date_emission))}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
