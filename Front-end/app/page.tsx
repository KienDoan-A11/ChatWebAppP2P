import Link from 'next/link'
import AnimatedBackground from '../components/ui/animated-background'

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <div className="relative flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <h1 className="text-6xl font-bold relative z-10">
            Welcome to <span className="text-blue-600"> P2P </span>
            Messenger
          </h1>
          <div className="flex mt-6 relative z-10">
            <Link href="/login" className="mx-4 px-6 py-2 bg-black text-white rounded-md">
              Login
            </Link>
            <Link href="/signup" className="mx-4 px-6 py-2 bg-gray-200 text-black rounded-md">
              Sign Up
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}