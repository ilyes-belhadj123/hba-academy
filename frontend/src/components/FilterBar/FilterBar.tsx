import type { ChangeEvent } from 'react'
import type { FormationFilters } from '../../types/formation'
import './FilterBar.css'

interface FilterBarProps {
  filieres: string[]
  filters: FormationFilters
  onChange: (filters: FormationFilters) => void
}

export function FilterBar({ filieres, filters, onChange }: FilterBarProps) {
  const handleFieldChange = (field: keyof FormationFilters) => (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    onChange({ ...filters, [field]: event.target.value || undefined })
  }

  return (
    <div className="filter-bar">
      <label className="filter-bar__field">
        Filière
        <select value={filters.filiere ?? ''} onChange={handleFieldChange('filiere')}>
          <option value="">Toutes</option>
          {filieres.map((filiere) => (
            <option key={filiere} value={filiere}>
              {filiere}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-bar__field">
        Âge
        <input
          type="number"
          min={0}
          value={filters.age ?? ''}
          onChange={handleFieldChange('age')}
          placeholder="Ex : 14"
        />
      </label>

      <label className="filter-bar__field">
        Durée
        <input
          type="text"
          value={filters.duree ?? ''}
          onChange={handleFieldChange('duree')}
          placeholder="Ex : 8 semaines"
        />
      </label>

      <label className="filter-bar__field">
        Niveau
        <select value={filters.niveau ?? ''} onChange={handleFieldChange('niveau')}>
          <option value="">Tous</option>
          <option value="debutant">Débutant</option>
          <option value="intermediaire">Intermédiaire</option>
          <option value="avance">Avancé</option>
        </select>
      </label>

      <label className="filter-bar__field">
        Mode
        <select value={filters.mode ?? ''} onChange={handleFieldChange('mode')}>
          <option value="">Tous</option>
          <option value="presentiel">Présentiel</option>
          <option value="en_ligne">En ligne</option>
        </select>
      </label>

      <label className="filter-bar__field">
        Prix max (TND)
        <input
          type="number"
          min={0}
          value={filters.prix_max ?? ''}
          onChange={handleFieldChange('prix_max')}
          placeholder="Ex : 400"
        />
      </label>
    </div>
  )
}
