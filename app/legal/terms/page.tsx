import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="main-content bg-white">
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Terms of Service
            </h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

              <h2>Acceptance of Terms</h2>
              <p>By accessing and using the Glimp AI service, you accept and agree to be bound by the terms and provision of this agreement.</p>

              <h2>Service Description</h2>
              <p>Glimp AI is an interview assistance platform that provides AI-powered preparation, recording, and analysis tools.</p>

              <h2>User Accounts</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>

              <h2>Subscription Terms</h2>
              <p>Our service is offered on a subscription basis. Fees are charged in advance on a monthly basis and are non-refundable except as required by law.</p>

              <h2>Prohibited Uses</h2>
              <p>You may not use our service for any illegal or unauthorized purpose or in a manner that could damage or impair the service.</p>

              <h2>Contact Information</h2>
              <p>Questions about the Terms of Service should be sent to us at legal@glimp.ai</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}