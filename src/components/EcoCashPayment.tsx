import { useState } from 'react';
import { Smartphone, CheckCircle, AlertCircle } from 'lucide-react';

interface EcoCashPaymentProps {
  amount: number;
  description: string;
  onSuccess: () => void;
}

export function EcoCashPayment({ amount, description, onSuccess }: EcoCashPaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [pollUrl, setPollUrl] = useState<string | null>(null);

  const initiatePayment = async () => {
    setProcessing(true);
    
    // Demo mode - simulate payment request
    setTimeout(() => {
      setPollUrl('demo-poll-url');
      // Simulate successful payment after 3 seconds
      setTimeout(() => {
        console.log('✅ Demo EcoCash payment successful');
        onSuccess();
      }, 3000);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Smartphone className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">Pay with EcoCash</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Demo Mode: Enter any Zimbabwean number to test
        </p>
      </div>

      {!pollUrl ? (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">EcoCash Number</label>
            <input
              type="tel"
              placeholder="077 123 4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span>Amount:</span>
              <span className="font-bold">${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Description:</span>
              <span className="text-gray-600">{description}</span>
            </div>
          </div>

          <button
            onClick={initiatePayment}
            disabled={!phoneNumber || processing}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {processing ? 'Sending Request...' : 'Send Payment Request'}
          </button>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="animate-pulse mb-4">
            <CheckCircle className="w-16 h-16 text-blue-600 mx-auto" />
          </div>
          <h3 className="text-lg font-bold mb-2">Check your phone</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            A payment prompt has been sent to {phoneNumber}
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <div className="flex items-center gap-2 justify-center text-sm text-yellow-800 dark:text-yellow-200">
              <AlertCircle className="w-4 h-4" />
              <span>Demo: Payment will complete automatically in 3 seconds</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
