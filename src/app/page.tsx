//   /src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSmartWallet } from '@/lib/useSmartWallet';

export default function HomePage() {
  const router = useRouter();
  const { connectSmartWallet, createNewSmartWallet } = useSmartWallet();
  const [hasWallet, setHasWallet] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function handleFlow() {
      if (hasWallet === null) return;

      setLoading(true);

      if (hasWallet === true) {
        // ✅ 已有钱包流程
        const address = await connectSmartWallet();
        if (!address) {
          setLoading(false);
          alert('❌ Failed to connect existing Smart Wallet.');
          return;
        }
        router.push('/register/yes');
      } else {
        // ✅ 创建新钱包流程
        const address = await createNewSmartWallet();
        if (!address) {
          setLoading(false);
          alert('❌ Failed to create Smart Wallet.');
          return;
        }
        router.push('/register/no');
      }
    }

    handleFlow();
  }, [hasWallet, connectSmartWallet, createNewSmartWallet, router]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white animate-fade-in px-4">
      <p className="text-lg font-semibold text-gray-300 mb-3 tracking-wide">Welcome to</p>

      <img
        src="/icon-512.png"
        alt="FoodyePay Logo"
        className="w-32 h-32 mb-5 animate-pulse"
      />

      <h1 className="text-3xl font-extrabold tracking-[0.25em] text-white mb-10">FOODYEPAY</h1>

      {hasWallet === null && (
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-400">Do you have a Coinbase Smart Wallet?</p>
          <div className="flex gap-6 justify-center">
            <button
              onClick={() => setHasWallet(true)}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 transition"
            >
              Yes, I have
            </button>
            <button
              onClick={() => setHasWallet(false)}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 transition"
            >
              No, Create One
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="mt-8 flex items-center space-x-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400">Processing Wallet...</p>
        </div>
      )}
    </div>
  );
}
