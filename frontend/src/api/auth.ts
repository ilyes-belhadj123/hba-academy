import { apiPost } from './client'
import type { TokenPair } from '../types/auth'

export function login(email: string, password: string): Promise<TokenPair> {
  return apiPost<TokenPair>('/api/auth/login', { email, password })
}
