import type { ReactNode } from 'react'
import './Badge.css'

export function Badge({ children }: { children: ReactNode }) {
  return <span className="hba-badge">{children}</span>
}
