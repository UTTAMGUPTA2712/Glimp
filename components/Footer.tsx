import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Glimp AI</h3>
            <p className="text-gray-400 mb-4">
              AI-powered interview assistant helping you land your dream job.
            </p>
            <p className="text-gray-400 text-sm">
            contact@goglimp.com
            </p>
          </div>
          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/download" className="hover:text-white">Download</Link></li>
              <li><Link href="/support" className="hover:text-white">Support</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/legal#privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/legal#terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/support" className="hover:text-white">Help Center</Link></li>
              <li><a href="mailto:contact@goglimp.com" className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Glimp AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}