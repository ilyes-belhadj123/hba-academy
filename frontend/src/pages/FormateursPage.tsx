import { useEffect, useState } from 'react'
import { fetchFormateurs } from '../api/formateurs'
import { FormateursGrid } from '../components/FormateursGrid/FormateursGrid'
import { useSeo } from '../hooks/useSeo'
import type { Formateur } from '../types/formateur'
import './FormateursPage.css'

export function FormateursPage() {
  const [formateurs, setFormateurs] = useState<Formateur[]>([])

  useEffect(() => {
    fetchFormateurs().then(setFormateurs)
  }, [])

  useSeo({
    title: 'Nos formateurs — HBA Academy',
    description: "L'équipe de formateurs de HBA Academy et leurs spécialités.",
  })

  return (
    <main className="formateurs-page">
      <h1>Nos formateurs</h1>
      <FormateursGrid formateurs={formateurs} />
    </main>
  )
}
