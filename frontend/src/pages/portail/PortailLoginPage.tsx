import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { usePortailAuth } from '../../context/PortailAuthContext'
import './PortailLoginPage.css'

export function PortailLoginPage() {
  const { token, login } = usePortailAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (token) {
    return <Navigate to="/portail" replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await login(email, password)
      navigate('/portail')
    } catch {
      setError('Email ou mot de passe incorrect.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="portail-login">
      <h1>Espace apprenant</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Mot de passe
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="portail-login__error">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </main>
  )
}
