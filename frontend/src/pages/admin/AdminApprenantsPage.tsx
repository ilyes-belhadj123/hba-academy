import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { createApprenant, enrollApprenant, fetchApprenants, uploadDocument } from '../../api/apprenants'
import { genererCertificat } from '../../api/certificats'
import { fetchFormations } from '../../api/formations'
import { fetchSessionsByFormation } from '../../api/sessions'
import { useAdminAuth } from '../../context/AdminAuthContext'
import type { Apprenant } from '../../types/apprenant'
import type { Formation } from '../../types/formation'
import type { FormationSession } from '../../types/session'
import './AdminApprenantsPage.css'

export function AdminApprenantsPage() {
  const { token, logout } = useAdminAuth()
  const [apprenants, setApprenants] = useState<Apprenant[]>([])
  const [formations, setFormations] = useState<Formation[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [newEmail, setNewEmail] = useState('')
  const [newNom, setNewNom] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const [enrollFormationId, setEnrollFormationId] = useState('')
  const [enrollSessions, setEnrollSessions] = useState<FormationSession[]>([])
  const [enrollSessionId, setEnrollSessionId] = useState('')

  const [docTitre, setDocTitre] = useState('')
  const [docFile, setDocFile] = useState<File | null>(null)

  const [certFormationId, setCertFormationId] = useState('')
  const [feedback, setFeedback] = useState('')

  const reload = useCallback(() => {
    if (token) fetchApprenants(token).then(setApprenants)
  }, [token])

  useEffect(() => {
    reload()
    fetchFormations({}).then(setFormations)
  }, [reload])

  useEffect(() => {
    async function loadSessions() {
      if (enrollFormationId) {
        setEnrollSessions(await fetchSessionsByFormation(enrollFormationId))
      } else {
        setEnrollSessions([])
      }
    }
    loadSessions()
  }, [enrollFormationId])

  if (!token) return null

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await createApprenant({ email: newEmail, nom: newNom, password: newPassword }, token)
    setNewEmail('')
    setNewNom('')
    setNewPassword('')
    reload()
  }

  const handleEnroll = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedId || !enrollFormationId) return
    await enrollApprenant(selectedId, { formation_id: enrollFormationId, session_id: enrollSessionId || null }, token)
    setFeedback('Inscription enregistrée.')
    reload()
  }

  const handleUploadDocument = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedId || !docFile) return
    await uploadDocument(selectedId, docFile, docTitre, token)
    setFeedback('Document envoyé.')
    setDocTitre('')
    setDocFile(null)
  }

  const handleGenererCertificat = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedId || !certFormationId) return
    await genererCertificat(selectedId, certFormationId, token)
    setFeedback('Certificat généré.')
  }

  const selectedApprenant = apprenants.find((a) => a._id === selectedId) ?? null

  return (
    <main className="admin-apprenants">
      <header className="admin-apprenants__header">
        <h1>Backoffice — Apprenants</h1>
        <div>
          <Link to="/admin/formations">Formations</Link>
          <Link to="/admin/temoignages">Témoignages</Link>
          <Link to="/admin/formateurs">Formateurs</Link>
          <Link to="/admin/realisations">Réalisations</Link>
          <Link to="/admin/leads">Leads</Link>
          <button type="button" onClick={logout}>
            Se déconnecter
          </button>
        </div>
      </header>

      <div className="admin-apprenants__layout">
        <div>
          <table className="admin-apprenants__table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Formations</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {apprenants.map((apprenant) => (
                <tr key={apprenant._id} className={apprenant._id === selectedId ? 'admin-apprenants__row--active' : ''}>
                  <td>{apprenant.nom}</td>
                  <td>{apprenant.email}</td>
                  <td>{apprenant.formations_suivies.length}</td>
                  <td>
                    <button type="button" onClick={() => setSelectedId(apprenant._id)}>
                      Gérer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <form className="admin-apprenants__form" onSubmit={handleCreate}>
            <h3>Ajouter un apprenant</h3>
            <input placeholder="Nom" required value={newNom} onChange={(e) => setNewNom(e.target.value)} />
            <input
              type="email"
              placeholder="Email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mot de passe (min. 8 caractères)"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="submit">Créer</button>
          </form>
        </div>

        {selectedApprenant && (
          <div className="admin-apprenants__panel">
            <h2>{selectedApprenant.nom}</h2>
            {feedback && <p className="admin-apprenants__feedback">{feedback}</p>}

            <form className="admin-apprenants__form" onSubmit={handleEnroll}>
              <h3>Inscrire à une formation</h3>
              <select required value={enrollFormationId} onChange={(e) => setEnrollFormationId(e.target.value)}>
                <option value="">Sélectionner une formation…</option>
                {formations.map((formation) => (
                  <option key={formation._id} value={formation._id}>
                    {formation.titre}
                  </option>
                ))}
              </select>
              <select value={enrollSessionId} onChange={(e) => setEnrollSessionId(e.target.value)}>
                <option value="">Aucune session spécifique</option>
                {enrollSessions.map((session) => (
                  <option key={session._id} value={session._id}>
                    {new Date(session.date_debut).toLocaleDateString('fr-FR')}
                  </option>
                ))}
              </select>
              <button type="submit">Inscrire</button>
            </form>

            <form className="admin-apprenants__form" onSubmit={handleUploadDocument}>
              <h3>Partager un document</h3>
              <input placeholder="Titre du document" required value={docTitre} onChange={(e) => setDocTitre(e.target.value)} />
              <input
                type="file"
                required
                onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
              />
              <button type="submit">Envoyer</button>
            </form>

            <form className="admin-apprenants__form" onSubmit={handleGenererCertificat}>
              <h3>Générer un certificat</h3>
              <select required value={certFormationId} onChange={(e) => setCertFormationId(e.target.value)}>
                <option value="">Sélectionner une formation…</option>
                {formations.map((formation) => (
                  <option key={formation._id} value={formation._id}>
                    {formation.titre}
                  </option>
                ))}
              </select>
              <button type="submit">Générer</button>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}
