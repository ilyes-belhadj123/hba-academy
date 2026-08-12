import { useState, type ChangeEvent, type FormEvent } from 'react'
import { uploadMedia } from '../../api/temoignages'
import { useAdminAuth } from '../../context/AdminAuthContext'
import type { Realisation, RealisationInput, TypeRealisation } from '../../types/realisation'
import './AdminRealisationForm.css'

interface AdminRealisationFormProps {
  initialValue?: Realisation
  onSubmit: (payload: RealisationInput) => Promise<void>
  onCancel: () => void
}

export function AdminRealisationForm({ initialValue, onSubmit, onCancel }: AdminRealisationFormProps) {
  const { token } = useAdminAuth()
  const [type, setType] = useState<TypeRealisation>(initialValue?.type ?? 'chiffre_cle')
  const [titre, setTitre] = useState(initialValue?.titre ?? '')
  const [description, setDescription] = useState(initialValue?.description ?? '')
  const [date, setDate] = useState(initialValue?.date ?? new Date().toISOString().slice(0, 10))
  const [valeur, setValeur] = useState(initialValue?.valeur?.toString() ?? '')
  const [media, setMedia] = useState<string[]>(initialValue?.media ?? [])
  const [miseEnAvant, setMiseEnAvant] = useState(initialValue?.mise_en_avant ?? false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

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
      await onSubmit({
        type,
        titre,
        description,
        date,
        media,
        mise_en_avant: miseEnAvant,
        valeur: valeur ? Number(valeur) : null,
      })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Une erreur est survenue.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="admin-realisation-form" onSubmit={handleSubmit}>
      <label>
        Type
        <select value={type} onChange={(e) => setType(e.target.value as TypeRealisation)}>
          <option value="chiffre_cle">Chiffre clé</option>
          <option value="concours">Concours</option>
          <option value="partenariat">Partenariat</option>
          <option value="evenement">Événement</option>
        </select>
      </label>

      <label>
        Titre
        <input required value={titre} onChange={(e) => setTitre(e.target.value)} />
      </label>

      <label>
        Description (justification du chiffre ou détail de la réalisation)
        <textarea required value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>

      <label>
        Date
        <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
      </label>

      {type === 'chiffre_cle' && (
        <label>
          Valeur numérique
          <input type="number" value={valeur} onChange={(e) => setValeur(e.target.value)} />
        </label>
      )}

      <label>
        Média (photo)
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} disabled={isUploading} />
      </label>

      <label className="admin-realisation-form__checkbox">
        <input
          type="checkbox"
          checked={miseEnAvant}
          onChange={(e) => setMiseEnAvant(e.target.checked)}
        />
        Mettre en avant sur la page d'accueil
      </label>

      {error && <p className="admin-realisation-form__error">{error}</p>}

      <div className="admin-realisation-form__actions">
        <button type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        <button type="button" className="admin-realisation-form__cancel" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  )
}
