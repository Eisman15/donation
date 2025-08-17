import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const DonorProfilePage = () => {
  const { user } = useAuth();
  const [donorProfile, setDonorProfile] = useState(null);
  const [basicProfile, setBasicProfile] = useState({
    name: '',
    email: '',
    affiliation: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Fetch basic profile
        const basicResponse = await axiosInstance.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBasicProfile({
          name: basicResponse.data.name || '',
          email: basicResponse.data.email || '',
          affiliation: basicResponse.data.affiliation || '',
          address: basicResponse.data.address || ''
        });

        // Fetch donor profile if user is donor/admin
        if (user.role === 'donor' || user.role === 'admin') {
          try {
            const donorResponse = await axiosInstance.get('/api/donors/profile', {
              headers: { Authorization: `Bearer ${user.token}` },
            });
            setDonorProfile(donorResponse.data);
          } catch (donorError) {
            if (donorError.response?.status !== 404) {
              console.error('Failed to fetch donor profile:', donorError);
            }
          }
        }
      } catch (error) {
        setError('Failed to fetch profile information.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfiles();
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

  const handleDonorProfileUpdate = (updatedProfile) => {
    setDonorProfile(updatedProfile);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading donor profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-20 p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-20 p-6">
      <div className="bg-white shadow-md rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Basic Profile Section */}
          <div className="border-b border-gray-200 pb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            
            {isEditing ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleBasicProfileUpdate(basicProfile);
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={basicProfile.name}
                    onChange={(e) => setBasicProfile({ ...basicProfile, name: e.target.value })}
                    className="p-3 border border-gray-300 rounded-lg"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={basicProfile.email}
                    onChange={(e) => setBasicProfile({ ...basicProfile, email: e.target.value })}
                    className="p-3 border border-gray-300 rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Affiliation"
                    value={basicProfile.affiliation}
                    onChange={(e) => setBasicProfile({ ...basicProfile, affiliation: e.target.value })}
                    className="p-3 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={basicProfile.address}
                    onChange={(e) => setBasicProfile({ ...basicProfile, address: e.target.value })}
                    className="p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Update Profile
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {basicProfile.name || 'Not provided'}</p>
                  <p><span className="font-medium">Email:</span> {basicProfile.email || 'Not provided'}</p>
                </div>
                <div className="space-y-2">
                  <p><span className="font-medium">Affiliation:</span> {basicProfile.affiliation || 'Not provided'}</p>
                  <p><span className="font-medium">Address:</span> {basicProfile.address || 'Not provided'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Donor Information Section */}
          {(user?.role === 'donor' || user?.role === 'admin') && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Donor Information</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Donation Statistics</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Total Donated:</span> ${donorProfile?.statistics?.totalDonated || 0}</p>
                      <p><span className="font-medium">Number of Donations:</span> {donorProfile?.statistics?.numberOfDonations || 0}</p>
                      <p><span className="font-medium">Causes Supported:</span> {donorProfile?.statistics?.causesSupported || 0}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Donor Status</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Role:</span> {user.role === 'donor' ? 'Donor' : 'Admin'}</p>
                      <p><span className="font-medium">Member Since:</span> {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                      <p><span className="font-medium">Status:</span> <span className="text-green-600 font-semibold">Active</span></p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Donation Preferences</h3>
                  <div className="flex flex-wrap gap-2">
                    {donorProfile?.preferences?.isAnonymous ? (
                      <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-gray-200 text-gray-800">
                        Anonymous Donations
                      </span>
                    ) : (
                      <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-200 text-blue-800">
                        Public Donations
                      </span>
                    )}
                    {donorProfile?.preferences?.emailNotifications !== false && (
                      <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-200 text-green-800">
                        Email Notifications
                      </span>
                    )}
                    {donorProfile?.preferences?.newsletter !== false && (
                      <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-purple-200 text-purple-800">
                        Newsletter Subscriber
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorProfilePage;