import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Causes = () => {
  const { user } = useAuth();
  const [causes, setCauses] = useState([]);
  const [filteredCauses, setFilteredCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [newCause, setNewCause] = useState({
    title: '',
    description: '',
    goalAmount: '',
    category: '',
    image: ''
  });
  const [donationAmounts, setDonationAmounts] = useState({});

  const categories = ['all', 'education', 'healthcare', 'environment', 'poverty', 'disaster relief', 'animals', 'community'];

  useEffect(() => {
    fetchCauses();
  }, []);

  const fetchCauses = async () => {
    try {
      const response = await axiosInstance.get('/api/causes');
      setCauses(response.data);
      setLoading(false);
    } catch (error) {
      alert('Failed to fetch causes.');
      setLoading(false);
    }
  };

  const calculateProgress = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  useEffect(() => {
    const filterAndSortCauses = () => {
      let filtered = [...causes];

      if (selectedCategory !== 'all') {
        filtered = filtered.filter(cause => 
          cause.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }

      if (searchTerm) {
        filtered = filtered.filter(cause =>
          cause.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cause.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      switch (sortBy) {
        case 'progress':
          filtered.sort((a, b) => calculateProgress(b.currentAmount, b.goalAmount) - calculateProgress(a.currentAmount, a.goalAmount));
          break;
        case 'amount':
          filtered.sort((a, b) => b.goalAmount - a.goalAmount);
          break;
        case 'alphabetical':
          filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      setFilteredCauses(filtered);
    };

    filterAndSortCauses();
  }, [causes, selectedCategory, sortBy, searchTerm]);

  const handleCreateCause = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to create a cause.');
      return;
    }

    try {
      const response = await axiosInstance.post('/api/causes', newCause, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCauses([...causes, response.data]);
      setNewCause({
        title: '',
        description: '',
        goalAmount: '',
        category: '',
        image: ''
      });
      setShowCreateForm(false);
      alert('Cause created successfully!');
    } catch (error) {
      alert('Failed to create cause.');
    }
  };

  const handleDonate = async (causeId) => {
    const amount = donationAmounts[causeId];
    if (!amount || amount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    if (!user) {
      alert('Please login to donate.');
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/api/causes/${causeId}/donate`,
        { amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      setCauses(causes.map(cause => 
        cause._id === causeId ? response.data : cause
      ));
      setDonationAmounts({ ...donationAmounts, [causeId]: '' });
      alert('Thank you for your donation!');
    } catch (error) {
      alert('Failed to process donation.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing causes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Make a Difference Today</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Discover meaningful causes and help create positive change in communities around the world.
            </p>
            {user && (
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                {showCreateForm ? 'Cancel' : '+ Create New Cause'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search causes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="progress">Most Progress</option>
                <option value="amount">Highest Goal</option>
                <option value="alphabetical">A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <form onSubmit={handleCreateCause}>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Cause</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cause Title</label>
                  <input
                    type="text"
                    placeholder="Enter a compelling title"
                    value={newCause.title}
                    onChange={(e) => setNewCause({ ...newCause, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newCause.category}
                    onChange={(e) => setNewCause({ ...newCause, category: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Amount ($)</label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={newCause.goalAmount}
                    onChange={(e) => setNewCause({ ...newCause, goalAmount: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (optional)</label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={newCause.image}
                    onChange={(e) => setNewCause({ ...newCause, image: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Tell people why this cause matters and how their donations will help..."
                  value={newCause.description}
                  onChange={(e) => setNewCause({ ...newCause, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  required
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Create Cause
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredCauses.length} of {causes.length} causes
            {selectedCategory !== 'all' && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCauses.map((cause) => (
            <div key={cause._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              {cause.image ? (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={cause.image}
                    alt={cause.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {cause.category.charAt(0).toUpperCase() + cause.category.slice(1)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎯</div>
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {cause.category.charAt(0).toUpperCase() + cause.category.slice(1)}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 leading-tight">
                  {cause.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {cause.description}
                </p>
                
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Progress</span>
                    <span className="font-bold text-gray-800">
                      ${cause.currentAmount?.toLocaleString() || '0'} / ${cause.goalAmount?.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${calculateProgress(cause.currentAmount || 0, cause.goalAmount)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{calculateProgress(cause.currentAmount || 0, cause.goalAmount).toFixed(1)}% funded</span>
                    <span>{Math.max(0, cause.goalAmount - (cause.currentAmount || 0)).toLocaleString()} to go</span>
                  </div>
                </div>

                {user ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="number"
                          placeholder="Enter amount"
                          value={donationAmounts[cause._id] || ''}
                          onChange={(e) => setDonationAmounts({
                            ...donationAmounts,
                            [cause._id]: e.target.value
                          })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="1"
                        />
                      </div>
                      <button
                        onClick={() => handleDonate(cause._id)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        Donate
                      </button>
                    </div>
                    <div className="flex gap-2">
                      {[25, 50, 100].map(amount => (
                        <button
                          key={amount}
                          onClick={() => setDonationAmounts({
                            ...donationAmounts,
                            [cause._id]: amount.toString()
                          })}
                          className="flex-1 py-2 px-3 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm mb-3">
                      Please login to support this cause
                    </p>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      Login to Donate
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {causes.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No causes yet</h3>
            <p className="text-gray-500 text-lg mb-6">Be the first to create a meaningful cause!</p>
            {user && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Create First Cause
              </button>
            )}
          </div>
        )}

        {causes.length > 0 && filteredCauses.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No matching causes found</h3>
            <p className="text-gray-500 text-lg mb-6">
              Try adjusting your search terms or filters to find more causes.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
              {user && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Create New Cause
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Causes;