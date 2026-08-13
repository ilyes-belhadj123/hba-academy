import { useEffect } from 'react'

interface SeoOptions {
  title: string
  description: string
  image?: string
  type?: 'website' | 'article' | 'profile'
}

function setMetaTag(attribute: 'name' | 'property', key: string, content: string) {
  let tag = document.querySelector(`meta[${attribute}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

export function useSeo({ title, description, image, type = 'website' }: SeoOptions) {
  useEffect(() => {
    document.title = title
    setMetaTag('name', 'description', description)

    setMetaTag('property', 'og:title', title)
    setMetaTag('property', 'og:description', description)
    setMetaTag('property', 'og:type', type)
    setMetaTag('property', 'og:url', window.location.href)
    if (image) {
      setMetaTag('property', 'og:image', image)
    }
  }, [title, description, image, type])
}
