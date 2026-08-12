import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  createRealisation,
  deleteRealisation,
  fetchAllRealisationsAdmin,
  updateRealisation,
} from '../../api/realisations'
import { AdminRealisationForm } from '../../components/AdminRealisationForm/AdminRealisationForm'
import { useAdminAuth } from '../../context/AdminAuthContext'
import type { Realisation, RealisationInput } from '../../types/realisation'
import './AdminRealisationsPage.css'

export function AdminRealisationsPage() {
  const { token, logout } = useAdminAuth()
  const [realisations, setRealisations] = useState<Realisation[]>([])
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list')
  const [editing, setEditing] = useState<Realisation | null>(null)

  const reload = useCallback(() => {
    if (token) fetchAllRealisationsAdmin(token).then(setRealisations)
  }, [token])

  useEffect(() => {
    reload()
  }, [reload])

  if (!token) return null

  const handleCreate = async (payload: RealisationInput) => {
    await createRealisation(payload, token)
    setMode('list')
    reload()
  }

  const handleUpdate = async (payload: RealisationInput) => {
    if (!editing) return
    await updateRealisation(editing._id, payload, token)
    setMode('list')
    setEditing(null)
    reload()
  }

  const handleDelete = async (realisation: Realisation) => {
    if (!window.confirm(`Supprimer la réalisation « ${realisation.titre} » ?`)) return
    await deleteRealisation(realisation._id, token)
    reload()
  }

  return (
    <main className="admin-realisations">
      <header className="admin-realisations__header">
        <h1>Backoffice — Réalisations</h1>
        <div>
          <Link to="/admin/formations">Formations</Link>
          <Link to="/admin/temoignages">Témoignages</Link>
          <Link to="/admin/formateurs">Formateurs</Link>
          <Link to="/admin/apprenants">Apprenants</Link>
          <button type="button" onClick={logout}>
            Se déconnecter
          </button>
        </div>
      </header>

      {mode === 'list' && (
        <>
          <button type="button" className="admin-realisations__add" onClick={() => setMode('create')}>
            + Ajouter une réalisation
          </button>

          <table className="admin-realisations__table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Type</th>
                <th>Mise en avant</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {realisations.map((realisation) => (
                <tr key={realisation._id}>
                  <td>{realisation.titre}</td>
                  <td>{realisation.type}</td>
                  <td>{realisation.mise_en_avant ? 'Oui' : 'Non'}</td>
                  <td className="admin-realisations__actions">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(realisation)
                        setMode('edit')
                      }}
                    >
                      Modifier
                    </button>
                    <button type="button" onClick={() => handleDelete(realisation)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {mode === 'create' && <AdminRealisationForm onSubmit={handleCreate} onCancel={() => setMode('list')} />}

      {mode === 'edit' && editing && (
        <AdminRealisationForm
          initialValue={editing}
          onSubmit={handleUpdate}
          onCancel={() => {
            setMode('list')
            setEditing(null)
          }}
        />
      )}
    </main>
  )
}
