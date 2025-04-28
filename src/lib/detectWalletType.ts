// /src/lib/detectWalletType.ts

'use server';

import { publicClient } from '@/lib/viemClient'; // 你的 Viem RPC Client（已经有了）

export async function detectWalletType(address: `0x${string}`) {
  const code = await publicClient.getBytecode({ address });
  if (!code) {
    return 'EOA'; // 普通 Externally Owned Account
  } else {
    return 'Smart Wallet'; // 有合约字节码，是智能钱包
  }
}
