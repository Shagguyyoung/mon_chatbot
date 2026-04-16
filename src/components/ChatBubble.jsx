import React from 'react'
import { useState } from 'react';
import { useChat } from '../hooks/usechat'
import ChatWindow from './ChatWindow';

export default function ChatBubble({ userId, courseId }) {

  const [isOpen, setIsOpen] = useState(false);
  const {messages, isTyping, sendMessage } = useChat(userId, courseId);
   return (
    <div className='fixed bottom-6 right-6 z-50 '>
        {isOpen && (
          <ChatWindow
          messages={messages}
          isTyping={isTyping}
          onSend={sendMessage}
          onClose={() => setIsOpen(false)}
            />
        )}
        <button
           onClick={() => setIsOpen(o => !o)}
          className="w-14 h-14 rounded-full bg-purple-600 text-white text-2xl shadow-lg hover:bg-purple-700">
          💬
        </button>
    </div>
  );
}
