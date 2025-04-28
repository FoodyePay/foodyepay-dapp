import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';


// src/lib/wallet.ts

// ✅ 获取 Smart Wallet 实例
export function getSmartWallet() {
  if (typeof window === 'undefined') return null
  return (window as any).smartWallet || null
}

// ✅ 获取钱包地址（可选，用于后续功能）
export async function getWalletAddress(): Promise<string | null> {
  if (typeof window === 'undefined') return null
  const wallet = (window as any).smartWallet
  return wallet?.address ?? null
}



