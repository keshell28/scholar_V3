
import { TrendingUp, Mail, Eye, FileText } from 'lucide-react';

export function UniversityPartnerDashboard() {
  // Mock data - would come from API
  const stats = {
    profileViews: 1247,
    inquiries: 89,
    applications: 23,
    students: 156,
    monthlySpend: 1500,
    conversionRate: 25.8,
  };

  const recentInquiries = [
    { id: 1, student: 'Tatenda Moyo', program: 'Computer Science', date: '2 hours ago' },
    { id: 2, student: 'Rudo Ncube', program: 'Business Administration', date: '5 hours ago' },
    { id: 3, student: 'Tinotenda Chikwande', program: 'Engineering', date: '1 day ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">University Partner Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your recruitment performance on Scholar</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm">Profile Views</h3>
            <Eye className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.profileViews.toLocaleString()}</p>
          <p className="text-sm text-green-600">↑ 12% this month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm">Student Inquiries</h3>
            <Mail className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.inquiries}</p>
          <p className="text-sm text-green-600">↑ 8% this month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm">Applications</h3>
            <FileText className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.applications}</p>
          <p className="text-sm text-green-600">↑ 15% this month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm">Conversion Rate</h3>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.conversionRate}%</p>
          <p className="text-sm text-green-600">↑ 3% this month</p>
        </div>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-2 border-yellow-400 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Featured Tier - $1,500/month</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your profile appears in top positions • Analytics dashboard • Priority support
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">ROI this month</p>
            <p className="text-3xl font-bold text-green-600">340%</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Inquiries</h2>
          <div className="space-y-4">
            {recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{inquiry.student}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{inquiry.program}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 dark:text-gray-400">{inquiry.date}</p>
                  <button className="text-sm text-green-600 hover:underline mt-1">
                    Reply →
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-green-600 hover:underline text-sm">
            View all inquiries →
          </button>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
              + Add New Program
            </button>
            <button className="w-full border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              Update Profile Information
            </button>
            <button className="w-full border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              Download Analytics Report
            </button>
            <button className="w-full border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              Manage Scholarship Listings
            </button>
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-6 text-center">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">🎓 University Partner Demo</h3>
        <p className="text-gray-600 dark:text-gray-400">
          This is a demonstration of the University Partner Dashboard. Real partners get access to full analytics,
          student engagement tools, and recruitment management features.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Contact us to become a partner: partnerships@scholar.co.zw
        </p>
      </div>
    </div>
  );
}
