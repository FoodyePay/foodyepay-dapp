'use client'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 👉 注册 users 表
export async function registerUser({
  email,
  phone,
  wallet_address,
  role,
}: {
  email: string
  phone: string
  wallet_address: string
  role: 'diner' | 'restaurant'
}) {
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        email,
        phone,
        wallet_address: wallet_address.toLowerCase(),
        role,
      },
    ])
    .select()
    .single()

  if (error) throw new Error(error.message)

  return data
}

// 👉 查询 wallet 是否已经注册 users 表
export async function getUserByWallet(walletAddress: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress.toLowerCase())
    .single()

  if (error) return null
  return data
}
