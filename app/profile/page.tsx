import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProfileCard from '@/components/ProfileCard'

export default function ProfilePage() {
  return (
    <>
      <Header />
      <main className="main-content bg-gray-50">
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Account Settings
              </h1>
              <ProfileCard />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}