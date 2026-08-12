import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button/Button'
import './CookieConsentBanner.css'

const STORAGE_KEY = 'hba_cookie_consent'

function readConsent(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

export function CookieConsentBanner() {
  const [consent, setConsent] = useState<string | null>(readConsent)

  if (consent) return null

  const choose = (value: 'accepted' | 'refused') => {
    localStorage.setItem(STORAGE_KEY, value)
    setConsent(value)
  }

  return (
    <div className="cookie-consent-banner" role="dialog" aria-label="Consentement aux cookies">
      <p>
        Nous utilisons des cookies techniques nécessaires au fonctionnement du site. Avec votre
        accord, nous pourrions aussi utiliser des cookies de mesure d'audience. Voir notre{' '}
        <Link to="/politique-confidentialite">politique de confidentialité</Link>.
      </p>
      <div className="cookie-consent-banner__actions">
        <Button variant="secondary" onClick={() => choose('refused')}>
          Refuser
        </Button>
        <Button onClick={() => choose('accepted')}>Accepter</Button>
      </div>
    </div>
  )
}
