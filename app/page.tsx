import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BenefitCard from '@/components/BenefitCard'
import TestimonialCard from '@/components/TestimonialCard'
import FAQ from '@/components/FAQ'
import PricingCard from '@/components/PricingCard'
import { benefits, howItWorks, testimonials, faqs, pricingPlans } from '@/lib/data'

export default function Home() {
  return (
    <>
      <Header />
      <main className="main-content bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary-100 blur-3xl opacity-60" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-blue-100 blur-3xl opacity-60" />
          </div>
          <div className="container mx-auto px-4 py-20 md:py-28">
            <div className="max-w-4xl mx-auto text-center">
              <img src="/logo.png" alt="Glimp AI" className="h-40 md:h-50 mx-auto mb-5" />
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-5">
                Invisible on screen share · Built for interviews
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">                                                                                                                                                                                                                                                                                                                                                            
                Your stealth AI copilot for interviews
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Listen with your mic, capture your screen, and get real-time, private guidance and summaries—without appearing on screen shares.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/download" className="btn btn-outline btn-lg">Download App</a>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-16 md:py-20 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Built for real interviews</h2>
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center text-xl font-bold">1</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Mic listening and smart replies</h3>
                    <p className="text-gray-600">We listen via your microphone (with permission) and generate helpful real‑time suggestions and follow‑ups.</p>
                  </div>
                </div>
                <img src="/smart-reply.png" alt="Audio assist preview" className="mt-6 rounded-xl border border-gray-200 w-full max-w-md mx-auto h-auto object-cover shadow-sm" />
              </div>
              <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center text-xl font-bold">2</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Screen capture understanding</h3>
                    <p className="text-gray-600">Capture your screen context and receive tailored answers and code hints. Perfect for live coding rounds.</p>
                  </div>
                </div>
                <img src="/screen-capture.png" alt="Screen assist preview" className="mt-6 rounded-xl border border-gray-200 w-full max-w-md mx-auto h-auto object-cover shadow-sm" />
              </div>
            </div>
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" /> Invisible on screen share—no overlays shown to interviewers
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Everything you need for interview success</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <BenefitCard key={benefit.title} {...benefit} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gray-50 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((step) => (
                <div key={step.step} className="text-center">
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Simple, transparent pricing</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {pricingPlans.map((plan) => (
                <PricingCard key={plan.name} {...plan} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              What our users say
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.name} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-gray-50 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <FAQ items={faqs} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}