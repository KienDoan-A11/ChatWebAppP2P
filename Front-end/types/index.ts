export interface User {
  id: string;
  name: string;
  email: string;
  peerId: string;
  status: 'online' | 'offline';
  lastActive?: Date;
  avatar?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  replyTo?: string | null;
  reactions: {
    [key: string]: number;
  };
  conversationId: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
  createdAt: Date;

}

// Thêm các type cho P2P
export interface P2PMessage extends Message {
  type: 'message' | 'reaction' | 'typing';
  conversationId: string;
}

export interface P2PConnection {
  peerId: string;
  status: 'connecting' | 'connected' | 'disconnected';
  lastPing?: Date;
} 