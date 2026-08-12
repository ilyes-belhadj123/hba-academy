export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

async function extractErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const data = await response.json()
    return typeof data.error === 'string' ? data.error : fallback
  } catch {
    return fallback
  }
}

async function handleResponse<T>(response: Response, path: string): Promise<T> {
  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, `Erreur API ${response.status} sur ${path}`))
  }
  if (response.status === 204) return undefined as T
  return response.json()
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | undefined>,
  token?: string,
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`)

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value) url.searchParams.set(key, value)
    }
  }

  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return handleResponse<T>(response, path)
}

export async function apiPost<T>(path: string, body: unknown, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })
  return handleResponse<T>(response, path)
}

export async function apiPut<T>(path: string, body: unknown, token: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
  return handleResponse<T>(response, path)
}

export async function apiPatch<T>(path: string, body: unknown, token: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
  return handleResponse<T>(response, path)
}

export async function apiDelete<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  return handleResponse<T>(response, path)
}
