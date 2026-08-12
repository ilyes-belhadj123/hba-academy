import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { usePortailAuth } from '../../context/PortailAuthContext'

export function RequirePortail({ children }: { children: ReactNode }) {
  const { token, role } = usePortailAuth()

  if (!token || role !== 'apprenant') {
    return <Navigate to="/portail/login" replace />
  }

  return children
}
