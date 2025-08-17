import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCauses } from '../services/causeService';

const Causes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [causes, setCauses] = useState([]);
  const [filteredCauses, setFilteredCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchCauses();
  }, []);

  const fetchCauses = async () => {
    try {
      const data = await getCauses();
      setCauses(data);
      setFilteredCauses(data);
    } catch (error) {
      setError('Failed to load causes');
    } finally {
      setLoading(false);
    }
  };

  // Search and filter functionality
  useEffect(() => {
    let filtered = [...causes];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(cause =>
        cause.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cause.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(cause => cause.status === filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'amount':
          return (b.targetAmount || b.goalAmount || 0) - (a.targetAmount || a.goalAmount || 0);
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredCauses(filtered);
  }, [causes, searchTerm, filterStatus, sortBy]);

  const getCauseStats = () => {
    return {
      total: causes.length,
      active: causes.filter(c => c.status === 'active').length,
      completed: causes.filter(c => c.status === 'completed').length,
      totalTarget: causes.reduce((sum, c) => sum + (c.targetAmount || c.goalAmount || 0), 0)
    };
  };

  const handleSupport = (cause) => {
    if (!user) {
      navigate('/login', { state: { from: `/causes/${cause._id}` } });
    } else {
      navigate(`/donate/${cause._id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Loading causes...</div>
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

  const stats = getCauseStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Make a Difference</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
              Discover meaningful causes and join thousands of people creating positive change in the world.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">{stats.active}</div>
                <div className="text-blue-200">Active Causes</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{stats.completed}</div>
                <div className="text-blue-200">Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold">${stats.totalTarget.toLocaleString()}</div>
                <div className="text-blue-200">Target Amount</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Control Panel */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400 text-lg">🔍</span>
                  <input
                    type="text"
                    placeholder="Search causes by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Filters and Controls */}
              <div className="flex items-center space-x-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="recent">Latest First</option>
                  <option value="title">Alphabetical</option>
                  <option value="amount">Highest Amount</option>
                </select>

                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'list' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="p-6">
            {filteredCauses.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No causes found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCauses.map((cause) => (
                  <div key={cause._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    {cause.image && (
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={cause.image} 
                          alt={cause.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-lg ${
                            cause.status === 'active' ? 'bg-green-500 text-white' :
                            cause.status === 'completed' ? 'bg-blue-500 text-white' :
                            cause.status === 'paused' ? 'bg-yellow-500 text-white' :
                            'bg-red-500 text-white'
                          }`}>
                            {cause.status.charAt(0).toUpperCase() + cause.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{cause.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{cause.description}</p>
                      
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-600">Target Amount</span>
                          <span className="text-lg font-bold text-green-600">
                            ${(cause.targetAmount || cause.goalAmount || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{width: '45%'}}></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">45% funded</div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          Created {new Date(cause.createdAt).toLocaleDateString()}
                        </div>
                        <button
                          onClick={() => handleSupport(cause)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                        >
                          {user ? 'Donate Now' : 'Support'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCauses.map((cause) => (
                  <div key={cause._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                    <div className="flex">
                      {cause.image && (
                        <div className="w-48 h-32 flex-shrink-0">
                          <img 
                            src={cause.image} 
                            alt={cause.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{cause.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            cause.status === 'active' ? 'bg-green-100 text-green-800' :
                            cause.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            cause.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {cause.status.charAt(0).toUpperCase() + cause.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-2">{cause.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div className="text-sm">
                              <span className="text-gray-600">Target: </span>
                              <span className="font-semibold text-green-600">
                                ${(cause.targetAmount || cause.goalAmount || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(cause.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <button
                            onClick={() => handleSupport(cause)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                          >
                            {user ? 'Donate Now' : 'Support'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div>
                Showing {filteredCauses.length} of {causes.length} causes
              </div>
              <div>
                Join thousands making a difference
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Causes;