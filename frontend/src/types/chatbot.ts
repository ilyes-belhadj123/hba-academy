export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  message: string
  langue: 'fr' | 'derja'
  escalade: boolean
  preinscription_confirmee: boolean
}
