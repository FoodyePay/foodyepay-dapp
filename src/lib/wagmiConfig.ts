// /src/lib/wagmiConfig.ts
'use client'
import { createConfig } from 'wagmi'
import { coinbaseWallet, injected } from 'wagmi/connectors'
import { baseSepolia } from 'wagmi/chains'
import { createPublicClient, http } from 'viem'

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'FoodyePay' }),
  ],
  client: createPublicClient({
    chain: baseSepolia,
    transport: http(),
  }),
  ssr: true,
})
