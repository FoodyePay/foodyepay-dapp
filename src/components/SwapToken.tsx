'use client'

import { useState } from 'react'
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions'
import { FOODYE_COIN_ABI, FOODYE_COIN_ADDRESS } from '@/lib/foodyeCoin'
import { useSmartWallet } from '@/lib/useSmartWallet'
import { config } from '@/lib/wagmiConfig'

export default function SwapToken() {
  const { walletAddress } = useSmartWallet()
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSwap = async () => {
    if (!walletAddress || !amount) return alert('Please enter amount.')
    setLoading(true)
    try {
      const { hash } = await writeContract(config, {
        address: FOODYE_COIN_ADDRESS,
        abi: FOODYE_COIN_ABI,
        functionName: 'swapETHForFoody',
        value: BigInt(parseFloat(amount) * 1e18),
      })

      await waitForTransactionReceipt(config, { hash })
      alert('✅ Swap successful!')
    } catch (err: any) {
      console.error('❌ Swap error:', err.message)
      alert('❌ Swap failed!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="number"
        placeholder="Enter ETH amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 rounded bg-zinc-800 text-white"
      />
      <button
        onClick={handleSwap}
        disabled={!walletAddress || loading}
        className="w-full py-2 rounded bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? 'Swapping...' : 'Swap ETH ➔ FOODY'}
      </button>
    </div>
  )
}

