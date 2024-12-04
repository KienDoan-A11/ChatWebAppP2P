import Image from 'next/image'
import { Conversation } from '@/types/messenger'

export type ConversationItemProps = {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
}

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  return (
    <div 
      className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${
        isActive ? 'bg-gray-100' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <Image 
          src={conversation.avatar}
          alt={conversation.name}
          width={40}
          height={40}
          className="rounded-full"
        />
        <span 
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            conversation.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{conversation.name}</h4>
        {conversation.lastMessage && (
          <p className="text-sm text-gray-500 truncate">
            {conversation.lastMessage}
          </p>
        )}
      </div>
    </div>
  )
} 