import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// This page handles OAuth callback and entitlement checks
export default function AppStartPage({
  searchParams,
}: {
  searchParams: { code?: string; state?: string; nonce?: string }
}) {
  return (
    <>
      <Header />
      <main className="main-content bg-white">
        <section className="py-24 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-md mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Setting up your account...
              </h1>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                Please wait while we verify your credentials and check your subscription status.
              </p>

              {/* Show nonce if available */}
              {searchParams.nonce && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
                  <p>Device pairing code: <code className="bg-white px-2 py-1 rounded">{searchParams.nonce}</code></p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}