import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function LegalPage() {
  return (
    <>
      <Header />
      <main className="main-content bg-white">
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            {/* Terms & Conditions */}
            <div className="mb-16">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  🧾 Terms & Conditions
                </h1>
                <div className="text-sm text-gray-600 mb-6">
                  <p><strong>Last Updated:</strong> November 2, 2025</p>
                  <p><strong>Effective Date:</strong> November 2, 2025</p>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="mb-6">
                  Welcome to <strong>Glimp</strong>, an AI-powered Interview Copilot developed and owned by <strong>JDB Infotech Pvt. Ltd.</strong>, Meerut, Uttar Pradesh ("Company," "we," "our," or "us").
                  By using Glimp (the "App," "Software," or "Service") via <a href="https://goglimp.com" className="text-primary-600 hover:underline">https://goglimp.com</a>, you agree to the following terms.
                </p>

                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Use of Service</h2>
                    <p className="mb-4">
                      Glimp is a desktop software designed to assist users in interview preparation using AI technology.
                      By accessing or using Glimp, you:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>Must be at least 16 years old or have parental consent.</li>
                      <li>Agree not to use the app for any unlawful or unethical purpose.</li>
                      <li>Understand that the tool provides AI-generated suggestions and is not a substitute for personal judgment.</li>
                      <li>Agree that one subscription is <strong>limited to a single device</strong> per user.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Accounts and Authentication</h2>
                    <p className="mb-2">
                      You must log in using <strong>Google OAuth 2.0</strong> through <strong>Supabase</strong>.
                    </p>
                    <p className="mb-2">
                      You are responsible for maintaining the confidentiality of your account.
                    </p>
                    <p>
                      Unauthorized sharing of login credentials or using the same account on multiple devices may result in suspension.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Subscriptions & Payments</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>Payments are securely processed through <strong>Razorpay</strong>.</li>
                      <li>The <strong>Pro Plan</strong> is billed at ₹2400 to ₹2499 per month (inclusive of applicable taxes).</li>
                      <li>Subscriptions renew automatically unless canceled before the next billing date.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. No Refund Policy</h2>
                    <p className="mb-2">
                      All purchases are <strong>non-refundable</strong> once the payment is successfully processed.
                    </p>
                    <p>
                      If you face billing or technical issues, contact <a href="mailto:support@goglimp.com" className="text-primary-600 hover:underline">support@goglimp.com</a> or submit a ticket via <a href="https://goglimp.com/support" className="text-primary-600 hover:underline">https://goglimp.com/support</a>.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Third-Party Services</h2>
                    <p className="mb-4">
                      Glimp integrates with external APIs, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li><strong>OpenAI API</strong> (for AI processing and response generation)</li>
                      <li><strong>Supabase</strong> (for authentication and data management)</li>
                      <li><strong>Razorpay</strong> (for billing)</li>
                    </ul>
                    <p className="mt-4">
                      Your data may be processed by these third-party providers under their respective privacy policies.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data and Privacy</h2>
                    <p className="mb-2">
                      We do not store or retain user conversations or interview data locally or on our servers.
                    </p>
                    <p>
                      Only limited API logs may exist on the OpenAI platform for security and quality purposes.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
                    <p className="mb-2">
                      Glimp is an AI-assisted platform. We do not guarantee the accuracy, completeness, or suitability of AI outputs.
                    </p>
                    <p>
                      You agree that the company will not be liable for any loss, damage, or consequence arising from reliance on AI responses.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
                    <p className="mb-2">
                      All rights, trademarks, and materials associated with Glimp are owned by <strong>JDB Infotech Pvt. Ltd.</strong>
                    </p>
                    <p>
                      You may not copy, modify, or distribute any part of the Service without written permission.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Termination</h2>
                    <p>
                      We reserve the right to suspend or terminate accounts for violation of these terms or abuse of the Service.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Governing Law</h2>
                    <p className="mb-2">
                      These Terms are governed by applicable <strong>global laws and regulations</strong>.
                    </p>
                    <p>
                      In case of disputes, parties agree to first attempt informal resolution before legal proceedings.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Policy */}
            <div className="mb-16 border-t border-gray-200 pt-16">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  🔒 Privacy Policy
                </h1>
                <div className="text-sm text-gray-600 mb-6">
                  <p><strong>Last Updated:</strong> November 2, 2025</p>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="mb-6">
                  At <strong>JDB Infotech Pvt. Ltd.</strong>, your privacy is important to us. This Privacy Policy explains how we handle your information when you use <strong>Glimp</strong>.
                </p>

                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li><strong>Account Information:</strong> When you sign in using Google OAuth, we receive your name, email, and profile ID.</li>
                      <li><strong>Usage Information:</strong> We may collect anonymized data about how you use Glimp (e.g., feature usage, errors).</li>
                      <li><strong>Payment Information:</strong> Processed securely via <strong>Razorpay</strong>. We do not store credit/debit card details.</li>
                      <li><strong>AI Logs:</strong> API request logs are handled by <strong>OpenAI</strong>, not stored on our servers.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>To authenticate users and manage subscriptions.</li>
                      <li>To process payments and provide access to premium features.</li>
                      <li>To improve Glimp's performance and user experience.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Third-Party Processors</h2>
                    <p className="mb-4">
                      We use the following providers:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li><strong>Supabase</strong> for authentication and database services</li>
                      <li><strong>Razorpay</strong> for payments</li>
                      <li><strong>OpenAI</strong> for AI-based response generation</li>
                    </ul>
                    <p className="mt-4">
                      Each provider handles data under its own Privacy Policy and global compliance frameworks (GDPR, SOC-2, etc.).
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Retention</h2>
                    <p className="mb-2">
                      We do not retain personal data beyond your active subscription period.
                    </p>
                    <p>
                      API logs remain only within OpenAI's secured environment as per their retention policy.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Security</h2>
                    <p className="mb-2">
                      We implement encryption and secure access protocols to protect your data.
                    </p>
                    <p>
                      However, no system is entirely immune from risks; you use Glimp at your own discretion.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
                    <p className="mb-4">You may:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>Request deletion of your account by contacting <a href="mailto:support@goglimp.com" className="text-primary-600 hover:underline">support@goglimp.com</a></li>
                      <li>Revoke Google OAuth permissions anytime through your Google account settings.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact</h2>
                    <p>
                      For questions or privacy concerns, email <a href="mailto:support@goglimp.com" className="text-primary-600 hover:underline">support@goglimp.com</a> or visit <a href="https://goglimp.com/support" className="text-primary-600 hover:underline">https://goglimp.com/support</a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Refund & Cancellation Policy */}
            <div className="mb-16 border-t border-gray-200 pt-16">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  💳 Refund & Cancellation Policy
                </h1>
                <div className="text-sm text-gray-600 mb-6">
                  <p><strong>Last Updated:</strong> November 2, 2025</p>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. No Refunds</h2>
                    <p className="mb-2">
                      All Glimp subscription payments are <strong>non-refundable</strong>.
                    </p>
                    <p>
                      Once a payment is made via <strong>Razorpay</strong>, it cannot be reversed.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Cancellations</h2>
                    <p className="mb-2">
                      You may cancel your subscription anytime from your account dashboard.
                    </p>
                    <p>
                      Your plan remains active until the end of the current billing cycle.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Failed Payments</h2>
                    <p>
                      If a renewal payment fails, access to Glimp Pro will be paused until successful payment.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Contact</h2>
                    <p>
                      For any payment-related issues, contact <a href="mailto:support@goglimp.com" className="text-primary-600 hover:underline">support@goglimp.com</a> or visit <a href="https://goglimp.com/support" className="text-primary-600 hover:underline">https://goglimp.com/support</a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="border-t border-gray-200 pt-16">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  ⚠️ Disclaimer
                </h1>
                <div className="text-sm text-gray-600 mb-6">
                  <p><strong>Last Updated:</strong> November 2, 2025</p>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="mb-4">
                  Glimp provides <strong>AI-powered assistance</strong> to help users prepare for interviews.
                  While we strive for accuracy, <strong>responses generated by AI are not guaranteed to be correct, complete, or professional advice</strong>.
                </p>

                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>JDB Infotech Pvt. Ltd. is not responsible for any loss or outcome based on AI responses.</li>
                  <li>Glimp does not make hiring decisions, influence interviews, or guarantee job offers.</li>
                  <li>The product is intended for <strong>educational and productivity purposes</strong> only.</li>
                </ul>

                <p className="mt-6">
                  By using Glimp, you acknowledge that you understand and agree to this disclaimer.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

