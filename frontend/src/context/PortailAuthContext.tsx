import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { login as loginRequest } from '../api/auth'
import type { DecodedToken } from '../types/auth'

const STORAGE_KEY = 'hba_portail_token'

function decodeToken(token: string): DecodedToken | null {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

interface PortailAuthContextValue {
  token: string | null
  role: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const PortailAuthContext = createContext<PortailAuthContextValue | null>(null)

export function PortailAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY))

  const login = async (email: string, password: string) => {
    const tokens = await loginRequest(email, password)
    localStorage.setItem(STORAGE_KEY, tokens.access_token)
    setToken(tokens.access_token)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setToken(null)
  }

  const role = useMemo(() => (token ? decodeToken(token)?.role ?? null : null), [token])

  return (
    <PortailAuthContext.Provider value={{ token, role, login, logout }}>{children}</PortailAuthContext.Provider>
  )
}

export function usePortailAuth(): PortailAuthContextValue {
  const context = useContext(PortailAuthContext)
  if (!context) throw new Error('usePortailAuth doit être utilisé dans PortailAuthProvider')
  return context
}
