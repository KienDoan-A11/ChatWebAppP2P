export type Message = {
  id: number
  sender: string
  content: string
  time: string
  reactions: { [key: string]: number }
  replyTo?: number | null
  conversationId: number
}

export type Conversation = {
  id: number
  name: string
  lastMessage: string
  time: string
  avatar: string
  status: 'online' | 'offline'
  unreadCount?: number
}


export const mockConversations: Conversation[] = [
  { 
    id: 0, 
    name: 'Alice Johnson', 
    lastMessage: 'Sure, let\'s meet at 3 PM', 
    time: '2:55 PM', 
    avatar: '/avatar_placeholder.png' ,
    status: 'online',
    unreadCount: 2
  },
  { 
    id: 1, 
    name: 'Bob Smith', 
    lastMessage: 'Can you send me the report?', 
    time: '11:20 AM', 
    avatar: '/avatar_placeholder.png',
    status: 'offline' 
  },
  { 
    id: 2, 
    name: 'Carol Williams', 
    lastMessage: 'Great job on the presentation!', 
    time: 'Yesterday', 
    avatar: '/avatar_placeholder.png',
    status: 'online' 
  },
  { 
    id: 3, 
    name: 'David Brown', 
    lastMessage: 'How about dinner tonight?', 
    time: '1:30 PM', 
    avatar: '/avatar_placeholder.png',
    status: 'offline' 
  },
  { 
    id: 4, 
    name: 'Emma Davis', 
    lastMessage: 'The project is done!', 
    time: 'Yesterday', 
    avatar: '/avatar_placeholder.png',
    status: 'online' 
  }
]

export const mockMessages: { [key: number]: Message[] } = {
  0: [
    { id: 0, sender: 'Alice Johnson', content: 'Hey, are you free this afternoon?', time: '2:30 PM', reactions: {}, conversationId: 0 },
    { id: 1, sender: 'You', content: 'I should be. What\'s up?', time: '2:45 PM', reactions: {}, conversationId: 0 },
    { id: 2, sender: 'Alice Johnson', content: 'I was hoping we could go over the project details.', time: '2:50 PM', reactions: {}, conversationId: 0 },
    { id: 3, sender: 'You', content: 'Sure, let\'s meet at 3 PM', time: '2:55 PM', reactions: {}, conversationId: 0 },
  ],
  1: [
    { id: 0, sender: 'Bob Smith', content: 'Did you get my email about the report?', time: '11:15 AM', reactions: {}, conversationId: 1 },
    { id: 1, sender: 'You', content: 'Yes, I\'m working on it now', time: '11:20 AM', reactions: {}, conversationId: 1 },
  ],
  2: [
    { id: 0, sender: 'Carol Williams', content: 'Your presentation was amazing!', time: 'Yesterday', reactions: {}, conversationId: 2 },
    { id: 1, sender: 'You', content: 'Thank you! I spent a lot of time on it', time: 'Yesterday', reactions: {}, conversationId: 2 },
  ]
}

export const emojis = ['👍', '❤️', '😆', '😮', '😢', '😡'] 