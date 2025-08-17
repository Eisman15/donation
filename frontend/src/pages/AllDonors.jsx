import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AllDonors = () => {
  const { user } = useAuth();
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await axiosInstance.get('/api/donors', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setDonors(response.data);
        setFilteredDonors(response.data);
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

  // Search and filter functionality
  useEffect(() => {
    let filtered = [...donors];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(donor => {
        const name = `${donor.personalInfo?.firstName || ''} ${donor.personalInfo?.lastName || ''}`.toLowerCase();
        const email = donor.user?.email?.toLowerCase() || '';
        return name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
      });
    }

    // Category filter
    if (filterBy !== 'all') {
      switch (filterBy) {
        case 'active':
          filtered = filtered.filter(donor => donor.statistics?.numberOfDonations > 0);
          break;
        case 'anonymous':
          filtered = filtered.filter(donor => donor.preferences?.isAnonymous);
          break;
        case 'newsletter':
          filtered = filtered.filter(donor => donor.preferences?.newsletter);
          break;
        default:
          break;
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          const nameA = `${a.personalInfo?.firstName || ''} ${a.personalInfo?.lastName || ''}`;
          const nameB = `${b.personalInfo?.firstName || ''} ${b.personalInfo?.lastName || ''}`;
          return nameA.localeCompare(nameB);
        case 'donations':
          return (b.statistics?.totalDonated || 0) - (a.statistics?.totalDonated || 0);
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredDonors(filtered);
  }, [donors, searchTerm, filterBy, sortBy]);

  const getTotalStats = () => {
    return donors.reduce((acc, donor) => ({
      totalDonated: acc.totalDonated + (donor.statistics?.totalDonated || 0),
      totalDonations: acc.totalDonations + (donor.statistics?.numberOfDonations || 0),
      totalCauses: acc.totalCauses + (donor.statistics?.causesSupported || 0)
    }), { totalDonated: 0, totalDonations: 0, totalCauses: 0 });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Loading donors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
          {error}
        </div>
      </div>
    );
  }

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Donor Management</h1>
              <p className="text-blue-100 text-lg">Manage and monitor all registered donors</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{donors.length}</div>
              <div className="text-blue-100">Total Donors</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalDonated.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">💰</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Contributions</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalDonations}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">🎯</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Donors</p>
                <p className="text-3xl font-bold text-gray-900">{donors.filter(d => d.statistics?.numberOfDonations > 0).length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">👥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">🔍</span>
                  <input
                    type="text"
                    placeholder="Search donors by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filters and Controls */}
              <div className="flex items-center space-x-4">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Donors</option>
                  <option value="active">Active Donors</option>
                  <option value="anonymous">Anonymous</option>
                  <option value="newsletter">Newsletter Subscribers</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Sort by Name</option>
                  <option value="donations">Sort by Donations</option>
                  <option value="recent">Sort by Recent</option>
                </select>

                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'cards' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Cards
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'table' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Table
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="p-6">
            {filteredDonors.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No donors found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDonors.map((donor) => (
                  <div key={donor._id} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {donor.personalInfo?.firstName?.charAt(0) || donor.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {donor.personalInfo?.firstName && donor.personalInfo?.lastName 
                            ? `${donor.personalInfo.firstName} ${donor.personalInfo.lastName}`
                            : donor.user?.name || 'N/A'
                          }
                        </h3>
                        <p className="text-sm text-gray-600">{donor.user?.email}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Donated</span>
                        <span className="font-semibold text-green-600">${donor.statistics?.totalDonated || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Donations</span>
                        <span className="font-semibold">{donor.statistics?.numberOfDonations || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Causes</span>
                        <span className="font-semibold">{donor.statistics?.causesSupported || 0}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {donor.preferences?.isAnonymous && (
                          <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded-full">Anonymous</span>
                        )}
                        {donor.preferences?.emailNotifications && (
                          <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full">Notifications</span>
                        )}
                        {donor.preferences?.newsletter && (
                          <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full">Newsletter</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-500">
                      Joined {new Date(donor.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Donor</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Statistics</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Preferences</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonors.map((donor) => (
                      <tr key={donor._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                              {donor.personalInfo?.firstName?.charAt(0) || donor.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {donor.personalInfo?.firstName && donor.personalInfo?.lastName 
                                  ? `${donor.personalInfo.firstName} ${donor.personalInfo.lastName}`
                                  : donor.user?.name || 'N/A'
                                }
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-900">{donor.user?.email}</div>
                          <div className="text-sm text-gray-600">{donor.personalInfo?.phone || 'N/A'}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <div className="text-green-600 font-medium">${donor.statistics?.totalDonated || 0}</div>
                            <div className="text-gray-600">{donor.statistics?.numberOfDonations || 0} donations</div>
                            <div className="text-gray-600">{donor.statistics?.causesSupported || 0} causes</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1">
                            {donor.preferences?.isAnonymous && (
                              <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded">Anonymous</span>
                            )}
                            {donor.preferences?.emailNotifications && (
                              <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded">Email</span>
                            )}
                            {donor.preferences?.newsletter && (
                              <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded">Newsletter</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {new Date(donor.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div>
                Showing {filteredDonors.length} of {donors.length} donors
              </div>
              <div>
                Total platform impact: ${stats.totalDonated.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllDonors;