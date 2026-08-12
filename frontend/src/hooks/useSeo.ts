import { useEffect } from 'react'

interface SeoOptions {
  title: string
  description: string
}

export function useSeo({ title, description }: SeoOptions) {
  useEffect(() => {
    document.title = title

    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', description)
  }, [title, description])
}
