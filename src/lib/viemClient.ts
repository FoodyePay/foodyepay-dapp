// /src/lib/viemClient.ts



import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: base,
  transport: http('https://base.publicnode.com'), // 可以换成你的专属 Base RPC 地址
});
