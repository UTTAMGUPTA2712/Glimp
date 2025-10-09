import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function DownloadPage() {
  return (
    <>
      <Header />
      <main className="main-content bg-white">
        <section className="py-24 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Download the Glimp Desktop Toolbar
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Get the desktop application for seamless interview recording and AI assistance
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Windows</h3>
                <button className="btn btn-primary w-full">Download for Windows</button>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">macOS</h3>
                <button className="btn btn-primary w-full">Download for Mac</button>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Linux</h3>
                <button className="btn btn-primary w-full">Download for Linux</button>
              </div>
            </div>

            <div className="max-w-2xl mx-auto text-left">
              <h2 className="text-2xl font-bold mb-6">How to get started</h2>
              <ol className="list-decimal list-inside space-y-3">
                <li>Download the appropriate app for your platform above</li>
                <li>Sign in to your Glimp account on this website</li>
                <li>Follow the pairing instructions to connect the desktop app</li>
                <li>Start your AI-powered interview sessions!</li>
              </ol>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}