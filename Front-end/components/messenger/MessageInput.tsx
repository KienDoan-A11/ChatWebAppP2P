import { useState, Dispatch, SetStateAction } from 'react'
import { Send } from 'lucide-react'
import { Message } from '@/types/messenger'

type MessageInputProps = {
  message: string
  messages: Message[]
  replyingTo: number | null
  onMessageChange: Dispatch<SetStateAction<string>>
  onSend: () => void
  onCancelReply: () => void
}

export function MessageInput({ 
  message,
  messages,
  replyingTo,
  onMessageChange,
  onSend,
  onCancelReply
}: MessageInputProps) {

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && message.trim()) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="px-4 py-3 border-t border-gray-200 bg-white">
      {replyingTo !== null && (
        <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-700">
              {messages.find(m => m.id === replyingTo)?.sender}
            </div>
            <div className="text-sm text-gray-500 line-clamp-1">
              {messages.find(m => m.id === replyingTo)?.content}
            </div>
          </div>
          <button 
            onClick={onCancelReply}
            className="p-1 hover:bg-gray-200 rounded-full text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </button>
        </div>

        <input 
          type="text"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-2 bg-gray-50 rounded-md border border-gray-200 
                   focus:outline-none focus:ring-1 focus:ring-black focus:border-black
                   placeholder:text-gray-400"
          placeholder="Nhập tin nhắn..."
        />

        <button 
          onClick={onSend}
          disabled={!message.trim()}
          className="p-2 hover:bg-gray-100 rounded-md text-gray-600 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  )
} 