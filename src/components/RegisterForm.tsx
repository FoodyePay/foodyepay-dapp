'use client';

import { useState, useEffect } from 'react';
import { generateVerificationCode, saveVerificationCode, validateVerificationCode } from '@/lib/verificationCode';
import { sendVerificationCodeEmail, sendWelcomeEmail } from '@/lib/emailService';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');

  const [verificationSent, setVerificationSent] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [codeSentAt, setCodeSentAt] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (codeSentAt && Date.now() - codeSentAt > 10 * 60 * 1000) {
      alert('❌ Verification code expired. Please request a new code.');
      setVerificationSent(false);
      setInputCode('');
      setCodeSentAt(null);
    }
  }, [inputCode, codeSentAt]);

  async function handleSendVerification() {
    if (!email || !phone || !walletAddress || !firstName) {
      alert('❌ Please fill all required fields.');
      return;
    }

    const code = generateVerificationCode();
    saveVerificationCode(email, code);

    setSending(true);
    await sendVerificationCodeEmail(email, code);
    setSending(false);

    setVerificationSent(true);
    setCountdown(60); // 60秒倒计时
    setCodeSentAt(Date.now());

    alert('✅ Verification code sent to your email.');
  }

  async function handleSubmit() {
    setVerifying(true);

    const valid = validateVerificationCode(email, inputCode);

    if (!valid) {
      alert('❌ Invalid or expired verification code.');
      setVerifying(false);
      return;
    }

    // Insert into Supabase
    const { data, error } = await supabase.from('diners').insert([
      {
        email,
        phone,
        wallet: walletAddress,
        first_name: firstName,
      },
    ]);

    if (error) {
      console.error('Registration error:', error);
      alert('❌ Registration failed.');
      setVerifying(false);
      return;
    }

    await sendWelcomeEmail(email, walletAddress);

    alert('🎉 Registration successful!');
    router.push('/dashboard-diner');
  }

  return (
    <div className="flex flex-col gap-6 p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

      <input
        type="text"
        placeholder="First Name *"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="px-4 py-3 rounded-xl border bg-gray-800 text-white"
        required
      />

      <input
        type="email"
        placeholder="Email (Gmail Only) *"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-3 rounded-xl border bg-gray-800 text-white"
        required
      />

      <input
        type="text"
        placeholder="Phone (e.g., 1-123-456-7890) *"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="px-4 py-3 rounded-xl border bg-gray-800 text-white"
        required
      />

      <input
        type="text"
        placeholder="Wallet Address *"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        className="px-4 py-3 rounded-xl border bg-gray-800 text-white"
        required
      />

      {!verificationSent ? (
        <button
          onClick={handleSendVerification}
          disabled={sending || countdown > 0}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
        >
          {sending ? 'Sending...' : countdown > 0 ? `Resend Code (${countdown}s)` : 'Send Verification Code'}
        </button>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter Verification Code"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="px-4 py-3 rounded-xl border bg-gray-800 text-white"
            required
          />

          <button
            onClick={handleSubmit}
            disabled={verifying}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50"
          >
            {verifying ? 'Verifying...' : 'Register'}
          </button>
        </>
      )}
    </div>
  );
}

