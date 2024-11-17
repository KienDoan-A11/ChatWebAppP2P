'use client'

import Link from 'next/link'
import { MessageSquare, Users, Settings, LogOut } from 'lucide-react'

type SidebarProps = {
  currentPage: 'message' | 'contacts' | 'settings' | 'help' | 'exit'
}

export default function Sidebar({ currentPage }: SidebarProps) {
  return (
    <nav className="w-16 flex flex-col items-center py-4 space-y-8 border-r border-gray-800">
      <div className="flex flex-col space-y-6">
        <Link href="/message" className={`p-2 rounded-md hover:bg-gray-800 ${currentPage === 'message' ? 'bg-gray-800' : ''} mt-8`}>
          <MessageSquare className="h-6 w-6" />
        </Link>
        <Link href="/contacts" className={`p-2 rounded-md hover:bg-gray-800 ${currentPage === 'contacts' ? 'bg-gray-800' : ''}`}>
          <Users className="h-6 w-6" />
        </Link>
        <Link href="/settings" className={`p-2 rounded-md hover:bg-gray-800 ${currentPage === 'settings' ? 'bg-gray-800' : ''}`}>
          <Settings className="h-6 w-6" />
        </Link>
        <Link href="/" className={`p-2 rounded-md hover:bg-gray-800 ${currentPage === 'exit' ? 'bg-gray-800' : ''}`}>
          <LogOut className="h-6 w-6" />
        </Link>
      </div>
    </nav>
  )
} 