import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchFilieres, fetchFormations } from '../api/formations'
import { CatalogueGrid } from '../components/CatalogueGrid/CatalogueGrid'
import { FilterBar } from '../components/FilterBar/FilterBar'
import type { Formation, FormationFilters } from '../types/formation'
import './CataloguePage.css'

const FILTER_KEYS = ['filiere', 'age', 'duree', 'prix_max', 'niveau', 'mode'] as const

function filtersFromSearchParams(searchParams: URLSearchParams): FormationFilters {
  const filters: FormationFilters = {}
  for (const key of FILTER_KEYS) {
    const value = searchParams.get(key)
    if (value) filters[key] = value
  }
  return filters
}

export function CataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = filtersFromSearchParams(searchParams)

  const [filieres, setFilieres] = useState<string[]>([])
  const [formations, setFormations] = useState<Formation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFilieres()
      .then(setFilieres)
      .catch(() => setFilieres([]))
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadFormations() {
      setIsLoading(true)
      setError(null)

      try {
        const data = await fetchFormations(filtersFromSearchParams(searchParams))
        if (!cancelled) setFormations(data)
      } catch {
        if (!cancelled) setError('Impossible de charger le catalogue pour le moment.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadFormations()

    return () => {
      cancelled = true
    }
  }, [searchParams])

  const handleFiltersChange = (nextFilters: FormationFilters) => {
    const nextParams = new URLSearchParams()
    for (const key of FILTER_KEYS) {
      const value = nextFilters[key]
      if (value) nextParams.set(key, value)
    }
    setSearchParams(nextParams)
  }

  return (
    <main className="catalogue-page">
      <h1>Catalogue des formations</h1>

      <FilterBar filieres={filieres} filters={filters} onChange={handleFiltersChange} />

      {error && <p className="catalogue-page__error">{error}</p>}
      {isLoading ? <p>Chargement du catalogue…</p> : <CatalogueGrid formations={formations} />}
    </main>
  )
}
