'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSmartWallet } from '@/lib/useSmartWallet'
import { formatEther } from 'viem'
import { readContract } from 'wagmi/actions'
import { config } from '@/lib/wagmiConfig'
import { FOODYE_COIN_ABI, FOODYE_COIN_ADDRESS } from '@/lib/foodyeCoin'
import FundCard from '@/components/FundWallet'
import SwapToken from '@/components/SwapToken'

type Order = {
  id: string
  restaurant_name: string
  amount: number
  status: string
  created_at: string
}

export default function DinerDashboard() {
  const { walletAddress } = useSmartWallet()
  const [orders, setOrders] = useState<Order[]>([])
  const [balance, setBalance] = useState<string>('0')

  useEffect(() => {
    const fetchBalance = async () => {
      if (!walletAddress) return
      try {
        const result = await readContract(config, {
          address: FOODYE_COIN_ADDRESS,
          abi: FOODYE_COIN_ABI,
          functionName: 'balanceOf',
          args: [walletAddress],
        })
        setBalance(formatEther(result as bigint))
      } catch (err) {
        console.error('❌ Failed to fetch balance:', err)
      }
    }
    fetchBalance()
  }, [walletAddress])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!walletAddress) return
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('diner_wallet', walletAddress.toLowerCase())
        .order('created_at', { ascending: false })
      if (data) setOrders(data as Order[])
    }
    fetchOrders()
  }, [walletAddress])

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 space-y-8">
      <div className="bg-zinc-900 p-6 rounded-lg shadow-md">
        <h1 className="text-lg font-semibold mb-2">👛 Connected Wallet</h1>
        <p className="break-all text-gray-300">{walletAddress || 'Not Connected'}</p>
      </div>

      <div className="bg-zinc-900 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">💵 Fund ETH</h2>
        <FundCard />
      </div>

      <div className="bg-zinc-900 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">🔄 Swap ETH to FOODY</h2>
        <SwapToken />
      </div>

      <div className="bg-zinc-900 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">📦 Your Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-400">No orders yet.</p>
        ) : (
          <ul className="space-y-3">
            {orders.map((order) => (
              <li
                key={order.id}
                className="border border-zinc-700 rounded p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">{order.restaurant_name}</p>
                  <p className="text-sm text-gray-400">
                    {order.status} · {order.created_at.split('T')[0]}
                  </p>
                </div>
                <span className="text-green-400 font-mono">{order.amount} FOODY</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
