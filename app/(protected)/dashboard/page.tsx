import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PlanCard from '@/components/PlanCard'

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="main-content bg-gray-50">
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
              <PlanCard />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}


