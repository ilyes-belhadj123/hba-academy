const DEFAULT_TTL_MS = 5 * 60 * 1000

interface CacheEntry<T> {
  value: Promise<T>
  expiresAt: number
}

const cache = new Map<string, CacheEntry<unknown>>()

export function withCache<T>(key: string, fetcher: () => Promise<T>, ttlMs: number = DEFAULT_TTL_MS): Promise<T> {
  const entry = cache.get(key) as CacheEntry<T> | undefined
  if (entry && entry.expiresAt > Date.now()) {
    return entry.value
  }

  const value = fetcher().catch((error) => {
    cache.delete(key)
    throw error
  })
  cache.set(key, { value, expiresAt: Date.now() + ttlMs })
  return value
}

export function clearCache(prefix?: string) {
  if (!prefix) {
    cache.clear()
    return
  }
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key)
  }
}
