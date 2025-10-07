import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AppReadyPage() {
  return (
    <>
      <Header />
      <main className="main-content bg-white">
        <section className="py-24 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  You're all set!
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Your desktop app is now connected and ready to assist with your interviews.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 text-left">
                <h2 className="text-lg font-semibold mb-4">Next steps:</h2>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Open the Glimp desktop app on your computer
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Start preparing for your next interview
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Get AI-powered insights and feedback
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <a href="/profile" className="btn btn-primary mr-4">
                  View Profile
                </a>
                <a href="/support" className="btn btn-outline">
                  Get Support
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}