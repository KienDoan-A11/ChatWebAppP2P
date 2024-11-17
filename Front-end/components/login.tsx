'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { p2pService } from '../services/p2pService'
import { useRouter } from 'next/navigation'
import { P2PService } from '../services/p2pService'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [p2pService] = useState(new P2PService())
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const isConnected = await p2pService.checkConnection()
      if (!isConnected) {
        throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.')
      }

      const userData = await p2pService.login(email, password)
      console.log("Đăng nhập thành công. Peer ID:", userData.peerId)

      await p2pService.initializePeerConnection(userData.peerId)
      router.push('/message')

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Đăng nhập thất bại'
      setError(errorMessage)
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async () => {
    try {
      // Kết nối P2P
      p2pService.sendP2PSignal({
        type: 'connect',
        data: 'Yêu cầu kết nối'
      });
    } catch (error) {
      console.error('Lỗi kết nối:', error);
    }
  };

  const testConnection = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/ping');
        const data = await response.json();
        console.log('API Response:', data);
        
        // Test P2P connection
        const isConnected = await p2pService.checkConnection();
        console.log('P2P Connection:', isConnected);
    } catch (error) {
        console.error('Test failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-sm p-8 rounded-lg 
          shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
          hover:shadow-[0_8px_35px_rgb(0,0,0,0.16)] 
          transition-shadow duration-300">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white 
                ${loading ? 'bg-gray-400' : 'bg-gray-600 hover:bg-gray-700'}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-gray-600 hover:text-gray-500">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  )
}