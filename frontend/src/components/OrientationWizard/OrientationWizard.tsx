import { useState } from 'react'
import type { ModeOrientation, NiveauOrientation, Objectif, OrientationReponses } from '../../types/orientation'
import './OrientationWizard.css'

interface OrientationWizardProps {
  onComplete: (reponses: OrientationReponses) => void
}

const OBJECTIF_OPTIONS: { value: Objectif; label: string }[] = [
  { value: 'parent', label: "Je m'informe pour mon enfant/ado" },
  { value: 'jeune_adulte', label: 'Je suis jeune adulte / étudiant' },
  { value: 'professionnel', label: 'Je suis en reconversion professionnelle' },
  { value: 'candidat_emigration', label: "Je prépare un projet d'émigration" },
]

const AGE_OPTIONS = [10, 11, 12, 13, 14, 15, 16, 17]

const FILIERE_OPTIONS_BY_OBJECTIF: Record<string, string[]> = {
  jeune_adulte: ['Bureautique & Informatique', 'Langues', 'Développement personnel & Coaching'],
  professionnel: ['Bureautique & Informatique', 'Développement personnel & Coaching', 'Langues'],
  candidat_emigration: ['Langues', 'Développement personnel & Coaching'],
}

const MODE_OPTIONS: { value: ModeOrientation; label: string }[] = [
  { value: 'presentiel', label: 'Présentiel' },
  { value: 'en_ligne', label: 'En ligne' },
  { value: 'peu_importe', label: 'Peu importe' },
]

const NIVEAU_OPTIONS: { value: NiveauOrientation; label: string }[] = [
  { value: 'debutant', label: 'Débutant' },
  { value: 'intermediaire', label: 'Intermédiaire' },
  { value: 'avance', label: 'Avancé' },
]

export function OrientationWizard({ onComplete }: OrientationWizardProps) {
  const [step, setStep] = useState(0)
  const [objectif, setObjectif] = useState<Objectif | null>(null)
  const [filiereCible, setFiliereCible] = useState<string | null>(null)
  const [age, setAge] = useState<number | null>(null)
  const [mode, setMode] = useState<ModeOrientation | null>(null)

  const totalSteps = 4

  const handleObjectif = (value: Objectif) => {
    setObjectif(value)
    if (value === 'parent') setFiliereCible('Robotique & Programmation IA (jeunes)')
    setStep(1)
  }

  const handleFiliere = (value: string) => {
    setFiliereCible(value)
    setStep(2)
  }

  const handleAge = (value: number) => {
    setAge(value)
    setStep(2)
  }

  const handleMode = (value: ModeOrientation) => {
    setMode(value)
    setStep(3)
  }

  const handleNiveau = (value: NiveauOrientation) => {
    if (!objectif || !filiereCible || !mode) return
    onComplete({ objectif, filiere_cible: filiereCible, niveau: value, mode, age })
  }

  return (
    <div className="orientation-wizard">
      <div className="orientation-wizard__progress">
        Question {step + 1} / {totalSteps}
      </div>

      {step === 0 && (
        <fieldset className="orientation-wizard__step">
          <legend>Quel est votre profil ?</legend>
          {OBJECTIF_OPTIONS.map((option) => (
            <button key={option.value} type="button" onClick={() => handleObjectif(option.value)}>
              {option.label}
            </button>
          ))}
        </fieldset>
      )}

      {step === 1 && objectif === 'parent' && (
        <fieldset className="orientation-wizard__step">
          <legend>Quel âge a l'enfant ou l'ado ?</legend>
          {AGE_OPTIONS.map((value) => (
            <button key={value} type="button" onClick={() => handleAge(value)}>
              {value} ans
            </button>
          ))}
        </fieldset>
      )}

      {step === 1 && objectif && objectif !== 'parent' && (
        <fieldset className="orientation-wizard__step">
          <legend>Quel domaine vous intéresse le plus ?</legend>
          {FILIERE_OPTIONS_BY_OBJECTIF[objectif].map((filiere) => (
            <button key={filiere} type="button" onClick={() => handleFiliere(filiere)}>
              {filiere}
            </button>
          ))}
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="orientation-wizard__step">
          <legend>Quelle est votre disponibilité ?</legend>
          {MODE_OPTIONS.map((option) => (
            <button key={option.value} type="button" onClick={() => handleMode(option.value)}>
              {option.label}
            </button>
          ))}
        </fieldset>
      )}

      {step === 3 && (
        <fieldset className="orientation-wizard__step">
          <legend>Quel est votre niveau actuel dans ce domaine ?</legend>
          {NIVEAU_OPTIONS.map((option) => (
            <button key={option.value} type="button" onClick={() => handleNiveau(option.value)}>
              {option.label}
            </button>
          ))}
        </fieldset>
      )}
    </div>
  )
}
