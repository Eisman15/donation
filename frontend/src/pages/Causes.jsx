import { useState, useEffect } from 'react';
import { getCauses } from '../services/causeService';
import CauseForm from '../components/CauseForm';

const Causes = () => {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCauses();
  }, []);

  const fetchCauses = async () => {
    try {
      const data = await getCauses();
      setCauses(data);
    } catch (error) {
      setError('Failed to fetch causes');
    } finally {
      setLoading(false);
    }
  };

  const handleCauseCreated = (newCause) => {
    setCauses([...causes, newCause]);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading causes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Our Causes</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Discover meaningful causes and help create positive change in communities around the world.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Create New Cause
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Cause</h2>
            <CauseForm 
              onSubmit={handleCauseCreated}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {causes.map((cause) => (
            <div key={cause._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{cause.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    cause.status === 'active' ? 'bg-green-100 text-green-800' :
                    cause.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    cause.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {cause.status.charAt(0).toUpperCase() + cause.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{cause.description}</p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Target Amount</span>
                    <span className="font-semibold">${cause.targetAmount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Created: {new Date(cause.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {causes.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No causes yet</h3>
            <p className="text-gray-500 text-lg mb-6">
              Be the first to create a meaningful cause!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Create First Cause
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Causes;