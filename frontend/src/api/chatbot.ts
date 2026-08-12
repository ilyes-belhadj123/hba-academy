import { apiPost } from './client'
import type { ChatMessage, ChatResponse } from '../types/chatbot'

export function sendChatMessage(sessionId: string, messages: ChatMessage[]): Promise<ChatResponse> {
  return apiPost<ChatResponse>('/api/chatbot/message', { session_id: sessionId, messages })
}
