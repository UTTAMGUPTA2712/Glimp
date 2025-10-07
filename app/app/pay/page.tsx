import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PaymentForm from '@/components/PaymentForm'

export default function AppPayPage({
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
                Upgrade to Pro
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Unlock the full power of AI interview assistance
              </p>

              <PaymentForm nonce={searchParams.nonce} />

              <div className="mt-8 text-sm text-gray-500">
                <p>Secure payment powered by Razorpay</p>
                <p>Cancel anytime from your profile settings</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}