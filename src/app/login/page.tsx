'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSmartWallet } from '@/lib/useSmartWallet'
import { useAuthRedirect } from '@/utils/auth'

export default function LoginPage() {
  const router = useRouter()
  const { connectSmartWallet } = useSmartWallet()
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      await connectSmartWallet()
      router.push('/')
    } catch (err) {
      console.error('❌ Login failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-center">Login to FoodyePay</h1>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 py-3 rounded-lg font-bold tracking-wide transition"
        >
          {loading ? 'Connecting...' : 'Connect Smart Wallet'}
        </button>

        <div className="text-center">
          <button onClick={() => router.push('/register')} className="text-sm text-purple-400 hover:underline">
            Don't have an account? Register →
          </button>
        </div>
      </div>
    </div>
  )
}

