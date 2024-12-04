import { Message } from '@/types/messenger'
import { Smile, Reply } from 'lucide-react'

type MessageListProps = {
  messages: Message[]
  onReaction: (messageId: number, emoji: string) => void
  onReply: (messageId: number) => void
  showEmojiPicker: number | null
  setShowEmojiPicker: (id: number | null) => void
  emojis: string[]
}

export function MessageList({
  messages,
  onReaction,
  onReply,
  showEmojiPicker,
  setShowEmojiPicker,
  emojis
}: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-2 bg-white">
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-6 text-center">
            <div className="max-w-sm">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-8 h-8 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
            <p className="text-gray-500">
              Now you can start chatting with each other. Say hello! 👋
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`group flex items-end ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="relative max-w-[60%]">
                {showEmojiPicker === message.id && (
                  <div className="absolute bottom-full mb-1 bg-white shadow-lg rounded-lg p-1.5 z-10">
                    <div className="flex gap-0.5">
                      {emojis.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => {
                            onReaction(message.id, emoji)
                            setShowEmojiPicker(null)
                          }}
                          className="p-1 hover:bg-gray-100 rounded-lg"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="relative">
                  <div 
                    className={`absolute bottom-0 opacity-0 group-hover:opacity-100 transition-opacity
                              flex gap-0.5 ${message.sender === 'You' ? '-left-24' : '-right-24'}`}
                  >
                    <button 
                      onClick={() => setShowEmojiPicker(message.id)}
                      className="p-1 hover:bg-gray-100 rounded-full text-gray-500"
                    >
                      <Smile size={14} />
                    </button>
                    <button 
                      onClick={() => onReply(message.id)}
                      className="p-1 hover:bg-gray-100 rounded-full text-gray-500"
                    >
                      <Reply size={14} />
                    </button>
                  </div>

                  <div 
                    className={`w-fit ${
                      message.sender === 'You' 
                        ? 'bg-black text-white rounded-2xl rounded-tr-sm' 
                        : 'bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm'
                    } px-3 py-1.5`}
                  >
                    {message.replyTo !== null && (
                      <div className={`text-xs mb-0.5 pl-2 border-l-2 
                                    ${message.sender === 'You' ? 'border-gray-500' : 'border-gray-300'}
                                    ${message.sender === 'You' ? 'text-gray-300' : 'text-gray-500'}`}>
                        <div className="font-medium">
                          {messages.find(m => m.id === message.replyTo)?.sender}
                        </div>
                        <div className="line-clamp-1">
                          {messages.find(m => m.id === message.replyTo)?.content}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                    
                    <div className={`text-[10px] mt-0.5 ${
                      message.sender === 'You' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {message.time}
                    </div>

                    {Object.entries(message.reactions).length > 0 && (
                      <div className="flex gap-0.5 mt-0.5 flex-wrap">
                        {Object.entries(message.reactions).map(([emoji, count]) => (
                          <span key={emoji} 
                                className={`text-[10px] px-1 py-0.5 rounded-full
                                        ${message.sender === 'You' 
                                          ? 'bg-gray-800 text-gray-200' 
                                          : 'bg-gray-200 text-gray-700'}`}>
                            {emoji} {count}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 