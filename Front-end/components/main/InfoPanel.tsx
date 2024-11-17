'use client'

import { X, Phone, Video, Search, Trash2 } from 'lucide-react'
import { Conversation } from '../../types'
type InfoPanelProps = {
  conversation: Conversation
  searchQuery: string
  setSearchQuery: (query: string) => void
  onClose: () => void
}

export default function InfoPanel({
  conversation,
  searchQuery,
  setSearchQuery,
  onClose
}: InfoPanelProps) {
  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-black border-l border-gray-800 shadow-lg">
      <div className="px-4 py-6 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chat Info</h2>
        <button 
          className="text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="p-4 space-y-6">
        <div className="flex flex-col items-center">
          <img 
            src={conversation?.participants[0].avatar || '/avatar_placeholder.png'} 
            alt="" 
            className="w-20 h-20 rounded-full mb-2" 
          />
          <h3 className="text-lg font-semibold">{conversation?.participants[0].name}</h3>
          <span className="text-sm text-gray-400">
            {conversation?.participants[0].status === 'online' ? 'online' : 'offline'}
          </span>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button className="p-3 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-gray-700">
            <Phone className="h-5 w-5" />
          </button>
          <button className="p-3 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-gray-700">
            <Video className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-gray-400">Search in Conversation</h4>
          <div className="flex items-center bg-gray-900 rounded-lg p-2">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages"
              className="ml-2 bg-transparent focus:outline-none text-sm text-white placeholder-gray-400 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800">
          <button className="flex items-center text-red-500 hover:text-red-400">
            <Trash2 className="h-5 w-5 mr-2" />
            Remove Chat
          </button>
        </div>
      </div>
    </div>
  )
} 