// ✅ src/lib/orders.ts
import { supabase } from './supabase'

type CreateOrderParams = {
  order_number: string
  subtotal: number
  tax: number
  total_amount: number
  zip_code: string
  tax_rate: number
  foody_rate: number
  foody_amount: number
  restaurant_id: string
  diner_id: string
}

export async function createOrder(data: CreateOrderParams) {
  const { error } = await supabase.from('orders').insert({
    ...data,
    status: 'pending',
  })

  if (error) throw new Error(error.message)
}
