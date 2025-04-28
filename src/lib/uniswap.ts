// src/lib/uniswap.ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import type { Abi } from 'viem'

// ✅ 建立 Viem 公共客户端（不要用 @wagmi/core 的 readContract 了）
const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export const UNISWAP_V3_POOL_ADDRESS = '0xe44d78d399516D247B25D6a0439f41d747f0E219'

export const UNISWAP_V3_POOL_ABI: Abi = [
  {
    type: 'function',
    name: 'slot0',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'sqrtPriceX96', type: 'uint160' },
      { name: '', type: 'int24' },
      { name: '', type: 'uint16' },
      { name: '', type: 'uint16' },
      { name: '', type: 'uint16' },
      { name: '', type: 'uint128' },
      { name: '', type: 'bool' },
    ],
  },
]

// ✅ 实时汇率函数：ETH ➝ FDC
export async function getFDCPerETH_V3(): Promise<number> {
  const slot0 = await client.readContract({
    address: UNISWAP_V3_POOL_ADDRESS,
    abi: UNISWAP_V3_POOL_ABI,
    functionName: 'slot0',
  })

  const sqrtPriceX96 = slot0[0] as bigint

  const sqrtPrice = Number(sqrtPriceX96) / 2 ** 96
  const price = sqrtPrice ** 2

  return price // ETH ➝ FDC
}
