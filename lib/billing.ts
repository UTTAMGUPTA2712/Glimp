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

export function openRazorpayCheckout(subscriptionId: string, onSuccess?: () => void) {
  // Mock Razorpay checkout
  console.log('Opening Razorpay checkout for subscription:', subscriptionId)

  // Simulate payment success after 2 seconds
  setTimeout(() => {
    if (onSuccess) onSuccess()
  }, 2000)
}