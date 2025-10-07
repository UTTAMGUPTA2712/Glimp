'use client'

import { useState, useEffect } from 'react'

interface DevicePairingProps {
  nonce?: string
}

export default function DevicePairing({ nonce }: DevicePairingProps) {
  const [status, setStatus] = useState<'connecting' | 'ready' | 'error'>('connecting')
  const [showManualInstructions, setShowManualInstructions] = useState(false)

  useEffect(() => {
    // Simulate device pairing process
    const timer = setTimeout(() => {
      // Try to open deep link
      try {
        if (nonce) {
          window.location.href = `glimp://ready?nonce=${nonce}`
        }
        setStatus('ready')
      } catch (error) {
        setStatus('error')
        setShowManualInstructions(true)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [nonce])

  const handleManualLaunch = () => {
    if (nonce) {
      // Try deep link again
      window.location.href = `glimp://ready?nonce=${nonce}`
    }
    // Show instructions after a delay
    setTimeout(() => setShowManualInstructions(true), 1000)
  }

  const handleDownload = () => {
    window.location.href = '/download'
  }

  const handleContinue = () => {
    window.location.href = '/app/ready'
  }

  return (
    <div className="max-w-md mx-auto">
      {status === 'connecting' && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to your desktop app...</p>
          {nonce && (
            <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
              <p>Pairing code: <code className="bg-white px-2 py-1 rounded">{nonce}</code></p>
            </div>
          )}
        </div>
      )}

      {status === 'ready' && (
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Desktop app launched!</h3>
          <p className="text-gray-600 mb-6">Your desktop application should now be open and connected.</p>

          <div className="space-y-3">
            <button onClick={handleContinue} className="w-full btn btn-primary">
              Continue
            </button>
            <button onClick={handleManualLaunch} className="w-full btn btn-outline">
              Launch Manually
            </button>
          </div>
        </div>
      )}

      {status === 'error' || showManualInstructions ? (
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Manual Launch Required</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-semibold mb-2">If the app doesn't open automatically:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Make sure you have the Glimp desktop app installed</li>
              <li>Open the app manually from your applications folder</li>
              <li>The app should automatically connect to your account</li>
            </ol>
          </div>

          <div className="space-y-3">
            <button onClick={handleManualLaunch} className="w-full btn btn-primary">
              Try Launch Again
            </button>
            <button onClick={handleDownload} className="w-full btn btn-outline">
              Download Desktop App
            </button>
            <button onClick={handleContinue} className="w-full btn btn-outline">
              Continue Anyway
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}