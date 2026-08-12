import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { uploadMedia, type TemoignageInput } from '../../api/temoignages'
import { fetchFormations } from '../../api/formations'
import { useAdminAuth } from '../../context/AdminAuthContext'
import type { Formation } from '../../types/formation'
import type { Temoignage } from '../../types/temoignage'
import './AdminTemoignageForm.css'

interface AdminTemoignageFormProps {
  initialValue?: Temoignage
  onSubmit: (payload: TemoignageInput) => Promise<void>
  onCancel: () => void
}

export function AdminTemoignageForm({ initialValue, onSubmit, onCancel }: AdminTemoignageFormProps) {
  const { token } = useAdminAuth()
  const [formations, setFormations] = useState<Formation[]>([])
  const [formationId, setFormationId] = useState(initialValue?.formation_id ?? '')
  const [auteur, setAuteur] = useState(initialValue?.auteur ?? '')
  const [contenu, setContenu] = useState(initialValue?.contenu ?? '')
  const [media, setMedia] = useState<string[]>(initialValue?.media ?? [])
  const [statut, setStatut] = useState<'brouillon' | 'publie'>(initialValue?.statut_publication ?? 'brouillon')
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFormations({}).then(setFormations)
  }, [])

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !token) return

    setIsUploading(true)
    try {
      const url = await uploadMedia(file, token)
      setMedia((current) => [...current, url])
    } catch {
      setError("Échec de l'upload du média.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await onSubmit({ formation_id: formationId, auteur, contenu, media, statut_publication: statut })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Une erreur est survenue.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="admin-temoignage-form" onSubmit={handleSubmit}>
      <label>
        Formation
        <select required value={formationId} onChange={(e) => setFormationId(e.target.value)}>
          <option value="">Sélectionner…</option>
          {formations.map((formation) => (
            <option key={formation._id} value={formation._id}>
              {formation.titre}
            </option>
          ))}
        </select>
      </label>

      <label>
        Auteur
        <input required value={auteur} onChange={(e) => setAuteur(e.target.value)} />
      </label>

      <label>
        Contenu
        <textarea required value={contenu} onChange={(e) => setContenu(e.target.value)} />
      </label>

      <label>
        Ajouter une photo ou vidéo
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} disabled={isUploading} />
      </label>

      {media.length > 0 && (
        <ul className="admin-temoignage-form__media-list">
          {media.map((url) => (
            <li key={url}>
              {url.split('/').pop()}
              <button type="button" onClick={() => setMedia((current) => current.filter((m) => m !== url))}>
                Retirer
              </button>
            </li>
          ))}
        </ul>
      )}

      <label className="admin-temoignage-form__checkbox">
        <input
          type="checkbox"
          checked={statut === 'publie'}
          onChange={(e) => setStatut(e.target.checked ? 'publie' : 'brouillon')}
        />
        Publier immédiatement
      </label>

      {error && <p className="admin-temoignage-form__error">{error}</p>}

      <div className="admin-temoignage-form__actions">
        <button type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        <button type="button" className="admin-temoignage-form__cancel" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  )
}
