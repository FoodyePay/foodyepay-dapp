'use client'

import { FundCard } from '@coinbase/onchainkit/fund'

export default function FundWallet() {
  return (
    <FundCard
      assetSymbol="ETH"
      country="US"
      currency="USD"
      presetAmountInputs={['10', '20', '100']}
    />
  )
}
