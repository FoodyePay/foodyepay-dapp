'use client'

import { Buy } from '@coinbase/onchainkit/buy'
import { Token } from '@coinbase/onchainkit/token'

export default function BuyToken() {
  const usdcToken: Token = {
    name: 'USDC',
    address: '0x335B9fCD6eDb6E08f4c7C32D4f71b54bdA02913c', // USDC on Base Sepolia
    symbol: 'USDC',
    decimals: 6,
    chainId: 8453,
    image: '',
  }

  return <Buy toToken={usdcToken} />
}
