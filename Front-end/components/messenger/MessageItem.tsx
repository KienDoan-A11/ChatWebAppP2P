import { Message } from '@/types/messenger'
import { Dispatch, SetStateAction } from 'react'

type MessageItemProps = {
  message: Message
  isOwn: boolean
  onReply: () => void
  onReaction: (messageId: number, emoji: string) => void
  showEmojiPicker: boolean
  setShowEmojiPicker: Dispatch<SetStateAction<number | null>>
  emojis: string[]
}

export function MessageItem({
  message,
  isOwn,
  onReply,
  onReaction,
  showEmojiPicker,
  setShowEmojiPicker,
  emojis
}: MessageItemProps) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-100'} rounded-lg p-3 relative group`}>
        <p>{message.content}</p>
        <div className="text-xs text-gray-500 mt-1">
          {message.time}
        </div>

        {/* Reactions */}
        <div className="absolute bottom-0 right-0 transform translate-y-full mt-2">
          {Object.entries(message.reactions || {}).map(([emoji, count]) => (
            <span key={emoji} className="mr-1">
              {emoji} {count}
            </span>
          ))}
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg p-2 z-10">
            <div className="grid grid-cols-6 gap-1">
              {emojis.map(emoji => (
                <button
                  key={emoji}
                  className="hover:bg-gray-100 p-1 rounded"
                  onClick={() => {
                    onReaction(message.id, emoji)
                    setShowEmojiPicker(null)
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reply and React buttons */}
        <div className={`absolute ${isOwn ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 ${isOwn ? '-translate-x-full' : 'translate-x-full'} opacity-0 group-hover:opacity-100 transition-opacity px-2 flex gap-1`}>
          <button
            onClick={() => setShowEmojiPicker(message.id)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            😊
          </button>
          <button
            onClick={onReply}
            className="p-1 hover:bg-gray-100 rounded"
          >
            ↩️
          </button>
        </div>
      </div>
    </div>
  )
} 