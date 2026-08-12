import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { envoyerResultatParEmail } from '../../api/orientation'
import type { Recommandation } from '../../types/orientation'
import './RecommendationResult.css'

interface RecommendationResultProps {
  recommandation: Recommandation
  onRestart: () => void
}

export function RecommendationResult({ recommandation, onRestart }: RecommendationResultProps) {
  const { formation_principale, alternatives, justification } = recommandation
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSendEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('sending')
    try {
      await envoyerResultatParEmail({
        email,
        formation_principale_id: formation_principale._id,
        alternatives_ids: alternatives.map((f) => f._id),
        justification,
      })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="recommendation-result">
      <h2>Formation recommandée</h2>
      <div className="recommendation-result__principale">
        <span className="recommendation-result__filiere">{formation_principale.filiere}</span>
        <h3>{formation_principale.titre}</h3>
        <p>{formation_principale.description}</p>
        <p className="recommendation-result__justification">{justification}</p>
        <Link to={`/formations/${formation_principale._id}`} className="recommendation-result__cta">
          Voir la fiche et prendre rendez-vous
        </Link>
      </div>

      {alternatives.length > 0 && (
        <div className="recommendation-result__alternatives">
          <h4>Autres formations qui pourraient vous intéresser</h4>
          <ul>
            {alternatives.map((formation) => (
              <li key={formation._id}>
                <Link to={`/formations/${formation._id}`}>{formation.titre}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {status === 'sent' ? (
        <p className="recommendation-result__sent">Résultat envoyé par email !</p>
      ) : (
        <form className="recommendation-result__email-form" onSubmit={handleSendEmail}>
          <label>
            Recevoir ce résultat par email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <button type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Envoi…' : 'Envoyer'}
          </button>
          {status === 'error' && <p className="recommendation-result__error">Échec de l'envoi, réessayez.</p>}
        </form>
      )}

      <button type="button" className="recommendation-result__restart" onClick={onRestart}>
        Refaire le questionnaire
      </button>
    </div>
  )
}
