'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, MoreHorizontal, Smile, Reply, ArrowBigDownDash } from 'lucide-react'
import Sidebar from './Sidebar'
import ConversationList from './ConversationList'
import InfoPanel from './InfoPanel'
import { p2pService } from '../../services/p2pService';
import type { Message, Conversation, P2PMessage } from '../../types';

type MessengerProps = {
  currentPage: 'message' | 'contacts' | 'settings' | 'exit'
}

const emojis = ['👍', '❤️', '😊', '😂', '😍', '🎉']

export default function Messenger({ currentPage }: MessengerProps) {
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [showInfoPanel, setShowInfoPanel] = useState(false)
  const [activeEmojiMsg, setActiveEmojiMsg] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadConversations = async () => {
      try {
        await p2pService.initializePeerConnection(activeConv?.id || '')
      } catch (error) {
        console.error('Failed to load conversations:', error)
      }
    }

    loadConversations()
  }, [])

  const handleSend = async () => {
    if (!message.trim() || !activeConv) return

    try {
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        content: message.trim(),
        sender: participant?.name || '',
        conversationId: activeConv.id,
        timestamp: new Date(),
        reactions: {},
        replyTo: replyingTo
      }

      await p2pService.sendMessage(newMessage.content)
      
      setMessage('')
      setReplyingTo(null)
      scrollToBottom()
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleReaction = (messageId: string, emoji: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConv?.id) {
        return {
          ...conv,
          messages: conv.messages ? conv.messages.map(msg => {
            if (msg.id === messageId) {
              const updatedReactions = { ...msg.reactions }
              updatedReactions[emoji] = (updatedReactions[emoji] || 0) + 1
              return { ...msg, reactions: updatedReactions }
            }
            return msg
          }) : []
        }
      }
      return conv
    }))
    setActiveEmojiMsg(null)
  }

  const handleReply = (messageId: string) => {
    setReplyingTo(messageId)
  }

  const participant = activeConv?.participants[0]

  const getReplyMessage = (replyId: string | null) => {
    if (!replyId || !activeConv) return null
    return activeConv.messages?.find(m => m.id === replyId)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleScroll = () => {
    if (!messageContainerRef.current) return
    
    const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 850
    setShowScrollButton(isScrolledUp)
  }

  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [activeConv?.messages])

  // Add scroll event listener
  useEffect(() => {
    const container = messageContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar currentPage={currentPage} />
      
      <ConversationList
        conversations={conversations}
        activeConversation={activeConv}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setActiveConversation={setActiveConv}
      />

      <div className="flex-1 flex flex-col relative">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-800 flex items-center">
          <div className="flex items-center flex-1">
            <div className="relative">
              <img 
                src={participant?.avatar || '/avatar_placeholder.png'} 
                alt="" 
                className="w-10 h-10 rounded-full bg-gray-700" 
              />
              {participant?.status === 'online' && (
                <>
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-none bg-green-500 animate-ping" /> 
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-1 border-green-800 bg-green-500" />
                </>
              )}
            </div>
            <div className="ml-4">
              <h2 className="font-semibold">{participant?.name}</h2>
              <p className="text-sm text-gray-400">
                {participant?.status === 'online' ? 'online' : 'offline'}
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-800 rounded-full"
            onClick={() => setShowInfoPanel(!showInfoPanel)}
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        
        {/* Messages */}
        <div 
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto p-4 relative scroll-smooth"
        >
          <span className="text-xs text-gray-400 flex justify-center w-full items-center text-center">
            {activeConv?.participants[0].peerId}
            <br />
            Connected to {activeConv?.participants[0].peerId}
          </span>
          <div className="flex flex-col space-y-4">
            {(!activeConv?.messages || activeConv.messages.length === 0) ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
                <span className="text-lg mb-3">Now you can chat with each other</span>
                <div className="flex items-center gap-2">
                  <span className="text-base">Let's say hi</span>
                  <span className="text-2xl animate-bounce">👋</span>
                </div>
              </div>
            ) : (
              activeConv.messages.map((msg, index) => {
                const isMyMessage = msg.sender === 'you'
                const replyMessage = getReplyMessage(msg.replyTo || null)

                return (
                  <div key={msg.id} 
                    className={`flex w-full ${isMyMessage ? 'justify-end' : 'justify-start'}
                      animate-message-in`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      opacity: 0,
                      animation: 'message-in 0.3s ease-out forwards'
                    }}
                  >
                    <div className={`flex flex-col max-w-[70%]`}>
                      {replyMessage && (
                        <div className={`text-sm text-gray-400 mb-1 ${isMyMessage ? 'text-right' : 'text-left'}`}>
                          Replying to: {replyMessage.content.substring(0, 30)}...
                        </div>
                      )}
                      
                      <div className={`flex items-end gap-2 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                        <img 
                          src={isMyMessage ? '/avatar_placeholder.png' : participant?.avatar || ''}
                          alt=""
                          className="w-8 h-8 rounded-full"
                        />
                        
                        <div className="flex flex-col">
                          <div className={`rounded-2xl px-4 py-2
                            ${isMyMessage 
                              ? 'bg-blue-600 rounded-tr-none' 
                              : 'bg-gray-800 rounded-tl-none'
                            }`}
                          >
                            <p>{msg.content}</p>
                            <div className="text-xs text-gray-400 mt-1">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>

                          <div className="flex mt-1 space-x-2">
                            <div className="flex space-x-1">
                              {Object.entries(msg.reactions).map(([emoji, count]) => (
                                <span key={emoji} className="text-xs bg-gray-800 rounded-full px-2 py-1">
                                  {emoji} {count}
                                </span>
                              ))}
                            </div>
                            
                            <button
                              onClick={() => setActiveEmojiMsg(activeEmojiMsg === msg.id ? null : msg.id)}
                              className="text-gray-400 hover:text-gray-300"
                            >
                              <Smile className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleReply(msg.id)}
                              className="text-gray-400 hover:text-gray-300"
                            >
                              <Reply className="h-4 w-4" />
                            </button>
                          </div>

                          {activeEmojiMsg === msg.id && (
                            <div className="flex mt-1 space-x-1 bg-gray-800 rounded-lg p-1">
                              {emojis.map(emoji => (
                                <button
                                  key={emoji}
                                  onClick={() => handleReaction(msg.id, emoji)}
                                  className="text-xl hover:bg-gray-700 rounded p-1"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
          <div ref={messagesEndRef} /> {/* Anchor for auto-scroll */}
          
          {/* Scroll to bottom button */}
          {showScrollButton && (
            <div className="sticky bottom-4 w-full flex justify-center">
              <button
                onClick={scrollToBottom}
                className="p-3 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <span className="text-sm">Scroll to bottom</span>
                <ArrowBigDownDash className="h-6 w-6 animate-bounce" />
              </button>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-800">
          {replyingTo && (
            <div className="flex justify-between items-center mb-2 p-2 bg-gray-800 rounded">
              <div className="text-sm text-gray-400">
                Replying to: {getReplyMessage(replyingTo)?.content.substring(0, 30)}...
              </div>
              <button 
                onClick={() => setReplyingTo(null)}
                className="text-gray-400 hover:text-gray-300"
              >
                ×
              </button>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 p-2 bg-gray-900 rounded-lg text-white"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              className="p-2 text-gray-400 hover:text-white"
              onClick={handleSend}
            >
              <Send className="h-6 w-6" />
            </button>
          </div>
        </div>
        {/* Info Panel với transition */}
        <div 
          className={`absolute top-0 right-0 h-full w-80 bg-black border-l border-gray-800 shadow-lg
            transform transition-transform duration-300 ease-out
            ${showInfoPanel ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {showInfoPanel && (
            <InfoPanel
              conversation={activeConv as Conversation}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onClose={() => setShowInfoPanel(false)}
            />
          )}
        </div>
        
      </div>
    </div>
  )
}