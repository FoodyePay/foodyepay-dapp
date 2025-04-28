//   /src/app/register/yes/page.tsx

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useSmartWallet } from '@/lib/useSmartWallet';
import { generateVerificationCode, saveVerificationCode, validateVerificationCode } from '@/lib/verificationCode';
import { sendVerificationCodeEmail, sendWelcomeEmail } from '@/lib/emailService';
import { registerDiner } from '@/utils/auth';
import { Wallet } from '@coinbase/onchainkit/wallet';
import { Avatar, Address } from '@coinbase/onchainkit/identity';
import { Copy } from 'lucide-react';
import SmartWalletGuard from '@/components/SmartWalletGuard';

export default function RegisterYesPage() {
  const router = useRouter();
  const { walletAddress } = useSmartWallet();
  const [loading, setLoading] = useState(true);
  const [dinerForm, setDinerForm] = useState({
    first_name: '',
    last_name: '',
    emailLocal: '',
    area: '',
    prefix: '',
    line: '',
  });

  const [verificationSent, setVerificationSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [codeSentAt, setCodeSentAt] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState(''); // ✅ 新增

  const areaRef = useRef<HTMLInputElement>(null);
  const prefixRef = useRef<HTMLInputElement>(null);
  const lineRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function checkRegistration() {
      if (!walletAddress) return;
      const { data } = await supabase
        .from('users')
        .select('role')
        .eq('wallet_address', walletAddress.toLowerCase())
        .single();
      if (data?.role) {
        router.push(`/dashboard-${data.role}`);
      } else {
        setLoading(false);
      }
    }
    checkRegistration();
  }, [walletAddress, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (codeSentAt && Date.now() - codeSentAt > 10 * 60 * 1000) {
      alert('❌ Code expired. Please request a new one.');
      setVerificationSent(false);
      setInputCode('');
      setCodeSentAt(null);
      setSuccessMessage('');
    }
  }, [inputCode, codeSentAt]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setDinerForm((prev) => ({ ...prev, [id]: value }));
  };

  async function handleSendVerification() {
    const { first_name, last_name, emailLocal, area, prefix, line } = dinerForm;
    if (!first_name || !last_name || !emailLocal || !area || !prefix || !line) {
      alert('❌ Please fill all fields.');
      return;
    }
    const email = `${emailLocal}@gmail.com`;
    const code = generateVerificationCode();
    saveVerificationCode(email, code);

    setSending(true);
    try {
      await sendVerificationCodeEmail(email, code);
      setVerificationSent(true);
      setCountdown(60);
      setCodeSentAt(Date.now());
      setSuccessMessage('✅ Verification code sent!');
    } catch (error) {
      console.error('Failed to send code:', error);
      alert('❌ Failed to send verification code.');
    } finally {
      setSending(false);
    }
  }

  async function handleSubmit() {
    setVerifying(true);
    const { first_name, last_name, emailLocal, area, prefix, line } = dinerForm;
    const email = `${emailLocal}@gmail.com`;
    const phone = `1-${area}-${prefix}-${line}`;

    const valid = validateVerificationCode(email, inputCode);
    if (!valid) {
      alert('❌ Invalid or expired code.');
      setVerifying(false);
      return;
    }

    try {
      await registerDiner({ walletAddress: walletAddress!, first_name, last_name, email, phone });
      await sendWelcomeEmail(email, walletAddress!);
      router.push('/dashboard-diner');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setVerifying(false);
    }
  }

  function handleCopy() {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setSuccessMessage('✅ Wallet address copied!');
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center space-y-4 animate-fade-in">
          <p className="text-sm text-gray-400">Checking Wallet...</p>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
  <SmartWalletGuard>
    <div className="min-h-screen flex items-center justify-center px-4 bg-black text-white">
      <div className="bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
        <div className="flex justify-center mb-2">
          <img src="/icon-512.png" alt="FoodyePay Logo" className="w-12 h-12" />
        </div>

        <h1 className="text-2xl font-bold text-center">Complete Your Registration</h1>

        {walletAddress && (
          <div className="flex items-center justify-center mb-4 gap-2">
            <span className="text-sm truncate max-w-[180px]">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
            <button onClick={handleCopy} className="p-1 rounded bg-zinc-700 hover:bg-zinc-600">
              <Copy className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        {successMessage && (
          <p className="text-green-400 text-center text-sm">{successMessage}</p>
        )}

        <div className="space-y-3">
          <input id="first_name" placeholder="First Name *" required value={dinerForm.first_name} onChange={handleChange} className="input-base w-full" />
          <input id="last_name" placeholder="Last Name *" required value={dinerForm.last_name} onChange={handleChange} className="input-base w-full" />

          <div className="flex w-full">
            <input id="emailLocal" placeholder="Gmail Only! (no @)" required value={dinerForm.emailLocal} onChange={handleChange} className="input-base rounded-r-none w-7/10" />
            <span className="input-base bg-zinc-700 rounded-l-none flex items-center justify-center w-3/10">@gmail.com *</span>
          </div>

          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <span className="font-bold">1</span>
              <span>+</span>
            </div>
            <input id="area" maxLength={3} ref={areaRef} value={dinerForm.area} onChange={(e) => { handleChange(e); if (e.target.value.length === 3) prefixRef.current?.focus(); }} className="input-base w-1/3" />
            <input id="prefix" maxLength={3} ref={prefixRef} value={dinerForm.prefix} onChange={(e) => { handleChange(e); if (e.target.value.length === 3) lineRef.current?.focus(); }} className="input-base w-1/3" />
            <input id="line" maxLength={4} ref={lineRef} value={dinerForm.line} onChange={handleChange} className="input-base w-1/3" />
          </div>

          {!verificationSent ? (
            <button
              type="button"
              onClick={handleSendVerification}
              className="btn-primary w-full bg-gradient-to-r from-purple-500 to-indigo-600"
              disabled={sending || countdown > 0}
            >
              {sending ? 'Sending...' : countdown > 0 ? `Resend Code (${countdown}s)` : 'Send Verification Code'}
            </button>
          ) : (
            <div className="space-y-3 animate-slide-down">
              <input type="text" placeholder="Enter Verification Code" value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="input-base w-full" />
              <button type="button" onClick={handleSubmit} className="btn-primary w-full bg-gradient-to-r from-green-500 to-emerald-600" disabled={verifying}>
                {verifying ? 'Verifying...' : 'Complete Registration'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
     </SmartWalletGuard>
  );
}

