import { User } from '@/types/user'

export const demoUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: null,
    status: 'online',
    lastActive: new Date()
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    avatar: '/avatars/bob.jpg',
    status: 'offline',
    lastActive: new Date('2024-03-10T15:00:00')
  },
  {
    id: '3',
    name: 'Carol Williams',
    email: 'carol@example.com',
    avatar: null,
    status: 'away',
    lastActive: new Date('2024-03-10T16:30:00')
  }
]

// Hàm helper để lấy user demo
export function getDemoUser(): User {
  return demoUsers[0] // Trả về Alice làm user mặc định
} 