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
        const basicResponse = await axiosInstance.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBasicProfile({
          name: basicResponse.data.name || '',
          email: basicResponse.data.email || '',
          affiliation: basicResponse.data.affiliation || '',
          address: basicResponse.data.address || ''
        });

        if (user.role === 'donor' || user.role === 'admin') {
          try {
            const donorResponse = await axiosInstance.get('/api/donors/profile', {
              headers: { Authorization: `Bearer ${user.token}` },
            });
            setDonorProfile(donorResponse.data);
          } catch (donorError) {
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
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-blue-500 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">{basicProfile.name ? basicProfile.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{basicProfile.name || 'Welcome'}</h1>
              <p>{user?.role === 'admin' ? 'Administrator' : user?.role === 'donor' ? 'Donor' : 'User'} - {basicProfile.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white border border-gray-300 p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Personal Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 ${
                  isEditing 
                    ? 'bg-gray-400 text-white' 
                    : 'bg-blue-500 text-white'
                }`}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleBasicProfileUpdate(basicProfile);
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1">Full Name:</label>
                    <input
                      type="text"
                      value={basicProfile.name}
                      onChange={(e) => setBasicProfile({ ...basicProfile, name: e.target.value })}
                      className="w-full p-2 border border-gray-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Email:</label>
                    <input
                      type="email"
                      value={basicProfile.email}
                      onChange={(e) => setBasicProfile({ ...basicProfile, email: e.target.value })}
                      className="w-full p-2 border border-gray-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Organization:</label>
                    <input
                      type="text"
                      value={basicProfile.affiliation}
                      onChange={(e) => setBasicProfile({ ...basicProfile, affiliation: e.target.value })}
                      className="w-full p-2 border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Address:</label>
                    <input
                      type="text"
                      value={basicProfile.address}
                      onChange={(e) => setBasicProfile({ ...basicProfile, address: e.target.value })}
                      className="w-full p-2 border border-gray-300"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2">
                    Save Changes
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-4 py-2">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-bold">Name:</p>
                  <p className="mb-3">{basicProfile.name || 'Not provided'}</p>
                  <p className="font-bold">Email:</p>
                  <p className="mb-3">{basicProfile.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="font-bold">Organization:</p>
                  <p className="mb-3">{basicProfile.affiliation || 'Not provided'}</p>
                  <p className="font-bold">Address:</p>
                  <p className="mb-3">{basicProfile.address || 'Not provided'}</p>
                </div>
              </div>
            )}
          </div>

          {(user?.role === 'donor' || user?.role === 'admin') && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold mb-4">Donor Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4">
                  <h3 className="font-bold mb-3">Account Status</h3>
                  <p><strong>Role:</strong> {user.role === 'donor' ? 'Donor' : 'Administrator'}</p>
                  <p><strong>Member Since:</strong> {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> Active</p>
                </div>
                
                <div className="bg-gray-50 p-4">
                  <h3 className="font-bold mb-3">Preferences</h3>
                  <p><strong>Visibility:</strong> {donorProfile?.preferences?.isAnonymous ? 'Anonymous' : 'Public'}</p>
                  <p><strong>Email Notifications:</strong> {donorProfile?.preferences?.emailNotifications !== false ? 'Enabled' : 'Disabled'}</p>
                  <p><strong>Newsletter:</strong> {donorProfile?.preferences?.newsletter !== false ? 'Subscribed' : 'Unsubscribed'}</p>
                </div>
              </div>

              <div className="mt-6">
                <button 
                  onClick={() => window.location.href = '/causes'}
                  className="bg-blue-500 text-white px-4 py-2 mr-2"
                >
                  Browse Causes
                </button>
                <button className="bg-gray-400 text-white px-4 py-2">
                  View History
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorProfilePage;