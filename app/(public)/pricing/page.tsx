import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";
import { pricingPlans } from "@/lib/data";

export default function PricingPage({
  searchParams,
}: {
  searchParams: { showMessage?: string };
}) {
  return (
    <>
      <Header />
      <main className="main-content bg-white">
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Simple, transparent pricing
              </h1>
              {searchParams?.showMessage === "true" ? (
                <p className="text-xl text-red-600 animate-bounce">
                  Please subscribe to a plan to continue using our services.
                </p>
              ) : (
                <p className="text-xl text-gray-600">
                  Choose the plan that's right for you
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {pricingPlans.map((plan) => (
                <PricingCard key={plan.name} {...plan} />
              ))}
            </div>

            {/* FAQ Section */}
            <div className="mt-20">
              <h2 className="text-2xl font-bold text-center mb-8">
                Billing FAQ
              </h2>
              <div className="max-w-2xl mx-auto">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">
                      Can I cancel anytime?
                    </h3>
                    <p className="text-gray-600">
                      Yes, you can cancel your subscription at any time. You'll
                      continue to have access until the end of your billing
                      period.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      What payment methods do you accept?
                    </h3>
                    <p className="text-gray-600">
                      We accept all major credit cards, debit cards, and UPI
                      payments through Razorpay.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
