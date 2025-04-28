// ✅ /src/app/register/no/page.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSmartWallet } from '@/lib/useSmartWallet';
import { generateVerificationCode, saveVerificationCode, validateVerificationCode } from '@/lib/verificationCode';
import { sendVerificationCodeEmail, sendWelcomeEmail } from '@/lib/emailService';
import { supabase } from '@/lib/supabase';

export default function RegisterNoPage() {
  const router = useRouter();
  const { walletAddress } = useSmartWallet();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailLocal, setEmailLocal] = useState('');
  const [area, setArea] = useState('');
  const [prefix, setPrefix] = useState('');
  const [line, setLine] = useState('');

  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [codeSentAt, setCodeSentAt] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState(''); // ✅ 新增

  const areaRef = useRef<HTMLInputElement>(null);
  const prefixRef = useRef<HTMLInputElement>(null);
  const lineRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (codeSentAt && Date.now() - codeSentAt > 10 * 60 * 1000) {
      alert('❌ Verification code expired. Please request a new code.');
      setVerificationSent(false);
      setInputCode('');
      setCodeSentAt(null);
      setSuccessMessage('');
    }
  }, [inputCode, codeSentAt]);

  async function handleSendVerification() {
    if (!firstName || !lastName || !emailLocal || !area || !prefix || !line) {
      alert('❌ Please fill all required fields.');
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
    if (!walletAddress) {
      alert('❌ Wallet not ready.');
      return;
    }

    setVerifying(true);

    const email = `${emailLocal}@gmail.com`;
    const phone = `1-${area}-${prefix}-${line}`;

    const valid = validateVerificationCode(email, inputCode);
    if (!valid) {
      alert('❌ Invalid or expired verification code.');
      setVerifying(false);
      return;
    }

    try {
      await supabase.from('diners').insert([
        {
          wallet: walletAddress,
          email,
          phone,
          first_name: firstName,
          last_name: lastName,
        },
      ]);

      await sendWelcomeEmail(email, walletAddress);

      router.push('/register/no/success');
    } catch (error) {
      console.error('Registration failed', error);
      alert('Registration failed.');
    } finally {
      setVerifying(false);
    }
  }

  if (!walletAddress) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-black">
        <p>Preparing New Wallet...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black text-white">
      <div className="bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
        <div className="flex justify-center mb-2">
          <img src="/icon-512.png" alt="FoodyePay Logo" className="w-12 h-12" />
        </div>

        <h1 className="text-2xl font-bold text-center">New Wallet Registration</h1>

        {successMessage && (
          <p className="text-green-400 text-center text-sm">{successMessage}</p>
        )}

        <div className="space-y-3">
          <input
            placeholder="First Name *"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="input-base w-full"
          />
          <input
            placeholder="Last Name *"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="input-base w-full"
          />

          <div className="flex w-full">
            <input
              placeholder="Gmail Only! (no @)"
              required
              value={emailLocal}
              onChange={(e) => setEmailLocal(e.target.value)}
              className="input-base rounded-r-none w-7/10"
            />
            <span className="input-base bg-zinc-700 rounded-l-none flex items-center justify-center w-3/10">@gmail.com *</span>
          </div>

          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <span className="font-bold">1</span>
              <span>+</span>
            </div>
            <input
              maxLength={3}
              ref={areaRef}
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                if (e.target.value.length === 3) prefixRef.current?.focus();
              }}
              className="input-base w-1/3"
            />
            <input
              maxLength={3}
              ref={prefixRef}
              value={prefix}
              onChange={(e) => {
                setPrefix(e.target.value);
                if (e.target.value.length === 3) lineRef.current?.focus();
              }}
              className="input-base w-1/3"
            />
            <input
              maxLength={4}
              ref={lineRef}
              value={line}
              onChange={(e) => setLine(e.target.value)}
              className="input-base w-1/3"
            />
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
              <input
                placeholder="Enter Verification Code"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="input-base w-full"
              />

              <button
                type="button"
                onClick={handleSubmit}
                className="btn-primary w-full bg-gradient-to-r from-green-500 to-emerald-600"
                disabled={verifying}
              >
                {verifying ? 'Verifying...' : 'Complete Registration'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


