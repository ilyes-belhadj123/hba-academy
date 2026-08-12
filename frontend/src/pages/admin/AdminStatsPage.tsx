import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchStats } from '../../api/stats'
import { AdminDashboardCharts } from '../../components/AdminDashboardCharts/AdminDashboardCharts'
import { useAdminAuth } from '../../context/AdminAuthContext'
import type { Stats } from '../../types/stats'
import './AdminStatsPage.css'

export function AdminStatsPage() {
  const { token, logout } = useAdminAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')

  const reload = useCallback(() => {
    if (token) fetchStats({ date_debut: dateDebut || undefined, date_fin: dateFin || undefined }, token).then(setStats)
  }, [token, dateDebut, dateFin])

  useEffect(() => {
    reload()
  }, [reload])

  if (!token) return null

  return (
    <main className="admin-stats">
      <header className="admin-stats__header">
        <h1>Backoffice — Statistiques</h1>
        <div>
          <Link to="/admin/leads">Leads</Link>
          <Link to="/admin/formations">Formations</Link>
          <button type="button" onClick={logout}>
            Se déconnecter
          </button>
        </div>
      </header>

      <div className="admin-stats__filters">
        <label>
          Du
          <input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
        </label>
        <label>
          Au
          <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
        </label>
      </div>

      {stats && (
        <>
          <div className="admin-stats__kpis">
            <div className="admin-stats__kpi">
              <strong>{stats.total_leads}</strong>
              <span>Leads totaux</span>
            </div>
            <div className="admin-stats__kpi">
              <strong>{stats.total_convertis}</strong>
              <span>Convertis</span>
            </div>
            <div className="admin-stats__kpi">
              <strong>{stats.taux_conversion_global.toFixed(1)}%</strong>
              <span>Taux de conversion global</span>
            </div>
          </div>

          <AdminDashboardCharts
            parSource={stats.par_source}
            formationsLesPlusDemandees={stats.formations_les_plus_demandees}
          />
        </>
      )}
    </main>
  )
}
