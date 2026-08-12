import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createPreinscription } from '../../api/preinscriptions'
import { PreinscriptionForm } from './PreinscriptionForm'

vi.mock('../../api/preinscriptions', () => ({
  createPreinscription: vi.fn(),
}))

describe('PreinscriptionForm', () => {
  it("désactive le bouton d'envoi sans session sélectionnée", () => {
    render(<PreinscriptionForm sessionId={null} />)
    expect(screen.getByRole('button', { name: /confirmer/i })).toBeDisabled()
  })

  it('révèle la case de consentement parental uniquement si "mineur" est cochée', async () => {
    render(<PreinscriptionForm sessionId="session-1" />)

    expect(screen.queryByText(/en tant que parent ou tuteur légal/)).not.toBeInTheDocument()

    await userEvent.click(screen.getByLabelText('Le participant est mineur'))

    expect(screen.getByText(/en tant que parent ou tuteur légal/)).toBeInTheDocument()
  })

  it('envoie les bonnes données à la création de préinscription', async () => {
    vi.mocked(createPreinscription).mockResolvedValue({
      _id: '1',
      lead_id: '1',
      session_id: 'session-1',
      statut: 'en_attente',
      date_creation: '2026-01-01T00:00:00Z',
    })

    render(<PreinscriptionForm sessionId="session-1" />)

    await userEvent.type(screen.getByLabelText('Nom complet'), 'Jane Doe')
    await userEvent.type(screen.getByLabelText('Email'), 'jane.doe@example.com')
    await userEvent.type(screen.getByLabelText('Téléphone'), '+21600000000')
    await userEvent.click(screen.getByRole('button', { name: /confirmer/i }))

    expect(createPreinscription).toHaveBeenCalledWith({
      session_id: 'session-1',
      nom: 'Jane Doe',
      email: 'jane.doe@example.com',
      telephone: '+21600000000',
      mineur: false,
      consentement_parental: false,
    })

    expect(await screen.findByText(/bien été enregistrée/)).toBeInTheDocument()
  })
})
