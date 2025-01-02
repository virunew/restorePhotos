import { useSession } from 'next-auth/react';
import PaymentButton from '../components/PaymentButton';
import Header from '../components/Header';

export default function Pricing() {
  const { data: session } = useSession();

  const plans = [
    {
      credits: 75,
      price: 1000, // 10 rupees in paise
      features: ['75 photo restores', 'Any type of photo'],
      popular: false
    },
    {
      credits: 200,
      price: 3000, // 30 rupees in paise
      features: ['200 photo restores', 'Any type of photo'],
      popular: true
    },
    {
      credits: 350,
      price: 5000, // 50 rupees in paise
      features: ['350 photo restores', 'Any type of photo'],
      popular: false
    }
  ];

  return (
    <div className="flex flex-col items-center min-h-screen py-2">
      <Header />
      <main className="flex flex-col items-center justify-center flex-1 px-4 mt-12 sm:mt-20">
        <h1 className="text-4xl font-bold">
          Buy <span className="text-blue-600">RestorePhotos</span> Credits
        </h1>
        
        <p className="mt-3 text-2xl text-gray-600">
          You have {session?.user ? '0 credits' : 'no credits'}. Join thousands of happy customers by buying more below.
        </p>

        <div className="grid grid-cols-1 gap-8 mt-12 lg:grid-cols-3 lg:gap-12">
          {plans.map((plan) => (
            <div key={plan.credits} className={`relative p-8 bg-white rounded-lg shadow-lg ${plan.popular ? 'border-2 border-blue-500' : ''}`}>
              {plan.popular && (
                <div className="absolute top-0 py-1.5 px-4 bg-blue-500 text-white rounded-full transform -translate-y-1/2">
                  MOST POPULAR
                </div>
              )}
              
              <h3 className="text-xl font-bold">{plan.credits} credits</h3>
              
              <div className="mt-4 text-gray-600">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center mt-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <div className="text-3xl font-bold">
                  ₹{plan.price / 100}
                </div>
                <div className="mt-4">
                  {session?.user ? (
                    <PaymentButton amount={plan.price} />
                  ) : (
                    <button 
                      onClick={() => alert('Please sign in to purchase credits')}
                      className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                    >
                      Sign in to Purchase
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 