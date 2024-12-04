import { MoreHorizontal } from 'lucide-react'
import { Conversation } from '@/types/messenger'

type ChatHeaderProps = {
  conversation: Conversation
  onInfoPanelToggle: () => void
}

export function ChatHeader({ conversation, onInfoPanelToggle }: ChatHeaderProps) {
  return (
    <div className="p-4 bg-black text-white flex justify-between items-center">
      <div className="flex items-center">
        <img src={conversation.avatar} alt="" className="w-10 h-10 rounded-full mr-3" />
        <div>
          <h2 className="text-lg font-semibold">{conversation.name}</h2>
          <span className="text-sm text-gray-400">{conversation.status}</span>
        </div>
      </div>
      <button 
        className="text-white hover:text-gray-300"
        onClick={onInfoPanelToggle}
      >
        <MoreHorizontal className="h-6 w-6" />
      </button>
    </div>
  )
} 