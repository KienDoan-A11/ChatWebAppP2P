'use client'

import { useState, useRef, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { ChatHeader } from './ChatHeader'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { InfoPanel } from './InfoPanel'
import { AddFriendModal } from './AddFriendModal'
import { mockConversations, mockMessages, emojis } from '../../types/messenger'
import type { Message, Conversation } from '../../types/messenger'

export default function Messenger() {
  const [activeConversation, setActiveConversation] = useState(0)
  const [message, setMessage] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null)
  const [showInfoPanel, setShowInfoPanel] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [infoPanelWidth, setInfoPanelWidth] = useState(256)
  const messageContainerRef = useRef<HTMLDivElement>(null)
  const infoPanelRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)
  const [conversations, setConversations] = useState(mockConversations)
  const [messages, setMessages] = useState<Message[]>(mockMessages[0])
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [newFriendEmail, setNewFriendEmail] = useState('')

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length,
        sender: 'You',
        content: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: {},
        replyTo: replyingTo,
        conversationId: activeConversation
      }
      setMessages([...messages, newMessage])
      setMessage('')
      setReplyingTo(null)
    }
  }

  const handleReaction = (messageId: number, emoji: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const updatedReactions = { ...msg.reactions }
        updatedReactions[emoji] = (updatedReactions[emoji] || 0) + 1
        return { ...msg, reactions: updatedReactions }
      }
      return msg
    }))
    setShowEmojiPicker(null)
  }

  const handleReply = (messageId: number) => {
    setReplyingTo(messageId)
  }

  const handleConversationChange = (conversationId: number) => {
    setActiveConversation(conversationId)
    setMessages(mockMessages[conversationId] || [])
    setConversations(conversations.map((conv: Conversation) => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ))
  }

  const handleAddFriend = () => {
    if (newFriendEmail.trim()) {
      const status: 'online' | 'offline' = 'offline'
      const newFriend: Conversation = {
        id: conversations.length,
        name: newFriendEmail.split('@')[0],
        lastMessage: '',
        time: 'Just now',
        avatar: '/placeholder.svg?height=40&width=40',
        status
      }
      setConversations([...conversations, newFriend])
      setNewFriendEmail('')
      setShowAddFriend(false)
    }
  }

  const handleLogout = () => {
    window.location.href = '/login'
  }

  useEffect(() => {
    const resizeHandle = resizeHandleRef.current
    const infoPanel = infoPanelRef.current
    const messageContainer = messageContainerRef.current

    if (!resizeHandle || !infoPanel || !messageContainer) return

    let isResizing = false
    let startX: number
    let startWidth: number

    const onMouseDown = (e: MouseEvent) => {
      isResizing = true
      startX = e.clientX
      startWidth = infoPanel.offsetWidth
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      const messageContainerWidth = messageContainer.offsetWidth
      const maxWidth = messageContainerWidth * 0.5
      const newWidth = Math.min(Math.max(startWidth - (e.clientX - startX), 256), maxWidth)
      setInfoPanelWidth(newWidth)
    }

    const onMouseUp = () => {
      isResizing = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    resizeHandle.addEventListener('mousedown', onMouseDown)

    return () => {
      resizeHandle.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  const filteredMessages = messages.filter(msg =>
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-white">
      <Sidebar 
        conversations={conversations}
        activeConversation={activeConversation}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onConversationSelect={handleConversationChange}
        onAddFriend={() => setShowAddFriend(true)}
      />

      <div className="flex-1 flex flex-col" ref={messageContainerRef}>
        <ChatHeader 
          conversation={conversations[activeConversation]}
          onInfoPanelToggle={() => setShowInfoPanel(!showInfoPanel)}
        />

        <MessageList 
          messages={filteredMessages}
          onReaction={handleReaction}
          onReply={handleReply}
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
          emojis={emojis}
        />

        <MessageInput 
          message={message}
          replyingTo={replyingTo}
          messages={messages}
          onMessageChange={setMessage}
          onSend={handleSend}
          onCancelReply={() => setReplyingTo(null)}
        />
      </div>

      {showInfoPanel && (
        <InfoPanel 
          conversation={conversations[activeConversation]}
          width={infoPanelWidth}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onClose={() => setShowInfoPanel(false)}
          onLogout={handleLogout}
          resizeHandleRef={resizeHandleRef}
          infoPanelRef={infoPanelRef}
        />
      )}

      {showAddFriend && (
        <AddFriendModal 
          email={newFriendEmail}
          onEmailChange={setNewFriendEmail}
          onAdd={handleAddFriend}
          onClose={() => setShowAddFriend(false)}
        />
      )}
    </div>
  )
} 