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

  const deleteDonor = async (id) => {
    if (!window.confirm('Delete this donor?')) return;
    try {
      await axiosInstance.delete(`/api/donors/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
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
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 mt-8">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-blue-500 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">All Donors</h1>
          <p className="text-lg">Total Donors: {donors.length}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div>
          {donors.length === 0 ? (
            <div className="text-center py-12 bg-white border border-gray-300">
              <h3 className="text-lg font-bold mb-2">No donors found</h3>
              <p>No donors available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {donors.map((donor) => (
                <div key={donor._id} className="bg-white border border-gray-300 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center font-bold">
                      {donor.personalInfo?.firstName?.charAt(0) ||
                        donor.user?.name?.charAt(0) ||
                        'U'}
                    </div>
                    <div>
                      <h3 className="font-bold">
                        {donor.personalInfo?.firstName && donor.personalInfo?.lastName
                          ? `${donor.personalInfo.firstName} ${donor.personalInfo.lastName}`
                          : donor.user?.name || 'N/A'}
                      </h3>
                      <p className="text-sm text-gray-600">{donor.user?.email}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="text-xs text-gray-500">
                      Joined {new Date(donor.createdAt).toLocaleDateString()}
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => deleteDonor(donor._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors"
                        title="Delete donor"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          {donors.length} donors available
        </div>
      </div>
    </div>
  );
};

export default AllDonors;
