export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages } = req.body

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant pédagogique. Réponds toujours en français.'
          },
          ...messages
        ]
      })
    })

    const data = await response.json()
    res.status(200).json({ reply: data.choices[0].message.content })
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
}