import type { VisitorProfileContent } from '../types/profile'

export const VISITOR_PROFILES: VisitorProfileContent[] = [
  {
    id: 'parent',
    label: 'Parent d’un enfant ou ado',
    accroche: 'Offrez à votre enfant les compétences de demain',
    description:
      'Découvrez nos formations en robotique et programmation/IA conçues pour les jeunes, dans un cadre sérieux et encadré.',
    filieresMisesEnAvant: ['Robotique & Programmation IA (jeunes)'],
    temoignage: {
      auteur: 'Parent d’un élève en robotique',
      contenu:
        'Mon enfant a découvert la programmation dans un environnement bienveillant et stimulant.',
    },
  },
  {
    id: 'jeune_adulte',
    label: 'Jeune adulte / étudiant',
    accroche: 'Trouvez la formation qui lance votre carrière',
    description:
      'Des formations professionnalisantes en bureautique, informatique et langues pour démarrer sur de bonnes bases.',
    filieresMisesEnAvant: ['Bureautique & Informatique', 'Langues'],
    temoignage: {
      auteur: 'Ancien apprenant',
      contenu: 'La formation m’a permis de décrocher mon premier poste en quelques semaines.',
    },
  },
  {
    id: 'professionnel',
    label: 'Professionnel en reconversion',
    accroche: 'Évoluez rapidement avec une formation adaptée à votre rythme',
    description:
      'Des parcours ciblés en développement personnel, coaching et informatique pour accompagner votre reconversion.',
    filieresMisesEnAvant: ['Développement personnel & Coaching', 'Bureautique & Informatique'],
    temoignage: {
      auteur: 'Apprenant en reconversion',
      contenu: 'J’ai pu concilier ma reconversion avec mon activité professionnelle grâce aux horaires flexibles.',
    },
  },
  {
    id: 'candidat_emigration',
    label: 'Candidat à l’émigration (Canada)',
    accroche: 'Préparez votre dossier et vos entretiens avec confiance',
    description:
      'Des formations en langues et en développement personnel pour renforcer votre dossier et vos entretiens.',
    filieresMisesEnAvant: ['Langues', 'Développement personnel & Coaching'],
    temoignage: {
      auteur: 'Candidat à l’émigration',
      contenu: 'Les cours de langue m’ont beaucoup aidé à me préparer pour mes entretiens.',
    },
  },
]

export function getProfileById(id: string | null): VisitorProfileContent | undefined {
  return VISITOR_PROFILES.find((profile) => profile.id === id)
}
