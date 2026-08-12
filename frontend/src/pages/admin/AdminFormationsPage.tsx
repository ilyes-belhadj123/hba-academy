import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { createFormation, deleteFormation, updateFormation } from '../../api/admin'
import { fetchFormations } from '../../api/formations'
import { AdminFormationForm } from '../../components/AdminFormationForm/AdminFormationForm'
import { useAdminAuth } from '../../context/AdminAuthContext'
import type { Formation, FormationInput } from '../../types/formation'
import './AdminFormationsPage.css'

export function AdminFormationsPage() {
  const { token, logout } = useAdminAuth()
  const [formations, setFormations] = useState<Formation[]>([])
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list')
  const [editing, setEditing] = useState<Formation | null>(null)

  const reload = () => {
    fetchFormations({}).then(setFormations)
  }

  useEffect(() => {
    reload()
  }, [])

  if (!token) return null

  const handleCreate = async (payload: FormationInput) => {
    await createFormation(payload, token)
    setMode('list')
    reload()
  }

  const handleUpdate = async (payload: FormationInput) => {
    if (!editing) return
    await updateFormation(editing._id, payload, token)
    setMode('list')
    setEditing(null)
    reload()
  }

  const handleDelete = async (formation: Formation) => {
    if (!window.confirm(`Supprimer la formation « ${formation.titre} » ?`)) return
    await deleteFormation(formation._id, token)
    reload()
  }

  return (
    <main className="admin-formations">
      <header className="admin-formations__header">
        <h1>Backoffice — Formations</h1>
        <div>
          <Link to="/admin/temoignages">Témoignages</Link>
          <Link to="/admin/formateurs">Formateurs</Link>
          <Link to="/admin/realisations">Réalisations</Link>
          <Link to="/admin/apprenants">Apprenants</Link>
          <button type="button" onClick={logout}>
            Se déconnecter
          </button>
        </div>
      </header>

      {mode === 'list' && (
        <>
          <button type="button" className="admin-formations__add" onClick={() => setMode('create')}>
            + Ajouter une formation
          </button>

          <table className="admin-formations__table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Filière</th>
                <th>Prix</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {formations.map((formation) => (
                <tr key={formation._id}>
                  <td>{formation.titre}</td>
                  <td>{formation.filiere}</td>
                  <td>{formation.prix} TND</td>
                  <td className="admin-formations__actions">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(formation)
                        setMode('edit')
                      }}
                    >
                      Modifier
                    </button>
                    <button type="button" onClick={() => handleDelete(formation)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {mode === 'create' && <AdminFormationForm onSubmit={handleCreate} onCancel={() => setMode('list')} />}

      {mode === 'edit' && editing && (
        <AdminFormationForm
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
