import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DevicePairing from '@/components/DevicePairing'

export default function AppLaunchPage({
  searchParams,
}: {
  searchParams: { nonce?: string }
}) {
  return (
    <>
      <Header />
      <main className="main-content bg-white">
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Launch Desktop App
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Connect your desktop toolbar to start using Glimp AI
              </p>

              <DevicePairing nonce={searchParams.nonce} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}