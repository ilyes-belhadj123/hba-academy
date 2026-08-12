import { useSeo } from '../../hooks/useSeo'
import './LegalPage.css'

function Placeholder({ children }: { children: string }) {
  return <span className="legal-page__placeholder">[{children}]</span>
}

export function MentionsLegalesPage() {
  useSeo({
    title: 'Mentions légales — HBA Academy',
    description: 'Mentions légales de la plateforme HBA Connect.',
  })

  return (
    <main className="legal-page">
      <h1>Mentions légales</h1>

      <h2>Éditeur du site</h2>
      <p>
        HBA Academy — <Placeholder>forme juridique à compléter</Placeholder>
        <br />
        Siège social : <Placeholder>adresse complète à compléter</Placeholder>
        <br />
        Registre / matricule fiscal : <Placeholder>numéro à compléter par l'équipe HBA</Placeholder>
        <br />
        Directeur de la publication : <Placeholder>nom et fonction à compléter</Placeholder>
      </p>

      <h2>Contact</h2>
      <p>
        Email : <Placeholder>adresse email de contact à compléter</Placeholder>
        <br />
        Téléphone : <Placeholder>numéro à compléter</Placeholder>
      </p>

      <h2>Hébergement</h2>
      <p>
        Ce site est hébergé sur Microsoft Azure.
        <br />
        Microsoft Corporation, One Microsoft Way, Redmond, WA 98052, États-Unis.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus présents sur ce site (textes, images, logos, vidéos) est la
        propriété de HBA Academy, sauf mention contraire, et ne peut être reproduit sans
        autorisation préalable.
      </p>
    </main>
  )
}
