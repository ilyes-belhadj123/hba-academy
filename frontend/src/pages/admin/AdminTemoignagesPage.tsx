import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  createTemoignage,
  deleteTemoignage,
  fetchAllTemoignages,
  updateTemoignage,
  type TemoignageInput,
} from '../../api/temoignages'
import { AdminTemoignageForm } from '../../components/AdminTemoignageForm/AdminTemoignageForm'
import { useAdminAuth } from '../../context/AdminAuthContext'
import type { Temoignage } from '../../types/temoignage'
import './AdminTemoignagesPage.css'

export function AdminTemoignagesPage() {
  const { token, logout } = useAdminAuth()
  const [temoignages, setTemoignages] = useState<Temoignage[]>([])
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list')
  const [editing, setEditing] = useState<Temoignage | null>(null)

  const reload = useCallback(() => {
    if (token) fetchAllTemoignages(token).then(setTemoignages)
  }, [token])

  useEffect(() => {
    reload()
  }, [reload])

  if (!token) return null

  const handleCreate = async (payload: TemoignageInput) => {
    await createTemoignage(payload, token)
    setMode('list')
    reload()
  }

  const handleUpdate = async (payload: TemoignageInput) => {
    if (!editing) return
    await updateTemoignage(editing._id, payload, token)
    setMode('list')
    setEditing(null)
    reload()
  }

  const handleTogglePublication = async (temoignage: Temoignage) => {
    const nextStatut = temoignage.statut_publication === 'publie' ? 'brouillon' : 'publie'
    await updateTemoignage(temoignage._id, { statut_publication: nextStatut }, token)
    reload()
  }

  const handleDelete = async (temoignage: Temoignage) => {
    if (!window.confirm(`Supprimer le témoignage de « ${temoignage.auteur} » ?`)) return
    await deleteTemoignage(temoignage._id, token)
    reload()
  }

  return (
    <main className="admin-temoignages">
      <header className="admin-temoignages__header">
        <h1>Backoffice — Témoignages</h1>
        <div>
          <Link to="/admin/formations">Formations</Link>
          <Link to="/admin/formateurs">Formateurs</Link>
          <Link to="/admin/realisations">Réalisations</Link>
          <Link to="/admin/apprenants">Apprenants</Link>
          <Link to="/admin/leads">Leads</Link>
          <button type="button" onClick={logout}>
            Se déconnecter
          </button>
        </div>
      </header>

      {mode === 'list' && (
        <>
          <button type="button" className="admin-temoignages__add" onClick={() => setMode('create')}>
            + Ajouter un témoignage
          </button>

          <table className="admin-temoignages__table">
            <thead>
              <tr>
                <th>Auteur</th>
                <th>Contenu</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {temoignages.map((temoignage) => (
                <tr key={temoignage._id}>
                  <td>{temoignage.auteur}</td>
                  <td>{temoignage.contenu.slice(0, 60)}…</td>
                  <td>{temoignage.statut_publication === 'publie' ? 'Publié' : 'Brouillon'}</td>
                  <td className="admin-temoignages__actions">
                    <button type="button" onClick={() => handleTogglePublication(temoignage)}>
                      {temoignage.statut_publication === 'publie' ? 'Dépublier' : 'Publier'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(temoignage)
                        setMode('edit')
                      }}
                    >
                      Modifier
                    </button>
                    <button type="button" onClick={() => handleDelete(temoignage)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {mode === 'create' && <AdminTemoignageForm onSubmit={handleCreate} onCancel={() => setMode('list')} />}

      {mode === 'edit' && editing && (
        <AdminTemoignageForm
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
