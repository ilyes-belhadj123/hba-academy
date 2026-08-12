import { useState } from 'react'
import type { ChatMessage } from '../types/chatbot'

const SESSION_ID_KEY = 'hba_chat_session_id'
const MESSAGES_KEY = 'hba_chat_messages'

function getOrCreateSessionId(): string {
  const existing = sessionStorage.getItem(SESSION_ID_KEY)
  if (existing) return existing

  const created = crypto.randomUUID()
  sessionStorage.setItem(SESSION_ID_KEY, created)
  return created
}

function readStoredMessages(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(MESSAGES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useChatSession() {
  const [sessionId] = useState<string>(getOrCreateSessionId)
  const [messages, setMessages] = useState<ChatMessage[]>(readStoredMessages)

  const appendMessages = (newMessages: ChatMessage[]) => {
    setMessages((current) => {
      const updated = [...current, ...newMessages]
      sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(updated))
      return updated
    })
  }

  return { sessionId, messages, appendMessages }
}
