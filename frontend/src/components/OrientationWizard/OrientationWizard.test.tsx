import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OrientationWizard } from './OrientationWizard'

describe('OrientationWizard', () => {
  it('adapte la question 2 selon le profil "parent" (âge, pas filière)', async () => {
    render(<OrientationWizard onComplete={vi.fn()} />)

    await userEvent.click(screen.getByText("Je m'informe pour mon enfant/ado"))

    expect(screen.getByText(/Quel âge a l'enfant/)).toBeInTheDocument()
  })

  it('complète le parcours "jeune_adulte" et transmet les bonnes réponses', async () => {
    const onComplete = vi.fn()
    render(<OrientationWizard onComplete={onComplete} />)

    await userEvent.click(screen.getByText('Je suis jeune adulte / étudiant'))
    await userEvent.click(screen.getByText('Langues'))
    await userEvent.click(screen.getByText('En ligne'))
    await userEvent.click(screen.getByText('Débutant'))

    expect(onComplete).toHaveBeenCalledWith({
      objectif: 'jeune_adulte',
      filiere_cible: 'Langues',
      niveau: 'debutant',
      mode: 'en_ligne',
      age: null,
    })
  })
})
