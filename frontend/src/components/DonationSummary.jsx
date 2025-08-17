import { useState, useEffect } from 'react';

const DonationSummary = ({ donorId }) => {
  const [summary, setSummary] = useState({
    totalDonated: 0,
    numberOfDonations: 0,
    causesSupported: 0,
    yearlyTaxDeductible: 0,
    lastDonationDate: null,
    firstDonationDate: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, [donorId]);

  const fetchSummary = async () => {
    try {
      // API call placeholder
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const currentYear = new Date().getFullYear();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Donated</p>
              <p className="text-2xl font-bold text-gray-900">
                ${summary.totalDonated.toLocaleString()}
              </p>
            </div>
            <div className="text-blue-500 text-2xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Number of Donations</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.numberOfDonations}
              </p>
            </div>
            <div className="text-green-500 text-2xl">🎯</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Causes Supported</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.causesSupported}
              </p>
            </div>
            <div className="text-purple-500 text-2xl">❤️</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">{currentYear} Tax Deductible</p>
              <p className="text-2xl font-bold text-gray-900">
                ${summary.yearlyTaxDeductible.toLocaleString()}
              </p>
            </div>
            <div className="text-orange-500 text-2xl">📋</div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Donation Timeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">First Donation</p>
            <p className="text-lg text-gray-900">{formatDate(summary.firstDonationDate)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Last Donation</p>
            <p className="text-lg text-gray-900">{formatDate(summary.lastDonationDate)}</p>
          </div>
        </div>
      </div>

      {/* Impact Statement */}
      {summary.totalDonated > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Impact</h3>
          <p className="text-gray-700">
            Thank you for your generous support! Your {summary.numberOfDonations} donation{summary.numberOfDonations !== 1 ? 's' : ''} 
            totaling ${summary.totalDonated.toLocaleString()} have made a real difference in {summary.causesSupported} cause{summary.causesSupported !== 1 ? 's' : ''}. 
            Every contribution helps create positive change in our communities.
          </p>
        </div>
      )}
    </div>
  );
};

export default DonationSummary;