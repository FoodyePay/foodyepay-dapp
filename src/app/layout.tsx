import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'

// Default import for Providers
import Providers from './providers'

export const metadata: Metadata = {
  title: 'FoodyePay DApp',
  description: 'The Web3 Dining Experience',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-dark text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}














