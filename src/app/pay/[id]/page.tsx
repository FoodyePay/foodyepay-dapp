'use client'

import { useSearchParams } from 'next/navigation'
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions'
import { FOODYE_COIN_ADDRESS, FOODYE_COIN_ABI } from '@/lib/foodyeCoin'
import { config } from '@/lib/wagmiConfig'
import { supabase } from '@/lib/supabase'
import { useSmartWallet } from '@/lib/useSmartWallet'
import { useState } from 'react'

export default function PayPage() {
  const { walletAddress } = useSmartWallet()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  const orderId = searchParams.get('orderId')

  const handlePayment = async () => {
    if (!walletAddress || !orderId) return
    setLoading(true)
    try {
      const { hash } = await writeContract(config, {
        address: FOODYE_COIN_ADDRESS,
        abi: FOODYE_COIN_ABI,
        functionName: 'payOrder',
        args: [orderId],
        value: BigInt(0),
      })

      await waitForTransactionReceipt(config, { hash })

      await supabase.from('payments').insert([
        { diner_wallet: walletAddress.toLowerCase(), order_id: orderId },
      ])

      alert('✅ Payment successful!')
    } catch (err: any) {
      console.error('❌ Payment error:', err.message)
      alert('❌ Payment failed!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Pay for Order</h1>
      <button
        onClick={handlePayment}
        disabled={loading || !walletAddress}
        className="px-6 py-3 rounded bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  )
}




