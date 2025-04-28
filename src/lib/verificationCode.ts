// ✅ src/lib/verificationCode.ts

/**
 * Generate a 6-digit random verification code
 */
export function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  /**
   * Save the verification code temporarily to localStorage
   */
  export function saveVerificationCode(email: string, code: string) {
    const payload = {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes expiry
    };
    localStorage.setItem(`verificationCode_${email}`, JSON.stringify(payload));
  }
  
  /**
   * Validate the verification code
   */
  export function validateVerificationCode(email: string, inputCode: string): boolean {
    const data = localStorage.getItem(`verificationCode_${email}`);
    if (!data) return false;
  
    try {
      const payload = JSON.parse(data) as { code: string; expiresAt: number };
      const now = Date.now();
  
      if (now > payload.expiresAt) {
        localStorage.removeItem(`verificationCode_${email}`);
        return false;
      }
  
      if (payload.code !== inputCode) {
        return false;
      }
  
      localStorage.removeItem(`verificationCode_${email}`);
      return true;
    } catch (error) {
      console.error('Failed to parse verification code:', error);
      return false;
    }
  }
  
  /**
   * Clear verification code manually (optional)
   */
  export function clearVerificationCode(email: string) {
    localStorage.removeItem(`verificationCode_${email}`);
  }
  