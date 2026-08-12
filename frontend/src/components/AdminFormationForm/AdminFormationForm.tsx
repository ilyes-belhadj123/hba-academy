import { useState, type FormEvent } from 'react'
import type { Formation, FormationInput } from '../../types/formation'
import './AdminFormationForm.css'

interface AdminFormationFormProps {
  initialValue?: Formation
  onSubmit: (payload: FormationInput) => Promise<void>
  onCancel?: () => void
}

const EMPTY_FORM: FormationInput = {
  filiere: '',
  titre: '',
  description: '',
  prerequis: '',
  duree: '',
  age_min: 0,
  age_max: 99,
  prix: 0,
  niveau: 'debutant',
  mode: 'presentiel',
  medias: [],
  badges_competences: [],
}

export function AdminFormationForm({ initialValue, onSubmit, onCancel }: AdminFormationFormProps) {
  const [form, setForm] = useState<FormationInput>(initialValue ?? EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: keyof FormationInput, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await onSubmit(form)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Une erreur est survenue.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="admin-formation-form" onSubmit={handleSubmit}>
      <label>
        Filière
        <input required value={form.filiere} onChange={(e) => handleChange('filiere', e.target.value)} />
      </label>
      <label>
        Titre
        <input required value={form.titre} onChange={(e) => handleChange('titre', e.target.value)} />
      </label>
      <label>
        Description
        <textarea
          required
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </label>
      <label>
        Prérequis
        <input required value={form.prerequis} onChange={(e) => handleChange('prerequis', e.target.value)} />
      </label>
      <label>
        Durée
        <input required value={form.duree} onChange={(e) => handleChange('duree', e.target.value)} />
      </label>
      <div className="admin-formation-form__row">
        <label>
          Âge min
          <input
            type="number"
            required
            value={form.age_min}
            onChange={(e) => handleChange('age_min', Number(e.target.value))}
          />
        </label>
        <label>
          Âge max
          <input
            type="number"
            required
            value={form.age_max}
            onChange={(e) => handleChange('age_max', Number(e.target.value))}
          />
        </label>
        <label>
          Prix (TND)
          <input
            type="number"
            required
            value={form.prix}
            onChange={(e) => handleChange('prix', Number(e.target.value))}
          />
        </label>
      </div>
      <div className="admin-formation-form__row">
        <label>
          Niveau
          <select value={form.niveau} onChange={(e) => handleChange('niveau', e.target.value)}>
            <option value="debutant">Débutant</option>
            <option value="intermediaire">Intermédiaire</option>
            <option value="avance">Avancé</option>
          </select>
        </label>
        <label>
          Mode
          <select value={form.mode} onChange={(e) => handleChange('mode', e.target.value)}>
            <option value="presentiel">Présentiel</option>
            <option value="en_ligne">En ligne</option>
          </select>
        </label>
      </div>

      {error && <p className="admin-formation-form__error">{error}</p>}

      <div className="admin-formation-form__actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        {onCancel && (
          <button type="button" className="admin-formation-form__cancel" onClick={onCancel}>
            Annuler
          </button>
        )}
      </div>
    </form>
  )
}
