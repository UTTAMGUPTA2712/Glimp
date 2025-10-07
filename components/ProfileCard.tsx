'use client'

import { useState } from 'react'
import { mockUsers } from '@/lib/data'

export default function ProfileCard() {
  // Mock current user (in real app, this would come from auth context)
  const [currentUser] = useState(mockUsers[0]) // Use active user for demo
  const [isLoading, setIsLoading] = useState(false)

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      alert('Subscription cancelled successfully')
      setIsLoading(false)
    }, 1000)
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      alert('Account deletion initiated')
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Account Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900">{currentUser.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Plan</label>
            <p className="text-gray-900 capitalize">{currentUser.plan || 'No active plan'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              currentUser.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {currentUser.status}
            </span>
          </div>
          {currentUser.current_period_end && (
            <div>
              <label className="text-sm font-medium text-gray-500">Next Renewal</label>
              <p className="text-gray-900">{currentUser.current_period_end}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-500">Entitled</label>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              currentUser.entitled 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {currentUser.entitled ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      {/* Billing & Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Billing & Account Actions</h2>
        <div className="space-y-4">
          {currentUser.status === 'active' && (
            <button
              onClick={handleCancelSubscription}
              disabled={isLoading}
              className="w-full btn btn-outline"
            >
              {isLoading ? 'Processing...' : 'Cancel Subscription'}
            </button>
          )}

          <button
            onClick={handleDeleteAccount}
            disabled={isLoading}
            className="w-full btn btn-danger"
          >
            {isLoading ? 'Processing...' : 'Delete Account'}
          </button>

          <div className="text-sm text-gray-600">
            <p>Need help? <a href="/support" className="text-primary-600 hover:underline">Contact Support</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}