'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Order = {
  id: string
  order_number: string
  foody_amount: number
  total_amount: number
  diner_id: string
  status: 'pending' | 'paid' | 'cancelled'
  created_at: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  // 🚀 初始加载
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch orders:', error)
    } else {
      setOrders(data || [])
    }
  }

  // ✅ 订阅更新
  useEffect(() => {
    fetchOrders()

    const channel = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          const updated = payload.new as Order
          setOrders((prev) =>
            prev.map((o) => (o.id === updated.id ? updated : o))
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">🍽️ Restaurant Orders</h1>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-center text-gray-400">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className={`p-4 rounded-xl border transition ${
                order.status === 'paid'
                  ? 'border-green-500 bg-green-800/10'
                  : order.status === 'pending'
                  ? 'border-yellow-500 bg-yellow-800/10'
                  : 'border-red-500 bg-red-800/10'
              }`}
            >
              <p className="text-sm text-gray-400">Order #: {order.order_number}</p>
              <p className="text-sm text-purple-300">Diner ID: {order.diner_id}</p>
              <p className="text-md font-bold">Total: ${order.total_amount.toFixed(2)} / {order.foody_amount.toFixed(2)} FOODY</p>
              <p className="text-sm text-gray-400">
                🕒 {new Date(order.created_at).toLocaleString()}
              </p>
              <p className="text-sm">
                Status:{' '}
                <span
                  className={`font-semibold ${
                    order.status === 'paid'
                      ? 'text-green-400'
                      : order.status === 'pending'
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  }`}
                >
                  {order.status.toUpperCase()}
                </span>
              </p>
            </div>
          ))
        )}
      </div>
    </main>
  )
}

