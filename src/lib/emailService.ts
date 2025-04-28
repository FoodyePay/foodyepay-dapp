// ✅ src/lib/emailService.ts

'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

// Send verification code email
export async function sendVerificationCodeEmail(to: string, code: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.NEXT_PUBLIC_RESEND_SENDER_EMAIL!,
      to,
      subject: 'Your FoodyePay Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center;">
          <h2>FoodyePay Verification Code</h2>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 4px;">${code}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending verification email:', error);
    }
    return { data, error };
  } catch (error) {
    console.error('Unexpected error sending verification email:', error);
    throw error;
  }
}

// Send welcome email after successful registration
export async function sendWelcomeEmail(to: string, walletAddress: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.NEXT_PUBLIC_RESEND_SENDER_EMAIL!,
      to,
      subject: 'Welcome to FoodyePay!',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Welcome to FoodyePay!</h2>
          <p>Thank you for registering with us.</p>
          <p><strong>Your Wallet Address:</strong> ${walletAddress}</p>
          <br/>
          <p>You can now start using FoodyePay to enjoy seamless crypto payments!</p>
          <a href="https://foodyepay.com/login" style="background: #6366f1; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">Go to Dashboard</a>
          <br/><br/>
          <p>— FoodyePay Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
    }
    return { data, error };
  } catch (error) {
    console.error('Unexpected error sending welcome email:', error);
    throw error;
  }
}
