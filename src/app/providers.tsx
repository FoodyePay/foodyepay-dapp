'use client'

import { WagmiConfig, createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// ✅ 创建 Query Client
const queryClient = new QueryClient()

const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [coinbaseWallet({ appName: 'FoodyePay' })],
  transports: { [baseSepolia.id]: http() },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        {children}
      </WagmiConfig>
    </QueryClientProvider>
  )
}


