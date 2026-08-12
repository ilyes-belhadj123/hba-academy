import type { ReactNode } from 'react'
import './FormField.css'

interface FormFieldProps {
  label: string
  children: ReactNode
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <label className="hba-form-field">
      {label}
      {children}
    </label>
  )
}
