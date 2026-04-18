import { useState } from "react"
import { isMoodleAvailable, getMoodleContext } from "../api/moodleApi"

export function useChat(userId = null, courseId = null) {
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

    // Récupérer le contexte Moodle seulement s'il est disponible
    let moodleContext = ""
    if (isMoodleAvailable() && userId && courseId) {
      const data = await getMoodleContext(userId, courseId)
      if (data) {
        moodleContext = `
          Contexte Moodle de l'étudiant :
          - Cours : ${JSON.stringify(data.courses)}
          - Devoirs : ${JSON.stringify(data.assignments)}
          - Notes : ${JSON.stringify(data.grades)}
        `
      }
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, moodleContext })
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