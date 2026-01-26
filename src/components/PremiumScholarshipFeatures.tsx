
import { Crown, Target, Bell, FileText, CheckCircle } from 'lucide-react';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useNavigate } from 'react-router-dom';
import { analytics, EVENTS } from '../services/analytics';

export function PremiumScholarshipFeatures() {
  const navigate = useNavigate();
  const isFeatureAvailable = useSubscriptionStore((s) => s.isFeatureAvailable);
  const hasPremium = isFeatureAvailable('scholarship_matching');

  if (hasPremium) return null;

  const handleUpgradeClick = () => {
    analytics.track(EVENTS.UPGRADE_CTA_CLICKED, { location: 'scholarships_page' });
    navigate('/subscribe');
  };

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-6 mb-6 text-gray-900">
      <div className="flex items-center gap-2 mb-4">
        <Crown className="w-6 h-6" />
        <h3 className="text-xl font-bold">Unlock Premium Scholarships</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold">AI-Powered Matching</h4>
            <p className="text-sm opacity-90">Get personalized scholarship recommendations</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold">Deadline Tracking</h4>
            <p className="text-sm opacity-90">Never miss an application deadline</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold">Essay Templates</h4>
            <p className="text-sm opacity-90">Access winning essay samples</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold">Application Assistance</h4>
            <p className="text-sm opacity-90">Document prep & CV reviews</p>
          </div>
        </div>
      </div>

      <button 
        onClick={handleUpgradeClick}
        className="w-full bg-gray-900 text-yellow-400 font-bold py-3 rounded-lg hover:bg-gray-800 transition"
      >
        Upgrade to Scholar Plus - $9.99/month
      </button>
    </div>
  );
}
