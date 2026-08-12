import { useEffect, useRef, useState, type FormEvent } from 'react'
import { sendChatMessage } from '../../api/chatbot'
import { useChatSession } from '../../hooks/useChatSession'
import './ChatWidget.css'

export function ChatWidget() {
  const { sessionId, messages, appendMessages } = useChatSession()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [escalade, setEscalade] = useState(false)
  const [preinscriptionConfirmee, setPreinscriptionConfirmee] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const content = input.trim()
    if (!content || isSending) return

    const userMessage = { role: 'user' as const, content }
    const historique = [...messages, userMessage]
    appendMessages([userMessage])
    setInput('')
    setIsSending(true)

    try {
      const result = await sendChatMessage(sessionId, historique)
      appendMessages([{ role: 'assistant', content: result.message }])
      setEscalade(result.escalade)
      setPreinscriptionConfirmee(result.preinscription_confirmee)
    } catch {
      appendMessages([
        {
          role: 'assistant',
          content: "Désolé, une erreur est survenue. Merci de réessayer dans un instant.",
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="chat-widget">
      {isOpen && (
        <div className="chat-widget__panel">
          <header className="chat-widget__header">
            <span>Assistant HBA Academy</span>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Fermer le chat">
              ✕
            </button>
          </header>

          <div className="chat-widget__messages">
            {messages.length === 0 && (
              <p className="chat-widget__hint">
                Bonjour ! Posez-moi vos questions sur nos formations, tarifs, sessions ou l'inscription.
              </p>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === 'user' ? 'chat-widget__message chat-widget__message--user' : 'chat-widget__message'
                }
              >
                {message.content}
              </div>
            ))}
            {isSending && <div className="chat-widget__message chat-widget__typing">…</div>}
            <div ref={messagesEndRef} />
          </div>

          {escalade && (
            <p className="chat-widget__banner">
              Votre demande a été transmise à un conseiller humain qui vous contactera.
            </p>
          )}
          {preinscriptionConfirmee && (
            <p className="chat-widget__banner chat-widget__banner--success">
              Votre préinscription a été enregistrée !
            </p>
          )}

          <form className="chat-widget__form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écrivez votre message…"
              disabled={isSending}
            />
            <button type="submit" disabled={isSending || !input.trim()}>
              Envoyer
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className="chat-widget__bubble"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Fermer le chat' : 'Ouvrir le chat'}
      >
        💬
      </button>
    </div>
  )
}
