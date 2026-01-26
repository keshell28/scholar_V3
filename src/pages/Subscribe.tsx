import { useState, useEffect } from 'react';
import { Check, Crown, ArrowLeft } from 'lucide-react';
import { SUBSCRIPTION_TIERS, useSubscriptionStore } from '../stores/subscriptionStore';
import { StripeCheckout } from '../components/StripeCheckout';
import { EcoCashPayment } from '../components/EcoCashPayment';
import { useNavigate } from 'react-router-dom';
import { analytics, EVENTS } from '../services/analytics';

export function Subscribe() {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'ecocash' | null>(null);
  const { setSubscription, currentSubscription } = useSubscriptionStore();

  useEffect(() => {
    analytics.pageView('Subscribe Page');
  }, []);

  const handlePaymentSuccess = () => {
    const tier = SUBSCRIPTION_TIERS.find((t) => t.id === selectedTier)!;
    
    // Update subscription
    setSubscription({
      id: `sub-${Date.now()}`,
      userId: 'demo-user',
      tier: selectedTier as any,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      autoRenew: true,
    });

    analytics.track(EVENTS.PAYMENT_COMPLETED, {
      tier: tier.name,
      amount: tier.price,
      method: paymentMethod,
    });

    analytics.trackRevenue(tier.price, {
      tier: tier.name,
      interval: tier.interval,
    });

    // Show success and redirect
    alert(`🎉 Welcome to ${tier.name}! Your subscription is now active.`);
    navigate('/scholarships');
  };

  if (selectedTier && paymentMethod) {
    const tier = SUBSCRIPTION_TIERS.find((t) => t.id === selectedTier)!;

    return (
      <div className="max-w-2xl mx-auto p-6">
        <button
          onClick={() => setPaymentMethod(null)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <h1 className="text-3xl font-bold mb-8">Complete Your Subscription</h1>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 mb-6">
          <h2 className="text-xl font-bold mb-2">{tier.name}</h2>
          <p className="text-3xl font-bold text-green-600 mb-4">
            ${tier.price}
            <span className="text-sm text-gray-600">/{tier.interval}</span>
          </p>
        </div>

        {paymentMethod === 'stripe' && (
          <StripeCheckout
            amount={tier.price}
            tierId={tier.id}
            onSuccess={handlePaymentSuccess}
          />
        )}

        {paymentMethod === 'ecocash' && (
          <EcoCashPayment
            amount={tier.price}
            description={`${tier.name} Subscription`}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    );
  }

  if (selectedTier) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <button
          onClick={() => setSelectedTier(null)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <h1 className="text-3xl font-bold mb-8">Choose Payment Method</h1>

        <div className="space-y-4">
          <button
            onClick={() => {
              setPaymentMethod('ecocash');
              analytics.track(EVENTS.PAYMENT_METHOD_SELECTED, { method: 'ecocash' });
            }}
            className="w-full p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-500 transition text-left"
          >
            <h3 className="font-bold text-lg mb-2">💵 EcoCash / OneMoney</h3>
            <p className="text-gray-600 dark:text-gray-400">Pay with mobile money (Zimbabwe)</p>
          </button>

          <button
            onClick={() => {
              setPaymentMethod('stripe');
              analytics.track(EVENTS.PAYMENT_METHOD_SELECTED, { method: 'stripe' });
            }}
            className="w-full p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-500 transition text-left"
          >
            <h3 className="font-bold text-lg mb-2">💳 Credit / Debit Card</h3>
            <p className="text-gray-600 dark:text-gray-400">International payments via Stripe</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Unlock your full potential with Scholar Plus
        </p>
        {currentSubscription && (
          <div className="mt-4 inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-2 rounded-full">
            Current Plan: {currentSubscription.tier === 'free' ? 'Free' : currentSubscription.tier === 'premium' ? 'Scholar Premium' : 'Scholar Plus'}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {SUBSCRIPTION_TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`border-2 rounded-lg p-8 ${
              tier.popular
                ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10 relative'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  Most Popular
                </span>
              </div>
            )}

            <h2 className="text-2xl font-bold mb-2">{tier.name}</h2>
            <div className="mb-6">
              <span className="text-4xl font-bold">${tier.price}</span>
              <span className="text-gray-600 dark:text-gray-400">/{tier.interval}</span>
            </div>

            <ul className="space-y-3 mb-8">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                if (tier.id !== 'free') {
                  setSelectedTier(tier.id);
                  analytics.track(EVENTS.UPGRADE_CTA_CLICKED, {
                    tier: tier.name,
                    price: tier.price,
                    location: 'subscribe_page',
                  });
                }
              }}
              disabled={tier.id === 'free' || currentSubscription?.tier === tier.id}
              className={`w-full py-3 rounded-lg font-bold transition ${
                tier.popular
                  ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                  : tier.id === 'free' || currentSubscription?.tier === tier.id
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {currentSubscription?.tier === tier.id ? 'Current Plan' : tier.id === 'free' ? 'Free Forever' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          🇿🇼 Supporting Zimbabwean students with flexible payment options
        </p>
        <p className="text-sm text-gray-500">
          Cancel anytime • No hidden fees • 30-day money-back guarantee
        </p>
      </div>
    </div>
  );
}
