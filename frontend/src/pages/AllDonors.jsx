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
      const authHeader = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      try {
        const response = await axiosInstance.get('/api/donors', { headers: authHeader });
        setDonors(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        if (error.response?.status === 403) {
          setError('Access denied. Admin privileges required.');
        } else {
          setError(error?.response?.data?.message || 'Failed to fetch donors. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDonors();
  }, [user]);

  const deleteDonor = async (id) => {
    if (!window.confirm('Delete this donor?')) return;
    const authHeader = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
    try {
      await axiosInstance.delete(`/api/donors/${id}`, { headers: authHeader });
      setDonors((prev) => prev.filter((d) => d._id !== id));
    } catch (error) {
      setError(error?.response?.data?.message || 'Failed to delete donor.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center mt-8">Loading donors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-200 text-red-700 p-3 mt-8 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header (matches Manage Causes) */}
      <div className="bg-blue-500 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">All Donors</h1>
          <p className="text-lg opacity-90">Total Donors: {donors.length}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {donors.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-2">No donors found</h3>
            <p className="text-gray-600">No donors available at the moment</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {donors.map((donor) => {
                const initial = (
                  donor.personalInfo?.firstName?.[0] ||
                  donor.user?.name?.[0] ||
                  'U'
                ).toUpperCase();

                const fullName =
                  donor.personalInfo?.firstName && donor.personalInfo?.lastName
                    ? `${donor.personalInfo.firstName} ${donor.personalInfo.lastName}`
                    : donor.user?.name || 'N/A';

                const email = donor.user?.email || '';
                const joined = donor.createdAt
                  ? new Date(donor.createdAt).toLocaleDateString()
                  : '—';

                return (
                  <div
                    key={donor._id}
                    className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center font-bold rounded-full">
                        {initial}
                      </div>
                      <div>
                        <h3 className="font-semibold">{fullName}</h3>
                        <p className="text-sm text-gray-600">{email}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 text-xs text-gray-500">
                      Joined {joined}
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => deleteDonor(donor._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors"
                        title="Delete donor"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
              {donors.length} donors available
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllDonors;
