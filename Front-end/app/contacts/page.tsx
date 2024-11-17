'use client'

import { useState } from 'react'
import Contacts from '../../components/main/contacts'
import Sidebar from '../../components/main/Sidebar'
import { Conversation } from '../../types'

export default function ContactsPage() {
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar currentPage="contacts" />
      <Contacts />
      
      {/* Hiển thị hội thoại hiện tại */}
      <div className="flex-1 flex items-center justify-center border-l border-gray-800">
        {activeConversation ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">{activeConversation.participants[0].name}</h2>
            <p className="text-gray-400">Select a contact to start chatting</p>
          </div>
        ) : (
          <p className="text-gray-400">No conversation selected</p>
        )}
      </div>
    </div>
  )
} 