import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ProfileSelector } from './ProfileSelector'

describe('ProfileSelector', () => {
  it('affiche les 4 profils', () => {
    render(<ProfileSelector selectedProfileId={null} onSelect={vi.fn()} />)
    expect(screen.getAllByRole('button')).toHaveLength(4)
  })

  it('appelle onSelect avec le bon id au clic', async () => {
    const onSelect = vi.fn()
    render(<ProfileSelector selectedProfileId={null} onSelect={onSelect} />)

    await userEvent.click(screen.getByText('Jeune adulte / étudiant'))

    expect(onSelect).toHaveBeenCalledWith('jeune_adulte')
  })

  it('marque le profil sélectionné comme actif', () => {
    render(<ProfileSelector selectedProfileId="parent" onSelect={vi.fn()} />)
    const parentButton = screen.getByText('Parent d’un enfant ou ado')
    expect(parentButton).toHaveAttribute('aria-pressed', 'true')
  })
})
