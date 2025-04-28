'use client'

import React, { useState } from 'react'
import QRCode from 'react-qr-code'
import { getFDCPerETH_V3 } from '@/lib/uniswap'
import { getSalesTaxRate } from '@/lib/tax'

export default function ScanPage() {
  const [orderId, setOrderId] = useState('')
  const [subtotal, setSubtotal] = useState('')
  const [zip, setZip] = useState('')
  const [taxRate, setTaxRate] = useState('')
  const [loadingZip, setLoadingZip] = useState(false)
  const [foodyRate, setFoodyRate] = useState<number | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState('')

  const subtotalNum = parseFloat(subtotal || '0')
  const taxPercent = parseFloat(taxRate || '0')
  const totalUSD = subtotalNum * (1 + taxPercent / 100)
  const totalFoody = foodyRate ? (totalUSD / foodyRate).toFixed(2) : '0.00'

  const handleZipLookup = async () => {
    if (!zip.match(/^\d{5}$/)) {
      alert('❌ Please enter a valid 5-digit ZIP code')
      return
    }

    setLoadingZip(true)
    const rate = await getSalesTaxRate(zip)
    setLoadingZip(false)

    if (!rate) {
      alert('⚠️ ZIP code not recognized. Please enter a valid U.S. ZIP.')
      return
    }

    setTaxRate((rate * 100).toFixed(2))
  }

  const handleGetRate = async () => {
    const rate = await getFDCPerETH_V3()
    setFoodyRate(rate)
  }

  const handleGenerate = () => {
    if (!orderId || totalFoody === '0.00') {
      alert('⚠️ Please fill in Order ID and fetch FOODY rate first.')
      return
    }

    const url = `${window.location.origin}/pay/${orderId}?amount=${totalFoody}`
    setQrCodeUrl(url)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-center">🧾 Generate Payment QR</h2>

        <input
          placeholder="Order Number"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="input-base"
        />

        <input
          placeholder="Subtotal ($)"
          value={subtotal}
          onChange={(e) => setSubtotal(e.target.value)}
          className="input-base"
        />

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="ZIP Code (e.g. 10001)"
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
            className="input-base w-2/3"
          />
          <button
            onClick={handleZipLookup}
            disabled={!zip || loadingZip}
            className="btn-primary w-1/3 text-sm"
          >
            {loadingZip ? 'Loading...' : '📍 Auto Tax'}
          </button>
        </div>

        <input
          placeholder="Tax Rate (%)"
          value={taxRate}
          readOnly
          className="input-base"
        />

        <div className="text-sm text-right mt-2">
          Total: <span className="font-bold text-green-400">${totalUSD.toFixed(2)}</span>{' '}
          — <span className="text-purple-400">{totalFoody} FOODY</span>
        </div>

        <button onClick={handleGetRate} className="btn-primary w-full">
          🔄 Get FOODY Exchange Rate
        </button>

        {qrCodeUrl && (
          <>
            <div className="bg-white p-4 rounded-xl w-fit mx-auto mt-4">
              <QRCode value={qrCodeUrl} size={160} />
            </div>

            <div className="text-center mt-2">
              <button
                onClick={() => navigator.clipboard.writeText(qrCodeUrl)}
                className="btn-primary mt-3 text-sm"
              >
                📋 Copy Link
              </button>
            </div>
          </>
        )}

        <button
          onClick={handleGenerate}
          className="btn-primary w-full"
        >
          ⚡ Generate QR Code
        </button>
      </div>
    </div>
  )
}

