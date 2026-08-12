import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { createFormateur, deleteFormateur, fetchFormateurs, updateFormateur } from '../../api/formateurs'
import { AdminFormateurForm } from '../../components/AdminFormateurForm/AdminFormateurForm'
import { useAdminAuth } from '../../context/AdminAuthContext'
import type { Formateur, FormateurInput } from '../../types/formateur'
import './AdminFormateursPage.css'

export function AdminFormateursPage() {
  const { token, logout } = useAdminAuth()
  const [formateurs, setFormateurs] = useState<Formateur[]>([])
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list')
  const [editing, setEditing] = useState<Formateur | null>(null)

  const reload = useCallback(() => {
    fetchFormateurs().then(setFormateurs)
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  if (!token) return null

  const handleCreate = async (payload: FormateurInput) => {
    await createFormateur(payload, token)
    setMode('list')
    reload()
  }

  const handleUpdate = async (payload: FormateurInput) => {
    if (!editing) return
    await updateFormateur(editing._id, payload, token)
    setMode('list')
    setEditing(null)
    reload()
  }

  const handleDelete = async (formateur: Formateur) => {
    if (!window.confirm(`Supprimer le formateur « ${formateur.nom} » ?`)) return
    await deleteFormateur(formateur._id, token)
    reload()
  }

  return (
    <main className="admin-formateurs">
      <header className="admin-formateurs__header">
        <h1>Backoffice — Formateurs</h1>
        <div>
          <Link to="/admin/formations">Formations</Link>
          <Link to="/admin/temoignages">Témoignages</Link>
          <button type="button" onClick={logout}>
            Se déconnecter
          </button>
        </div>
      </header>

      {mode === 'list' && (
        <>
          <button type="button" className="admin-formateurs__add" onClick={() => setMode('create')}>
            + Ajouter un formateur
          </button>

          <table className="admin-formateurs__table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Filières</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {formateurs.map((formateur) => (
                <tr key={formateur._id}>
                  <td>{formateur.nom}</td>
                  <td>{formateur.filieres.join(', ')}</td>
                  <td className="admin-formateurs__actions">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(formateur)
                        setMode('edit')
                      }}
                    >
                      Modifier
                    </button>
                    <button type="button" onClick={() => handleDelete(formateur)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {mode === 'create' && <AdminFormateurForm onSubmit={handleCreate} onCancel={() => setMode('list')} />}

      {mode === 'edit' && editing && (
        <AdminFormateurForm
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
