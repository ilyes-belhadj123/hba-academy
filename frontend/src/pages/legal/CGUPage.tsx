import { useSeo } from '../../hooks/useSeo'
import './LegalPage.css'

export function CGUPage() {
  useSeo({
    title: "Conditions générales d'utilisation — HBA Academy",
    description: "Conditions générales d'utilisation de la plateforme HBA Connect.",
  })

  return (
    <main className="legal-page">
      <h1>Conditions générales d'utilisation</h1>

      <h2>Objet</h2>
      <p>
        Les présentes conditions régissent l'utilisation de la plateforme HBA Connect, qui permet
        de découvrir les formations proposées par HBA Academy, de s'orienter, de prendre
        rendez-vous et de suivre son parcours d'apprenant.
      </p>

      <h2>Préinscription</h2>
      <p>
        Toute préinscription réalisée via le site est confirmée automatiquement par email, mais
        reste soumise à validation définitive par l'équipe HBA Academy. Elle ne constitue pas un
        engagement contractuel définitif tant que cette validation n'a pas eu lieu.
      </p>

      <h2>Assistant en ligne</h2>
      <p>
        L'assistant conversationnel répond aux questions concernant les formations, tarifs,
        sessions et modalités d'inscription. Pour toute demande hors de ce périmètre, une mise en
        relation avec un conseiller humain est proposée.
      </p>

      <h2>Compte apprenant</h2>
      <p>
        L'accès à l'espace apprenant est personnel et confidentiel. Chaque utilisateur est
        responsable de la confidentialité de ses identifiants de connexion.
      </p>

      <h2>Certificats</h2>
      <p>
        Les certificats numériques délivrés sont vérifiables en ligne via leur QR code ou leur
        code de vérification unique.
      </p>
    </main>
  )
}
