'use client'

import { useState } from 'react'

interface PaymentFormProps {
  nonce?: string
}

export default function PaymentForm({ nonce }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    setIsLoading(true)

    // Simulate Razorpay checkout
    setTimeout(() => {
      // Simulate successful payment
      const redirectUrl = nonce ? `/app/launch?nonce=${nonce}` : '/app/launch'
      window.location.href = redirectUrl
    }, 2000)
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Pricing Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Pro Plan</h3>
        <div className="flex justify-between items-center mb-2">
          <span>Monthly subscription</span>
          <span>₹1,599</span>
        </div>
        <div className="flex justify-between items-center font-semibold">
          <span>Total</span>
          <span>₹1,599/month</span>
        </div>
      </div>

      {/* Features included */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">What you get:</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center">
            <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            AI Interview Assistant
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Real-time Capture & Recording
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Smart Summarization
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Unlimited Sessions
          </li>
        </ul>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full btn btn-primary btn-lg"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          'Subscribe Now - ₹1,599/month'
        )}
      </button>
    </div>
  )
}