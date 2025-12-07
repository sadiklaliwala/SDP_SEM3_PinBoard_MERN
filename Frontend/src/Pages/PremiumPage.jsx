import React, { useContext, useState } from 'react';
import { PaymentContext } from '../Context/PaymentContext';
import { UserContext } from '../Context/UserContext';
import { toast } from 'react-toastify';

const PremiumPage = () => {
  const { initiatePayment, loading } = useContext(PaymentContext);
  const { currentUser } = useContext(UserContext);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'basic',
      name: 'Basic Premium',
      price: 99,
      duration: '1 Month',
      features: [
        'Ad-free experience',
        'Unlimited pin uploads',
        'Priority support',
        'Advanced analytics',
      ],
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro Premium',
      price: 499,
      duration: '6 Months',
      features: [
        'Everything in Basic',
        'Exclusive badges',
        'Early access to features',
        'Custom profile themes',
        'Download pins in HD',
      ],
      popular: true,
    },
    {
      id: 'ultimate',
      name: 'Ultimate Premium',
      price: 899,
      duration: '1 Year',
      features: [
        'Everything in Pro',
        'Lifetime premium badge',
        'Priority customer support',
        'Exclusive community access',
        'Monthly featured pins',
        'API access',
      ],
      popular: false,
    },
  ];

  const handlePurchase = async (plan) => {
    if (!currentUser) {
      toast.error('Please login to purchase premium');
      return;
    }
    
    setSelectedPlan(plan.id);
    await initiatePayment(plan.price, `${plan.name} - ${plan.duration}`);
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-red-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Upgrade to <span className="text-red-600">Premium</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Unlock exclusive features and take your Pinterest experience to the next level
          </p>
        </div>

        {/* Current Status */}
        {currentUser?.isPremium && (
          <div className="mb-8 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-crown text-yellow-500 text-xl"></i>
              <p className="text-green-800 dark:text-green-200 font-medium">
                You are currently a Premium member
              </p>
            </div>
            {currentUser.premiumExpiry && (
              <p className="text-center text-sm text-green-700 dark:text-green-300 mt-2">
                Expires on: {new Date(currentUser.premiumExpiry).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-neutral-800 rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-105 ${
                plan.popular ? 'ring-4 ring-red-500' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-1 rounded-bl-lg font-semibold text-sm">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-red-600">₹{plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-400">/{plan.duration}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <i className="fa-solid fa-circle-check text-green-500 mt-1 flex-shrink-0"></i>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Purchase Button */}
                <button
                  onClick={() => handlePurchase(plan)}
                  disabled={loading && selectedPlan === plan.id}
                  className={`w-full py-3 px-6 rounded-full font-semibold transition-all ${
                    plan.popular
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 text-gray-900 dark:text-gray-100'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading && selectedPlan === plan.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      Processing...
                    </span>
                  ) : (
                    'Get Started'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
            Why Go Premium?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: 'fa-bolt',
                title: 'Ad-Free Experience',
                description: 'Enjoy uninterrupted browsing without any advertisements',
              },
              {
                icon: 'fa-cloud-arrow-up',
                title: 'Unlimited Uploads',
                description: 'Upload as many pins as you want without restrictions',
              },
              {
                icon: 'fa-chart-line',
                title: 'Advanced Analytics',
                description: 'Get detailed insights on your pins performance',
              },
              {
                icon: 'fa-crown',
                title: 'Premium Badge',
                description: 'Stand out with an exclusive premium badge on your profile',
              },
            ].map((benefit, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <i className={`fa-solid ${benefit.icon} text-red-600 dark:text-red-400 text-xl`}></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Security Notice */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <i className="fa-solid fa-lock mr-2"></i>
            Secure payment powered by Razorpay. All transactions are encrypted and safe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;