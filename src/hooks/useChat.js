import { useState } from "react"

export function useChat() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Bonjour ! Comment puis-je vous aider ?", from: "bot" }
  ])
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = async (text) => {
    if (!text.trim()) return

    const userMsg = { id: Date.now(), text, from: "user" }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setIsTyping(true)

    const history = updatedMessages
      .filter(m => m.from !== "bot" || m.id !== 1)
      .map(m => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text
      }))

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      })

      const data = await response.json()
      setMessages(prev => [...prev, { id: Date.now() + 1, text: data.reply, from: "bot" }])
    } catch (error) {
      console.log("Erreur :", error)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Une erreur est survenue. Veuillez réessayer.",
        from: "bot"
      }])
    } finally {
      setIsTyping(false)
    }
  }

  return { messages, isTyping, sendMessage }
}