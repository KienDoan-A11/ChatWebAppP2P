export type User = {
  id: string
  name: string
  email: string
  avatar?: string | null
  status?: 'online' | 'offline' | 'away'
  lastActive?: Date
} 