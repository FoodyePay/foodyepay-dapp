'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SplashPage() {
  const router = useRouter()

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/')
    }, 5000)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center">
      <p className="text-lg font-bold text-white-400 mb-2 animate-fade-in">Welcome to</p>
        <img
          src="/icon-512.png"
          alt="FoodyePay Logo"
          className="w-32 h-32 mb-4 animate-pulse"
        />
        <h1 className="text-2xl font-bold tracking-widest text-white">F O O D Y E P A Y</h1>
      </div>
    </div>
  )
}

