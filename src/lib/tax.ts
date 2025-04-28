// ✅ /lib/tax.ts
export async function getSalesTaxRate(zip: string): Promise<number> {
    try {
      const res = await fetch('/api/tax', {
        method: 'POST',
        body: JSON.stringify({ zip }),
        headers: { 'Content-Type': 'application/json' },
      })
  
      if (!res.ok) {
        throw new Error(`Tax API Error (${res.status})`)
      }
  
      const data = await res.json()
      return data?.rate || 0
    } catch (err) {
      console.error('Failed to fetch tax rate:', err)
      return 0
    }
  }
  