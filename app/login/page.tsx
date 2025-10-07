import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="main-content bg-gray-50">
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Sign in to Glimp AI
                </h1>
                <p className="text-gray-600">
                  Access your interview assistant dashboard
                </p>
              </div>
              <LoginForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}