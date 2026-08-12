import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchRealisations } from '../api/realisations'
import { ProfileSelector } from '../components/ProfileSelector/ProfileSelector'
import { getProfileById } from '../data/profiles'
import { useVisitorProfile } from '../hooks/useVisitorProfile'
import type { Realisation } from '../types/realisation'
import './HomePage.css'

export function HomePage() {
  const { profileId, selectProfile } = useVisitorProfile()
  const profile = getProfileById(profileId)
  const [realisationsMisesEnAvant, setRealisationsMisesEnAvant] = useState<Realisation[]>([])

  useEffect(() => {
    fetchRealisations({ mise_en_avant: 'true' }).then(setRealisationsMisesEnAvant)
  }, [])

  return (
    <main className="home-page">
      <section className="home-page__hero">
        <h1>HBA Academy</h1>
        <p>Trouvez la formation qui vous correspond, quel que soit votre profil.</p>
        <ProfileSelector selectedProfileId={profileId} onSelect={selectProfile} />
      </section>

      {profile && (
        <section className="home-page__profile-content">
          <h2>{profile.accroche}</h2>
          <p>{profile.description}</p>

          <div className="home-page__filieres">
            {profile.filieresMisesEnAvant.map((filiere) => (
              <span key={filiere} className="home-page__filiere-badge">
                {filiere}
              </span>
            ))}
          </div>

          <blockquote className="home-page__temoignage">
            <p>« {profile.temoignage.contenu} »</p>
            <cite>{profile.temoignage.auteur}</cite>
          </blockquote>
        </section>
      )}

      {realisationsMisesEnAvant.length > 0 && (
        <section className="home-page__realisations">
          <h2>Ils nous font confiance</h2>
          <div className="home-page__realisations-grid">
            {realisationsMisesEnAvant.map((realisation) => (
              <div key={realisation._id} className="home-page__realisation-card">
                <strong>{realisation.valeur !== null ? realisation.valeur : realisation.titre}</strong>
                <span>{realisation.description || realisation.titre}</span>
              </div>
            ))}
          </div>
          <Link to="/realisations" className="home-page__realisations-link">
            Voir toutes nos réalisations
          </Link>
        </section>
      )}

      <div className="home-page__cta">
        <Link to="/orientation">Faire le simulateur d'orientation</Link>
        <Link to="/catalogue" className="home-page__cta-secondary">
          Voir le catalogue des formations
        </Link>
        <Link to="/preuves-sociales" className="home-page__cta-secondary">
          Projets d'élèves & témoignages
        </Link>
        <Link to="/formateurs" className="home-page__cta-secondary">
          Nos formateurs
        </Link>
      </div>
    </main>
  )
}
