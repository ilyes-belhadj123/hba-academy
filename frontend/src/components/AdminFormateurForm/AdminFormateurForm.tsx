import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { uploadMedia } from '../../api/temoignages'
import { fetchFormations } from '../../api/formations'
import { useAdminAuth } from '../../context/AdminAuthContext'
import type { Formateur, FormateurInput } from '../../types/formateur'
import type { Formation } from '../../types/formation'
import './AdminFormateurForm.css'

interface AdminFormateurFormProps {
  initialValue?: Formateur
  onSubmit: (payload: FormateurInput) => Promise<void>
  onCancel: () => void
}

function linesToList(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export function AdminFormateurForm({ initialValue, onSubmit, onCancel }: AdminFormateurFormProps) {
  const { token } = useAdminAuth()
  const [formations, setFormations] = useState<Formation[]>([])
  const [nom, setNom] = useState(initialValue?.nom ?? '')
  const [photo, setPhoto] = useState<string | null>(initialValue?.photo ?? null)
  const [filieres, setFilieres] = useState(initialValue?.filieres.join(', ') ?? '')
  const [bio, setBio] = useState(initialValue?.bio ?? '')
  const [experiences, setExperiences] = useState(initialValue?.experiences_professionnelles.join('\n') ?? '')
  const [certifications, setCertifications] = useState(initialValue?.certifications.join('\n') ?? '')
  const [formationsDispensees, setFormationsDispensees] = useState<string[]>(
    initialValue?.formations_dispensees ?? [],
  )
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFormations({}).then(setFormations)
  }, [])

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !token) return

    setIsUploading(true)
    try {
      setPhoto(await uploadMedia(file, token))
    } catch {
      setError("Échec de l'upload de la photo.")
    } finally {
      setIsUploading(false)
    }
  }

  const toggleFormation = (formationId: string) => {
    setFormationsDispensees((current) =>
      current.includes(formationId) ? current.filter((id) => id !== formationId) : [...current, formationId],
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await onSubmit({
        nom,
        photo,
        filieres: filieres
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean),
        bio,
        experiences_professionnelles: linesToList(experiences),
        certifications: linesToList(certifications),
        formations_dispensees: formationsDispensees,
        temoignages_specifiques: initialValue?.temoignages_specifiques ?? [],
      })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Une erreur est survenue.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="admin-formateur-form" onSubmit={handleSubmit}>
      <label>
        Nom
        <input required value={nom} onChange={(e) => setNom(e.target.value)} />
      </label>

      <label>
        Photo
        <input type="file" accept="image/*" onChange={handlePhotoChange} disabled={isUploading} />
      </label>
      {photo && <img src={photo} alt="Aperçu" className="admin-formateur-form__preview" />}

      <label>
        Filières (séparées par des virgules)
        <input value={filieres} onChange={(e) => setFilieres(e.target.value)} />
      </label>

      <label>
        Bio / parcours
        <textarea required value={bio} onChange={(e) => setBio(e.target.value)} />
      </label>

      <label>
        Expériences professionnelles (une par ligne)
        <textarea value={experiences} onChange={(e) => setExperiences(e.target.value)} />
      </label>

      <label>
        Certifications (une par ligne)
        <textarea value={certifications} onChange={(e) => setCertifications(e.target.value)} />
      </label>

      <fieldset className="admin-formateur-form__formations">
        <legend>Formations dispensées</legend>
        {formations.map((formation) => (
          <label key={formation._id} className="admin-formateur-form__checkbox">
            <input
              type="checkbox"
              checked={formationsDispensees.includes(formation._id)}
              onChange={() => toggleFormation(formation._id)}
            />
            {formation.titre}
          </label>
        ))}
      </fieldset>

      {error && <p className="admin-formateur-form__error">{error}</p>}

      <div className="admin-formateur-form__actions">
        <button type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        <button type="button" className="admin-formateur-form__cancel" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  )
}
