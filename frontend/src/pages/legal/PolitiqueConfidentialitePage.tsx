import { useSeo } from '../../hooks/useSeo'
import './LegalPage.css'

function Placeholder({ children }: { children: string }) {
  return <span className="legal-page__placeholder">[{children}]</span>
}

export function PolitiqueConfidentialitePage() {
  useSeo({
    title: 'Politique de confidentialité — HBA Academy',
    description: 'Comment HBA Academy collecte, utilise et protège vos données personnelles.',
  })

  return (
    <main className="legal-page">
      <h1>Politique de confidentialité</h1>

      <h2>Données collectées</h2>
      <p>
        Nous collectons les données que vous nous transmettez volontairement lors d'une
        préinscription, d'une conversation avec notre assistant en ligne, ou du simulateur
        d'orientation (nom, email, téléphone, formation d'intérêt). Aucune donnée personnelle
        n'est collectée sans action explicite de votre part.
      </p>

      <h2>Utilisation des données</h2>
      <p>
        Vos données sont utilisées exclusivement pour traiter votre demande (préinscription,
        prise de contact, suivi de votre parcours d'apprenant) et ne sont jamais vendues à des
        tiers.
      </p>

      <h2>Mineurs</h2>
      <p>
        Pour les formations destinées aux enfants et adolescents, la préinscription requiert le
        consentement explicite d'un parent ou tuteur légal.
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformément à la réglementation applicable en matière de protection des données
        personnelles, vous disposez d'un droit d'accès, de rectification et de suppression de vos
        données. Pour exercer ces droits, contactez-nous à l'adresse :{' '}
        <Placeholder>adresse email dédiée à compléter</Placeholder>.
      </p>

      <h2>Cookies</h2>
      <p>
        Ce site utilise uniquement des cookies techniques nécessaires à son fonctionnement
        (conservation de votre session de navigation). Tout cookie de mesure d'audience ou
        publicitaire ne sera activé qu'après votre consentement explicite via le bandeau affiché
        lors de votre première visite.
      </p>

      <h2>Hébergement et sécurité</h2>
      <p>
        Les données sont hébergées sur Microsoft Azure et chiffrées en transit (HTTPS). L'accès
        aux données est restreint par un contrôle des rôles (authentification et autorisations).
      </p>
    </main>
  )
}
