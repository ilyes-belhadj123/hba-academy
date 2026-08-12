import type { ButtonHTMLAttributes } from 'react'
import './Button.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const variantClass = variant === 'secondary' ? 'hba-button hba-button--secondary' : 'hba-button'
  return <button className={className ? `${variantClass} ${className}` : variantClass} {...props} />
}
