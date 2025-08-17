import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const DonorProfilePage = () => {
  const { user } = useAuth();
  const [basicProfile, setBasicProfile] = useState({
    name: '',
    email: '',
    address: '',
    affiliation: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const basicResponse = await axiosInstance.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBasicProfile({
          name: basicResponse.data.name || '',
          email: basicResponse.data.email || '',
          address: basicResponse.data.address || '',
          affiliation: basicResponse.data.affiliation || ''
        });
      } catch (error) {
        setError('Failed to fetch profile information.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleBasicProfileUpdate = async (formData) => {
    try {
      await axiosInstance.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBasicProfile(formData);
      setIsEditing(false);
      alert('Profile updated!');
    } catch (error) {
      alert('Update failed');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center mt-8">Loading profile...</div>
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">Donor Profile</h1>
          <p className="text-blue-100">Manage your account information</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-4">Profile Information</h2>
            {isEditing ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleBasicProfileUpdate(basicProfile);
              }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name:</label>
                  <input
                    type="text"
                    value={basicProfile.name}
                    onChange={(e) => setBasicProfile({ ...basicProfile, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address:</label>
                  <input
                    type="email"
                    value={basicProfile.email}
                    onChange={(e) => setBasicProfile({ ...basicProfile, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address:</label>
                  <input
                    type="text"
                    value={basicProfile.address}
                    onChange={(e) => setBasicProfile({ ...basicProfile, address: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Affiliation:</label>
                  <input
                    type="text"
                    value={basicProfile.affiliation}
                    onChange={(e) => setBasicProfile({ ...basicProfile, affiliation: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your organization or affiliation"
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors shadow-md hover:shadow-lg"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-md font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="space-y-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                    <p className="text-lg text-gray-900">{basicProfile.name || 'Not provided'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                    <p className="text-lg text-gray-900">{basicProfile.email || 'Not provided'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                    <p className="text-lg text-gray-900">{basicProfile.address || 'Not provided'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Affiliation</label>
                    <p className="text-lg text-gray-900">{basicProfile.affiliation || 'Not provided'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors shadow-md hover:shadow-lg"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorProfilePage;