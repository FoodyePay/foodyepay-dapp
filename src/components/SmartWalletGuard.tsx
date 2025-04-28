// /src/components/SmartWalletGuard.tsx


'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSmartWallet } from '@/lib/useSmartWallet';
import { detectWalletType } from '@/lib/detectWalletType';

type SmartWalletGuardProps = {
  children: React.ReactNode;
};

export default function SmartWalletGuard({ children }: SmartWalletGuardProps) {
  const router = useRouter();
  const { walletAddress } = useSmartWallet();
  const [checking, setChecking] = useState(true);
  const [isSmartWallet, setIsSmartWallet] = useState<boolean | null>(null);

  useEffect(() => {
    async function verifyWallet() {
      if (!walletAddress) return;
      const type = await detectWalletType(walletAddress);
      if (type !== 'Smart Wallet') {
        setIsSmartWallet(false);
      } else {
        setIsSmartWallet(true);
      }
      setChecking(false);
    }

    verifyWallet();
  }, [walletAddress]);

  if (checking) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white px-4 animate-fade-in">
        <div className="text-center space-y-3">
          <img src="/icon-512.png" alt="FoodyePay Logo" className="w-14 h-14 mx-auto" />
          <p className="text-sm text-gray-400">Checking Wallet Type...</p>
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isSmartWallet === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 animate-slide-down space-y-6">
        <img src="/icon-512.png" alt="FoodyePay Logo" className="w-14 h-14" />
        <h1 className="text-2xl font-bold">❌ Unsupported Wallet</h1>
        <p className="text-gray-400 text-center">Only Coinbase Smart Wallets are supported for registration.</p>
        <button
          onClick={() => router.push('/')}
          className="btn-primary w-full max-w-xs bg-gradient-to-r from-purple-500 to-indigo-600"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
