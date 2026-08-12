import type { HTMLAttributes } from 'react'
import './Card.css'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={className ? `hba-card ${className}` : 'hba-card'} {...props} />
}
