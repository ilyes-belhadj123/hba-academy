import { useState, type FormEvent } from 'react'
import { createPreinscription } from '../../api/preinscriptions'
import './PreinscriptionForm.css'

interface PreinscriptionFormProps {
  sessionId: string | null
}

export function PreinscriptionForm({ sessionId }: PreinscriptionFormProps) {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [mineur, setMineur] = useState(false)
  const [consentementParental, setConsentementParental] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!sessionId) return

    setStatus('submitting')
    setErrorMessage('')

    try {
      await createPreinscription({
        session_id: sessionId,
        nom,
        email,
        telephone,
        mineur,
        consentement_parental: consentementParental,
      })
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur est survenue.')
    }
  }

  if (status === 'success') {
    return (
      <p className="preinscription-form__success">
        Votre préinscription a bien été enregistrée. Un email de confirmation vous a été envoyé.
      </p>
    )
  }

  return (
    <form className="preinscription-form" onSubmit={handleSubmit}>
      {!sessionId && <p className="preinscription-form__hint">Sélectionnez une session pour vous préinscrire.</p>}

      <label>
        Nom complet
        <input type="text" required value={nom} onChange={(e) => setNom(e.target.value)} />
      </label>

      <label>
        Email
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>

      <label>
        Téléphone
        <input type="tel" required value={telephone} onChange={(e) => setTelephone(e.target.value)} />
      </label>

      <label className="preinscription-form__checkbox">
        <input type="checkbox" checked={mineur} onChange={(e) => setMineur(e.target.checked)} />
        Le participant est mineur
      </label>

      {mineur && (
        <label className="preinscription-form__checkbox">
          <input
            type="checkbox"
            required
            checked={consentementParental}
            onChange={(e) => setConsentementParental(e.target.checked)}
          />
          J’autorise, en tant que parent ou tuteur légal, la participation à cette formation
        </label>
      )}

      {status === 'error' && <p className="preinscription-form__error">{errorMessage}</p>}

      <button type="submit" disabled={!sessionId || status === 'submitting'}>
        {status === 'submitting' ? 'Envoi en cours…' : 'Confirmer la préinscription'}
      </button>
    </form>
  )
}
