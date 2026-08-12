export interface TokenPair {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface DecodedToken {
  sub: string
  role: string
  type: 'access' | 'refresh'
  exp: number
}
