import { MessageSquare, Settings } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export function NavigationBar() {
  const router = useRouter()
  const currentPath = router.pathname

  return (
    <div className="w-[72px] bg-black h-screen flex flex-col items-center py-4">
      {/* Logo or Brand */}
      <div className="mb-8">
        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 flex flex-col items-center gap-1">
        <Link 
          href="/messenger"
          className={`p-3 rounded-lg hover:bg-gray-900 transition-colors w-full flex justify-center ${
            currentPath === '/messenger' ? 'bg-gray-900' : ''
          }`}
        >
          <MessageSquare 
            className={`w-6 h-6 ${
              currentPath === '/messenger' ? 'text-white' : 'text-gray-400'
            }`} 
          />
        </Link>

        <Link 
          href="/settings"
          className={`p-3 rounded-lg hover:bg-gray-900 transition-colors w-full flex justify-center ${
            currentPath === '/settings' ? 'bg-gray-900' : ''
          }`}
        >
          <Settings 
            className={`w-6 h-6 ${
              currentPath === '/settings' ? 'text-white' : 'text-gray-400'
            }`} 
          />
        </Link>
      </div>
    </div>
  )
} 