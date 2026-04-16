import { useState } from "react"
import Groq from "groq-sdk"
import { getCourses, getAssignments, getGrades } from "../api/moodleApi"

const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
})

export function useChat(userId, courseId) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Bonjour ! Je suis votre assistant Moodle. Comment puis-je vous aider ?", from: "bot" }
  ])
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = async (text) => {
    if (!text.trim()) return

    const userMsg = { id: Date.now(), text, from: "user" }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setIsTyping(true)

    try {
      // Récupérer le contexte Moodle
      const [courses, assignments, grades] = await Promise.all([
        getCourses(userId),
        getAssignments(courseId),
        getGrades(courseId, userId)
      ])

      // Construire le contexte pour Groq
      const moodleContext = `
        Cours de l'étudiant : ${JSON.stringify(courses)}
        Devoirs : ${JSON.stringify(assignments)}
        Notes : ${JSON.stringify(grades)}
      `

      const history = updatedMessages
        .filter(m => m.from !== "bot" || m.id !== 1)
        .map(m => ({
          role: m.from === "user" ? "user" : "assistant",
          content: m.text
        }))

      const response = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Tu es un assistant pédagogique intégré à Moodle. 
            Réponds toujours en français de manière concise.
            Voici les données actuelles de l'étudiant sur Moodle :
            ${moodleContext}`
          },
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