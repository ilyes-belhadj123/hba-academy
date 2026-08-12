import { VISITOR_PROFILES } from '../../data/profiles'
import type { VisitorProfileId } from '../../types/profile'
import './ProfileSelector.css'

interface ProfileSelectorProps {
  selectedProfileId: VisitorProfileId | null
  onSelect: (id: VisitorProfileId) => void
}

export function ProfileSelector({ selectedProfileId, onSelect }: ProfileSelectorProps) {
  return (
    <div className="profile-selector" role="group" aria-label="Sélection de profil visiteur">
      {VISITOR_PROFILES.map((profile) => (
        <button
          key={profile.id}
          type="button"
          className={
            profile.id === selectedProfileId
              ? 'profile-selector__card profile-selector__card--active'
              : 'profile-selector__card'
          }
          aria-pressed={profile.id === selectedProfileId}
          onClick={() => onSelect(profile.id)}
        >
          {profile.label}
        </button>
      ))}
    </div>
  )
}
