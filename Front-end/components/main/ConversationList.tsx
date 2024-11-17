'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import type { Conversation } from '../../types'

interface ConversationListProps {
  conversations: Conversation[]
  activeConversation: Conversation | null
  searchQuery: string
  setSearchQuery: (query: string) => void
  setActiveConversation: (conv: Conversation) => void
}

export default function ConversationList({
  conversations,
  activeConversation,
  searchQuery,
  setSearchQuery,
  setActiveConversation
}: ConversationListProps) {
  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  return (
    <div className="w-96 border-r border-gray-800">
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations"
            className="w-full pl-10 pr-4 py-2 bg-gray-900 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="overflow-y-auto">
        {filteredConversations.map((conv) => (
          <div
            key={conv.id}
            className={`p-4 hover:bg-gray-900 cursor-pointer ${
              activeConversation?.id === conv.id ? 'bg-gray-900' : ''
            }`}
            onClick={() => setActiveConversation(conv)}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <h3 className="font-semibold">
                  {conv.participants[0].name}
                </h3>
                <p className="text-sm text-gray-400">
                  {conv.lastMessage?.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 