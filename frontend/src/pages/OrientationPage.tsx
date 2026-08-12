import { useState } from 'react'
import { fetchRecommandation } from '../api/orientation'
import { OrientationWizard } from '../components/OrientationWizard/OrientationWizard'
import { RecommendationResult } from '../components/RecommendationResult/RecommendationResult'
import { useSeo } from '../hooks/useSeo'
import type { OrientationReponses, Recommandation } from '../types/orientation'
import './OrientationPage.css'

export function OrientationPage() {
  const [recommandation, setRecommandation] = useState<Recommandation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [wizardKey, setWizardKey] = useState(0)

  useSeo({
    title: "Simulateur d'orientation — HBA Academy",
    description: 'Répondez à quelques questions pour découvrir la formation qui vous correspond.',
  })

  const handleComplete = async (reponses: OrientationReponses) => {
    setIsLoading(true)
    setError('')
    try {
      const resultat = await fetchRecommandation(reponses)
      setRecommandation(resultat)
    } catch {
      setError("Impossible d'obtenir une recommandation pour le moment. Réessayez plus tard.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestart = () => {
    setRecommandation(null)
    setError('')
    setWizardKey((key) => key + 1)
  }

  return (
    <main className="orientation-page">
      <h1>Trouvez votre formation idéale</h1>
      <p className="orientation-page__intro">
        Répondez à 4 questions rapides pour recevoir une recommandation personnalisée.
      </p>

      {isLoading && <p className="orientation-page__loading">Analyse de vos réponses…</p>}
      {error && <p className="orientation-page__error">{error}</p>}

      {!isLoading && !recommandation && (
        <OrientationWizard key={wizardKey} onComplete={handleComplete} />
      )}

      {!isLoading && recommandation && (
        <RecommendationResult recommandation={recommandation} onRestart={handleRestart} />
      )}
    </main>
  )
}
