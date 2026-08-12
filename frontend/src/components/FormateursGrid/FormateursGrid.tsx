import { Link } from 'react-router-dom'
import type { Formateur } from '../../types/formateur'
import './FormateursGrid.css'

interface FormateursGridProps {
  formateurs: Formateur[]
}

export function FormateursGrid({ formateurs }: FormateursGridProps) {
  if (formateurs.length === 0) {
    return <p className="formateurs-grid__empty">Aucun formateur ne correspond à ces critères.</p>
  }

  return (
    <div className="formateurs-grid">
      {formateurs.map((formateur) => (
        <Link key={formateur._id} to={`/formateurs/${formateur._id}`} className="formateurs-grid__card">
          {formateur.photo ? (
            <img src={formateur.photo} alt={formateur.nom} loading="lazy" />
          ) : (
            <div className="formateurs-grid__photo-placeholder" aria-hidden="true" />
          )}
          <h3>{formateur.nom}</h3>
          <div className="formateurs-grid__filieres">
            {formateur.filieres.map((filiere) => (
              <span key={filiere}>{filiere}</span>
            ))}
          </div>
        </Link>
      ))}
    </div>
  )
}
