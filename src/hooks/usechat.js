import { useState } from "react"
import Groq from "groq-sdk"

const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
})

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
      const response = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Tu es un assistant virtuel serviable et concis. Réponds toujours en français." },
          ...history
        ]
      })

      const reply = response.choices[0].message.content
      setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, from: "bot" }])
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