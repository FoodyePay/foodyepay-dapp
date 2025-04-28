'use client'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ✅ 创建 Query Client
const queryClient = new QueryClient()

// ✅ 创建 wagmi 配置
const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'FoodyePay',
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
})

// ✅ 这里注意，一定是 default export！
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        {children}
      </WagmiProvider>
    </QueryClientProvider>
  )
}




