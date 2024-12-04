import { Conversation } from '@/types/messenger'
import { Dispatch, SetStateAction } from 'react'
import { ConversationItem } from './ConversationItem'
import { Search, UserPlus } from 'lucide-react'
import Image from 'next/image'

type SidebarProps = {
  conversations: Conversation[]
  activeConversation: number
  searchQuery: string
  onSearch: Dispatch<SetStateAction<string>>
  onConversationSelect: (conversationId: number) => void
  onAddFriend: () => void
}

export function Sidebar({ 
  conversations,
  activeConversation,
  searchQuery,
  onSearch,
  onConversationSelect,
  onAddFriend
}: SidebarProps) {
  return (
    <div className="w-80 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Chats</h2>
          <button 
            onClick={onAddFriend}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <UserPlus className="w-5 h-5" />
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full p-2 pl-8 rounded-lg bg-gray-100"
          />
          <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isActive={conversation.id === activeConversation}
            onClick={() => onConversationSelect(conversation.id)}
          />
        ))}
      </div>
    </div>
  )
} 