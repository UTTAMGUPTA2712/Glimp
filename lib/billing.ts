// Mock billing library (simulating Razorpay)

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'monthly' | 'yearly'
}

export const PLANS: SubscriptionPlan[] = [
  {
    id: 'pro-monthly',
    name: 'Pro',
    price: 1599,
    currency: 'INR',
    interval: 'monthly'
  }
]

export async function createCheckoutSession(planId: string, nonce?: string) {
  // In real implementation, this would call Razorpay API
  const response = await fetch('/api/billing', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ planId, nonce }),
  })

  if (!response.ok) {
    throw new Error('Failed to create checkout session')
  }

  return response.json()
}

export async function cancelSubscription() {
  // In real implementation, this would call Razorpay API
  const response = await fetch('/api/billing/cancel', {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Failed to cancel subscription')
  }

  return response.json()
}

export function openRazorpayCheckout(subscriptionId: string, onSuccess?: () => void) {
  // Mock Razorpay checkout
  console.log('Opening Razorpay checkout for subscription:', subscriptionId)

  // Simulate payment success after 2 seconds
  setTimeout(() => {
    if (onSuccess) onSuccess()
  }, 2000)
}