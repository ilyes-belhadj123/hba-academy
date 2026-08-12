import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import './AdminLoginPage.css'

export function AdminLoginPage() {
  const { token, login } = useAdminAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (token) {
    return <Navigate to="/admin/formations" replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await login(email, password)
      navigate('/admin/formations')
    } catch {
      setError('Email ou mot de passe incorrect.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="admin-login">
      <h1>Connexion backoffice</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Mot de passe
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="admin-login__error">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </main>
  )
}
