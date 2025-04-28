'use client'

import BuyToken from '@/components/BuyToken'
import FundWallet from '@/components/FundWallet'
import EarnDeposit from '@/components/EarnDeposit'
import SmartTransaction from '../../components/SmartTransaction'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 space-y-12">
      <h1 className="text-3xl font-bold text-center mb-8">🛒 FoodyePay Demo Center</h1>

      <section className="bg-zinc-900 p-6 rounded-lg space-y-4">
        <h2 className="text-2xl font-bold">Buy USDC</h2>
        <p className="text-gray-400 text-sm mb-4">Purchase USDC directly into your Smart Wallet.</p>
        <BuyToken />
      </section>

      <section className="bg-zinc-900 p-6 rounded-lg space-y-4">
        <h2 className="text-2xl font-bold">Fund Wallet</h2>
        <p className="text-gray-400 text-sm mb-4">Fund your wallet with a debit card or Coinbase account.</p>
        <FundWallet />
      </section>

      <section className="bg-zinc-900 p-6 rounded-lg space-y-4">
        <h2 className="text-2xl font-bold">Earn with USDC</h2>
        <p className="text-gray-400 text-sm mb-4">Deposit your USDC to earn yield.</p>
        <EarnDeposit />
      </section>

      <section className="bg-zinc-900 p-6 rounded-lg space-y-4">
        <h2 className="text-2xl font-bold">Smart Transaction</h2>
        <p className="text-gray-400 text-sm mb-4">Trigger custom onchain transactions via Paymaster.</p>
        <SmartTransaction />
      </section>
    </div>
  )
}
