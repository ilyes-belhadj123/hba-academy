import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchVerification } from '../api/certificats'
import { useSeo } from '../hooks/useSeo'
import type { CertificatVerification } from '../types/certificat'
import './CertificatVerificationPage.css'

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })

export function CertificatVerificationPage() {
  const { code } = useParams<{ code: string }>()
  const [result, setResult] = useState<CertificatVerification | null>(null)

  useEffect(() => {
    if (!code) return
    fetchVerification(code)
      .then(setResult)
      .catch(() => setResult({ valide: false, nom_affiche: null, formation_titre: null, date_emission: null }))
  }, [code])

  useSeo({
    title: 'Vérification de certificat — HBA Academy',
    description: "Vérifiez l'authenticité d'un certificat délivré par HBA Academy.",
  })

  if (!result) {
    return <p className="certificat-verification__loading">Vérification en cours…</p>
  }

  return (
    <main className="certificat-verification">
      {result.valide ? (
        <div className="certificat-verification__card certificat-verification__card--valide">
          <h1>✔ Certificat authentique</h1>
          <p>
            <strong>{result.nom_affiche}</strong> a suivi avec succès la formation :
          </p>
          <p className="certificat-verification__formation">{result.formation_titre}</p>
          {result.date_emission && (
            <p>Délivré le {dateFormatter.format(new Date(result.date_emission))}</p>
          )}
        </div>
      ) : (
        <div className="certificat-verification__card certificat-verification__card--invalide">
          <h1>✕ Certificat introuvable</h1>
          <p>Ce code de vérification ne correspond à aucun certificat émis par HBA Academy.</p>
        </div>
      )}
    </main>
  )
}
