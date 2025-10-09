import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supportQAs } from '@/lib/data'

export default function SupportPage() {
  return (
    <>
      <Header />
      <main className="main-content bg-white">
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                How can we help you?
              </h1>
              <p className="text-xl text-gray-600">
                Get answers to common questions or reach out for personalized support
              </p>
            </div>

            {/* Contact Form */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea 
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Describe your issue or question..."
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">Send Message</button>
                </form>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-bold text-center mb-8">Common Questions</h2>
              <div className="max-w-3xl mx-auto">
                <div className="space-y-6">
                  {supportQAs.map((qa, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6">
                      <h3 className="text-lg font-semibold mb-2">{qa.question}</h3>
                      <p className="text-gray-600">{qa.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}