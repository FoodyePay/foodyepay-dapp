// ✅ /api/tax/route.ts
import { NextRequest } from 'next/server'

const TAXJAR_API_KEY = '382992c0024d842a254af58847f2ba44' // ✅ 建议换成 process.env.TAXJAR_API_KEY

export async function POST(req: NextRequest) {
  const { zip } = await req.json()

  try {
    const res = await fetch(`https://api.taxjar.com/v2/rates/${zip}`, {
      headers: {
        Authorization: `Token token=${TAXJAR_API_KEY}`,
      },
    })

    if (!res.ok) {
      return new Response('Invalid ZIP code or request rejected', { status: res.status })
    }

    const data = await res.json()
    const rate = parseFloat(data?.rate?.combined_rate || '0')

    return Response.json({ rate })
  } catch (err) {
    console.error('[TaxJar Error]', err)
    return new Response('Failed to fetch tax rate', { status: 500 })
  }
}
