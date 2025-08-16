import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DonorProfile from '../components/DonorProfile';
import axiosInstance from '../axiosConfig';

const DonorProfilePage = () => {
  const { user } = useAuth();
  const [donorProfile, setDonorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonorProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/donors/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setDonorProfile(response.data);
      } catch (error) {
        if (error.response?.status === 404) {
          setDonorProfile(null);
        } else if (error.response?.status === 403) {
          setError('Access denied. Donor privileges required.');
        } else {
          setError('Failed to fetch donor profile. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user && (user.role === 'donor' || user.role === 'admin')) {
      fetchDonorProfile();
    } else {
      setError('Access denied. Donor privileges required.');
      setLoading(false);
    }
  }, [user]);

  const handleProfileUpdate = (updatedProfile) => {
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
          <h1 className="text-2xl font-bold text-gray-900">Donor Profile</h1>
          <p className="text-gray-600 mt-1">
            {donorProfile ? 'Manage your donor information and preferences' : 'Create your donor profile to start making donations'}
          </p>
        </div>
        
        <div className="p-6">
          {donorProfile ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {donorProfile.personalInfo?.firstName} {donorProfile.personalInfo?.lastName}</p>
                    <p><span className="font-medium">Email:</span> {donorProfile.user?.email}</p>
                    <p><span className="font-medium">Phone:</span> {donorProfile.personalInfo?.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Donation Statistics</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Total Donated:</span> ${donorProfile.statistics?.totalDonated || 0}</p>
                    <p><span className="font-medium">Number of Donations:</span> {donorProfile.statistics?.numberOfDonations || 0}</p>
                    <p><span className="font-medium">Causes Supported:</span> {donorProfile.statistics?.causesSupported || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Preferences</h3>
                <div className="flex flex-wrap gap-2">
                  {donorProfile.preferences?.isAnonymous && (
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-gray-200 text-gray-800">
                      Anonymous Donations
                    </span>
                  )}
                  {donorProfile.preferences?.emailNotifications && (
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-200 text-green-800">
                      Email Notifications
                    </span>
                  )}
                  {donorProfile.preferences?.newsletter && (
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-200 text-blue-800">
                      Newsletter Subscriber
                    </span>
                  )}
                  {donorProfile.preferences?.preferredPaymentMethod && (
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-purple-200 text-purple-800">
                      Preferred: {donorProfile.preferences.preferredPaymentMethod}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Profile</h3>
                <DonorProfile 
                  existingProfile={donorProfile} 
                  onUpdate={handleProfileUpdate}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Your Donor Profile</h3>
              <p className="text-gray-600 mb-6">You need to create a donor profile to start making donations and track your contributions.</p>
              <DonorProfile onUpdate={handleProfileUpdate} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorProfilePage;