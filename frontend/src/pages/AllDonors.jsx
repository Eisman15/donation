import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AllDonors = () => {
  const { user } = useAuth();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await axiosInstance.get('/api/donors', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setDonors(response.data);
      } catch (error) {
        if (error.response?.status === 403) {
          setError('Access denied. Admin privileges required.');
        } else {
          setError('Failed to fetch donors. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDonors();
    }
  }, [user]);

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (error) return <div className="p-20 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto mt-20 p-6">
      <div className="bg-white shadow-md rounded-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">All Donors</h1>
        </div>
        
        {donors.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No donors found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donor Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statistics
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preferences
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donors.map((donor) => (
                  <tr key={donor._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                            {donor.personalInfo?.firstName?.charAt(0) || donor.user?.name?.charAt(0) || 'U'}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {donor.personalInfo?.firstName && donor.personalInfo?.lastName 
                              ? `${donor.personalInfo.firstName} ${donor.personalInfo.lastName}`
                              : donor.user?.name || 'N/A'
                            }
                          </div>
                          <div className="text-sm text-gray-500">
                            {donor.user?.email || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {donor.personalInfo?.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Total: ${donor.statistics?.totalDonated || 0}</div>
                        <div>Donations: {donor.statistics?.numberOfDonations || 0}</div>
                        <div>Causes: {donor.statistics?.causesSupported || 0}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex flex-col space-y-1">
                          {donor.preferences?.isAnonymous && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              Anonymous
                            </span>
                          )}
                          {donor.preferences?.emailNotifications && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Email Notifications
                            </span>
                          )}
                          {donor.preferences?.newsletter && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              Newsletter
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(donor.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Total Donors: {donors.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllDonors;