//   /src/app/register/no/success/page.tsx


'use client';

import { useRouter } from 'next/navigation';

export default function RegisterNoSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black text-white">
      <div className="bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-md space-y-6 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <img src="/icon-512.png" alt="FoodyePay Logo" className="w-12 h-12" />
        </div>

        <h1 className="text-2xl font-bold">🎉 Registration Successful!</h1>

        <p className="text-gray-400 mt-2">
          Welcome to <span className="font-semibold text-white">FoodyePay</span>! <br />
          Your new smart wallet has been created and your account is ready.
        </p>

        <button
          onClick={() => router.push('/login')}
          className="btn-primary w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 transition mt-6"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

