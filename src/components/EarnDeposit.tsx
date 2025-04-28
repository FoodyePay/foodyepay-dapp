'use client'

import { Earn } from '@coinbase/onchainkit/earn'

export default function EarnDeposit() {
  const vaultAddress = '0x7BfA7C4f149E7415b73bdeD9e60923f7bc22995b' // Spark USDC Vault Example

  return <Earn vaultAddress={vaultAddress} />
}
