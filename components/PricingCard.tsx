interface PricingCardProps {
  name: string
  price: string
  period: string
  features: string[]
}

export default function PricingCard({ name, price, period, features }: PricingCardProps) {
  const isPro = name === 'Pro'

  return (
    <div className={`rounded-lg p-6 ${isPro ? 'bg-primary-50 border-2 border-primary-200' : 'bg-white border border-gray-200'}`}>
      {isPro && (
        <div className="text-center">
          <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-gray-900">{price}</span>
          {period && <span className="text-gray-600">/{period}</span>}
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <button 
        className={`w-full py-2 px-4 rounded-md font-semibold transition-colors ${
          isPro 
            ? 'bg-primary-600 text-white hover:bg-primary-700' 
            : name === 'Enterprise'
            ? 'bg-gray-800 text-white hover:bg-gray-900'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
      </button>
    </div>
  )
}