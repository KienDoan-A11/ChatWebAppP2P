'use client'

import { useState } from 'react'
import { Search, UserPlus, X } from 'lucide-react'
import { User } from '../../types'
export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showConnectForm, setShowConnectForm] = useState(false)
  const [peerId, setPeerId] = useState('')
  const [users, setUsers] = useState<User[]>([])

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Connecting to peer:', peerId)
    setShowConnectForm(false)
    setPeerId('')
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-96">
      {/* Header & Search */}
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-8 mt-2">
          <UserPlus className="h-8 w-8" />
          <h1 className="text-xl font-bold">Contacts</h1>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search contacts"
            className="w-full pl-10 pr-4 py-2 bg-gray-900 rounded-lg text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Users List với container có chiều cao cố định */}
      <div className="flex flex-col h-[calc(100vh-180px)]">
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-4 hover:bg-gray-900 cursor-pointer">
              <div className="flex items-center">
                <div className="relative">
                  <img src={user.avatar || '/avatar_placeholder.png'} alt="" className="w-10 h-10 rounded-full bg-gray-700" />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black 
                    ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} 
                  />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{user.name}</h3>
                    <span className="text-xs text-gray-400">
                      {user.status === 'online' ? 'Active now' : 
                        `Last seen ${new Date(user.lastActive!).toLocaleTimeString([], 
                          { hour: '2-digit', minute: '2-digit' })}`
                      }
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  <p className="text-xs text-gray-500">Peer ID: {user.peerId}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Connect button  */}
        <div className="p-4 flex justify-center">
          <button
            onClick={() => setShowConnectForm(true)}
            className="w-64 bg-blue-800 hover:bg-blue-600 p-3 rounded-xl shadow-lg justify-center flex gap-4 items-center "
          >
            Connect to Peer <UserPlus className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Connect Form  */} 
      {showConnectForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Connect to Peer</h2>
              <button onClick={() => setShowConnectForm(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleConnect}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Peer ID</label>
                <input
                  type="text"
                  value={peerId}
                  onChange={(e) => setPeerId(e.target.value)}
                  className="w-full p-2 bg-gray-800 rounded-lg text-white"
                  placeholder="Enter peer ID"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
              >
                Connect
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
