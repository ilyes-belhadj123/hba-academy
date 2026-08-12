import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'

const ALLOWED_ROLES = ['admin', 'formateur']

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { token, role } = useAdminAuth()

  if (!token || !role || !ALLOWED_ROLES.includes(role)) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
