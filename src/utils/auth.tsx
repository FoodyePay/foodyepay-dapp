'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSmartWallet } from '@/lib/useSmartWallet'

export function useAuthRedirect() {
  const { walletAddress } = useSmartWallet()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      if (!walletAddress) return
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .single()

      if (error || !data) {
        console.log('❌ Not registered, redirecting to register')
        router.push('/register')
        return
      }

      const user = data

      if (user.role === 'diner') {
        router.push('/diner/dashboard')
      } else if (user.role === 'restaurant') {
        router.push('/restaurant/dashboard')
      } else if (user.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        console.error('❌ Unknown role, redirecting to /register')
        router.push('/register')
      }
    }

    checkUser().finally(() => setLoading(false))
  }, [walletAddress, router])

  return { loading }
}

// 🛎️ 新增你的 registerDiner
export async function registerDiner({
  walletAddress,
  first_name,
  last_name,
  email,
  phone,
}: {
  walletAddress: string
  first_name: string
  last_name: string
  email: string
  phone: string
}) {
  const { error: userError } = await supabase.from('users').insert([
    {
      wallet_address: walletAddress.toLowerCase(),
      email,
      phone,
      role: 'diner',
    },
  ])
  if (userError) throw new Error(`❌ User registration failed: ${userError.message}`)

  const { error: dinerError } = await supabase.from('diners').insert([
    {
      wallet: walletAddress,
      first_name,
      last_name,
      email,
      phone,
    },
  ])
  if (dinerError) throw new Error(`❌ Diner registration failed: ${dinerError.message}`)
}

// 🛎️ 新增你的 registerRestaurant
export async function registerRestaurant({
  walletAddress,
  restaurant_name,
  address,
  email,
  phone,
}: {
  walletAddress: string
  restaurant_name: string
  address: string
  email: string
  phone: string
}) {
  const { error: userError } = await supabase.from('users').insert([
    {
      wallet_address: walletAddress.toLowerCase(),
      email,
      phone,
      role: 'restaurant',
    },
  ])
  if (userError) throw new Error(`❌ User registration failed: ${userError.message}`)

  const { error: restaurantError } = await supabase.from('restaurants').insert([
    {
      wallet: walletAddress,
      restaurant_name,
      address,
      email,
      phone,
    },
  ])
  if (restaurantError) throw new Error(`❌ Restaurant registration failed: ${restaurantError.message}`)
}

// ✅ 新增 checkIfRegistered

export async function checkIfRegistered(walletAddress: string): Promise<'diner' | 'restaurant' | 'admin' | null> {
  if (!walletAddress) return null

  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('wallet_address', walletAddress.toLowerCase())
    .single()

  if (error || !data) {
    console.log('❌ Wallet not registered:', error?.message)
    return null
  }

  const role = data.role as 'diner' | 'restaurant' | 'admin'
  console.log('✅ Wallet registered as:', role)
  return role
}

