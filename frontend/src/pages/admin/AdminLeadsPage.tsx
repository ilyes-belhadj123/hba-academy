import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { downloadLeadsCsv, fetchLeads, updateLeadStatut } from '../../api/leads'
import { useAdminAuth } from '../../context/AdminAuthContext'
import type { Lead } from '../../types/lead'
import './AdminLeadsPage.css'

const STATUTS = ['nouveau', 'qualifie', 'converti', 'perdu'] as const

export function AdminLeadsPage() {
  const { token, logout } = useAdminAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [sourceFilter, setSourceFilter] = useState('')
  const [statutFilter, setStatutFilter] = useState('')

  const reload = useCallback(() => {
    if (token) fetchLeads({ source: sourceFilter, statut: statutFilter }, token).then(setLeads)
  }, [token, sourceFilter, statutFilter])

  useEffect(() => {
    reload()
  }, [reload])

  if (!token) return null

  const handleStatutChange = async (lead: Lead, statut: string) => {
    await updateLeadStatut(lead._id, statut, token)
    reload()
  }

  return (
    <main className="admin-leads">
      <header className="admin-leads__header">
        <h1>Backoffice — Leads</h1>
        <div>
          <Link to="/admin/stats">Statistiques</Link>
          <Link to="/admin/formations">Formations</Link>
          <Link to="/admin/apprenants">Apprenants</Link>
          <button type="button" onClick={logout}>
            Se déconnecter
          </button>
        </div>
      </header>

      <div className="admin-leads__filters">
        <label>
          Source
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
            <option value="">Toutes</option>
            <option value="vitrine">Vitrine</option>
            <option value="chatbot">Chatbot</option>
          </select>
        </label>
        <label>
          Statut
          <select value={statutFilter} onChange={(e) => setStatutFilter(e.target.value)}>
            <option value="">Tous</option>
            {STATUTS.map((statut) => (
              <option key={statut} value={statut}>
                {statut}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="admin-leads__export" onClick={() => downloadLeadsCsv(token)}>
          Exporter en CSV
        </button>
      </div>

      <table className="admin-leads__table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Contact</th>
            <th>Source</th>
            <th>Formation</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td>{lead.coordonnees.nom}</td>
              <td>
                {lead.coordonnees.email}
                <br />
                {lead.coordonnees.telephone}
              </td>
              <td>
                <span className="admin-leads__source-badge">{lead.source}</span>
              </td>
              <td>{lead.formation_titre ?? '—'}</td>
              <td>
                <select value={lead.statut} onChange={(e) => handleStatutChange(lead, e.target.value)}>
                  {STATUTS.map((statut) => (
                    <option key={statut} value={statut}>
                      {statut}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {leads.length === 0 && <p className="admin-leads__empty">Aucun lead ne correspond à ces critères.</p>}
    </main>
  )
}
