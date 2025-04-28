//  /src/lib/useSmartWallet.ts

'use client';

import { useEffect, useState } from 'react';
import { createWalletClient, custom } from 'viem';
import { baseSepolia } from 'viem/chains';

export function useSmartWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('foodye_wallet');
    if (stored) {
      setWalletAddress(stored);
    }
  }, []);

  async function connectSmartWallet() {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Wallet not available.');
      return null;
    }

    const walletClient = createWalletClient({
      chain: baseSepolia,
      transport: custom(window.ethereum),
    });

    const [address] = await walletClient.requestAddresses();
    if (address) {
      localStorage.setItem('foodye_wallet', address);
      setWalletAddress(address);
    }
    return address;
  }

  async function createNewSmartWallet() {
    // ✅ 简化处理：直接调用 connectSmartWallet 创建新钱包
    return await connectSmartWallet();
  }

  return { walletAddress, connectSmartWallet, createNewSmartWallet };
}




