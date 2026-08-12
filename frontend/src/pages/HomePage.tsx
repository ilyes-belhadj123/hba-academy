import { Link } from 'react-router-dom'
import { ProfileSelector } from '../components/ProfileSelector/ProfileSelector'
import { getProfileById } from '../data/profiles'
import { useVisitorProfile } from '../hooks/useVisitorProfile'
import './HomePage.css'

export function HomePage() {
  const { profileId, selectProfile } = useVisitorProfile()
  const profile = getProfileById(profileId)

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

      <div className="home-page__cta">
        <Link to="/catalogue">Voir le catalogue des formations</Link>
      </div>
    </main>
  )
}
