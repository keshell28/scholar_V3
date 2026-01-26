import React, { useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';

interface StripeCheckoutProps {
  amount: number;
  tierId: string;
  onSuccess: () => void;
}

export function StripeCheckout({ amount, tierId, onSuccess }: StripeCheckoutProps) {
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);

    // Demo mode - simulate payment processing
    setTimeout(() => {
      console.log('✅ Demo payment successful:', { amount, tierId });
      setProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">Secure Payment</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Demo Mode: Use any card details to test
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Card Number</label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="4242 4242 4242 4242"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Expiry Date</label>
          <input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">CVC</label>
          <input
            type="text"
            placeholder="123"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            required
          />
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between mb-2">
          <span>Amount:</span>
          <span className="font-bold text-green-600">${amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Billing:</span>
          <span>Monthly</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={processing}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition"
      >
        {processing ? 'Processing...' : `Pay $${amount}`}
      </button>

      <p className="text-xs text-center text-gray-500">
        Your payment is secure and encrypted
      </p>
    </form>
  );
}
