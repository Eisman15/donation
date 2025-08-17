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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">{basicProfile.name ? basicProfile.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{basicProfile.name || 'Welcome'}</h1>
              <p className="text-blue-100 text-lg">{user?.role === 'admin' ? 'Administrator' : user?.role === 'donor' ? 'Donor' : 'User'} • {basicProfile.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        
        <div className="p-6 space-y-8">
          {/* Basic Profile Section */}
          <div className="border-b border-gray-200 pb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                <p className="text-gray-600 mt-1">Manage your account details and contact information</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isEditing 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                }`}
              >
                {isEditing ? (
                  <>
                    <span>✕</span>
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <span>✏️</span>
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>
            
            {isEditing ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleBasicProfileUpdate(basicProfile);
              }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={basicProfile.name}
                      onChange={(e) => setBasicProfile({ ...basicProfile, name: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={basicProfile.email}
                      onChange={(e) => setBasicProfile({ ...basicProfile, email: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Organization/Affiliation</label>
                    <input
                      type="text"
                      placeholder="Company, school, or organization"
                      value={basicProfile.affiliation}
                      onChange={(e) => setBasicProfile({ ...basicProfile, affiliation: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      placeholder="Street address, city, state"
                      value={basicProfile.address}
                      onChange={(e) => setBasicProfile({ ...basicProfile, address: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-sm">👤</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="text-lg text-gray-900">{basicProfile.name || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-sm">✉️</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email Address</p>
                      <p className="text-lg text-gray-900">{basicProfile.email || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-sm">🏢</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Organization</p>
                      <p className="text-lg text-gray-900">{basicProfile.affiliation || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-sm">📍</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-lg text-gray-900">{basicProfile.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Donor Information Section */}
          {(user?.role === 'donor' || user?.role === 'admin') && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Donor Dashboard</h2>
                <p className="text-gray-600 mt-1">Track your contributions and impact on the community</p>
              </div>
              
              <div className="space-y-8">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Donated</p>
                        <p className="text-3xl font-bold text-blue-900">${donorProfile?.statistics?.totalDonated || 0}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xl">💰</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Donations Made</p>
                        <p className="text-3xl font-bold text-green-900">{donorProfile?.statistics?.numberOfDonations || 0}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xl">🎯</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Causes Supported</p>
                        <p className="text-3xl font-bold text-purple-900">{donorProfile?.statistics?.causesSupported || 0}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-xl">❤️</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status and Preferences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600 text-sm">👑</span>
                      </span>
                      Account Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Role</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role === 'donor' ? 'Donor' : 'Administrator'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Member Since</span>
                        <span className="text-gray-900">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600 text-sm">⚙️</span>
                      </span>
                      Preferences
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Donation Visibility</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          donorProfile?.preferences?.isAnonymous ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {donorProfile?.preferences?.isAnonymous ? 'Anonymous' : 'Public'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Email Notifications</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          donorProfile?.preferences?.emailNotifications !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {donorProfile?.preferences?.emailNotifications !== false ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Newsletter</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          donorProfile?.preferences?.newsletter !== false ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {donorProfile?.preferences?.newsletter !== false ? 'Subscribed' : 'Unsubscribed'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => window.location.href = '/causes'}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <span>🎯</span>
                      <span>Browse Causes</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 border border-gray-300 transition-all duration-200">
                      <span>📊</span>
                      <span>View History</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 border border-gray-300 transition-all duration-200">
                      <span>📧</span>
                      <span>Update Preferences</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default DonorProfilePage;