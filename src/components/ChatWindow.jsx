import { useState, useRef, useEffect } from 'react'

export default function ChatWindow({ messages, isTyping, onSend, onClose }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = () => {
    if (!input.trim()) return
    onSend(input)
    setInput('')
  }

  return (
    <div className="w-80 bg-white rounded-2xl border border-gray-200 mb-3 flex flex-col shadow-xl overflow-hidden">

      {/* Header */}
      <div className="bg-purple-600 px-4 py-3 flex justify-between items-center">
        <span className="text-white font-medium">Assistant</span>
        <button onClick={onClose} className="text-white text-xl leading-none bg-transparent border-none cursor-pointer hover:text-purple-200">
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-2 p-4 overflow-y-auto max-h-80 min-h-48 bg-blue-500">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2 text-sm leading-relaxed rounded-2xl
              ${msg.from === 'user'
                ? 'bg-purple-600 text-white rounded-br-sm'
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
              }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Indicateur de frappe */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-2 flex gap-1">
              {[0, 1, 2].map(i => (
                <span key={i}
                  className="w-2 h-2 rounded-full bg-purple-300 inline-block animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 p-3 border-t border-gray-200 bg-white items-center">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Écrivez un message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-purple-500"
        />
        <button onClick={handleSend}
          className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-700 text-white border-none cursor-pointer flex items-center justify-center text-base">
          ➤
        </button>
      </div>
    </div>
  )
}