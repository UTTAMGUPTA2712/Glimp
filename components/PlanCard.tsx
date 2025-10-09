'use client'

import { useEffect, useState } from 'react'
import { getSession } from '@/lib/auth'

type EntitlementResponse = {
  entitled: boolean
  plan: string | null
  status: 'active' | 'inactive' | 'trialing' | 'cancelled' | 'deleted' | null
  current_period_end: string | null
}

export default function PlanCard() {
  const [data, setData] = useState<EntitlementResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [account, setAccount] = useState<{ name: string | null; email: string | null; userId: string | null }>({ name: null, email: null, userId: null })

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setIsLoading(true)
        setError(null)
        const session = await getSession()
        const accessToken = session?.access_token
        const user = session?.user
        setAccount({
          name: (user?.user_metadata as any)?.full_name || (user?.user_metadata as any)?.name || null,
          email: user?.email || null,
          userId: user?.id || null
        })
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Unexpected error')
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="h-4 bg-gray-100 rounded w-2/3" />
          <div className="h-4 bg-gray-100 rounded w-1/4" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-2">Subscription</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <a href="/login" className="btn btn-primary">Login</a>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        <div className="space-y-3 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="text-gray-900">{account.name || '—'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900">{account.email || '—'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">User ID</label>
            <p className="text-gray-900 break-all">{account.userId || '—'}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Enrolled Plan</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">Plan</label>
            <p className="text-gray-900 capitalize">{data?.plan || 'No active plan'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              data?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {data?.status || 'inactive'}
            </span>
          </div>
          {data?.current_period_end && (
            <div>
              <label className="text-sm font-medium text-gray-500">Next Renewal</label>
              <p className="text-gray-900">{data.current_period_end}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-500">Entitled</label>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              data?.entitled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {data?.entitled ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Billing</h2>
        <div className="space-y-4">
          {data?.status !== 'active' ? (
            <a href="/pricing" className="w-full btn btn-primary">Choose a Plan</a>
          ) : (
            <div className="text-sm text-gray-600">
              <p>Your subscription is active. Manage changes from your account.</p>
            </div>
          )}
          <div className="text-sm text-gray-600">
            <p>Need help? <a href="/support" className="text-primary-600 hover:underline">Contact Support</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}


