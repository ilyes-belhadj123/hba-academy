import { useCallback, useState } from 'react'
import type { VisitorProfileId } from '../types/profile'

const STORAGE_KEY = 'hba_visitor_profile'

function readStoredProfile(): VisitorProfileId | null {
  return sessionStorage.getItem(STORAGE_KEY) as VisitorProfileId | null
}

export function useVisitorProfile() {
  const [profileId, setProfileId] = useState<VisitorProfileId | null>(readStoredProfile)

  const selectProfile = useCallback((id: VisitorProfileId) => {
    sessionStorage.setItem(STORAGE_KEY, id)
    setProfileId(id)
  }, [])

  const resetProfile = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY)
    setProfileId(null)
  }, [])

  return { profileId, selectProfile, resetProfile }
}
