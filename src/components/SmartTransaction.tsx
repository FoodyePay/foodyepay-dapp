'use client'

import { Transaction } from '@coinbase/onchainkit/transaction'

export default function SmartTransaction() {
  const calls = [
    {
      to: '0x0000000000000000000000000000000000000000', // 👈 替换为你要交互的合约地址
      data: '0x', // 👈 替换为要发送的合约调用数据
    },
  ]

  return <Transaction calls={calls} />
}
