import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCauses } from '../services/causeService';

const Causes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCauses();
  }, []);

  const fetchCauses = async () => {
    try {
      const data = await getCauses();
      setCauses(data);
    } catch (error) {
      setError('Failed to load causes');
    } finally {
      setLoading(false);
    }
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
      <div className="container mx-auto p-4">
        <div className="text-center mt-8">Loading causes...</div>
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
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Browse Causes</h1>
          <p className="text-lg">Find causes you care about and make a difference.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">

        <div>
          {causes.length === 0 ? (
            <div className="text-center py-12 bg-white border border-gray-300">
              <h3 className="text-lg font-bold mb-2">No causes found</h3>
              <p>No causes available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {causes.map((cause) => (
                <div key={cause._id} className="bg-white border border-gray-300 p-4">
                  {cause.image && (
                    <div className="mb-3">
                      <img 
                        src={cause.image} 
                        alt={cause.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  
                  <h3 className="font-bold text-lg mb-2">{cause.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{cause.description.substring(0, 100)}...</p>
                  
                  <div className="mb-3">
                    <div className="text-sm text-gray-600">Target: 
                      <span className="font-bold text-green-600">
                        ${(cause.targetAmount || cause.goalAmount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      {new Date(cause.createdAt).toLocaleDateString()}
                    </div>
                    <button
                      onClick={() => handleSupport(cause)}
                      className="bg-blue-500 text-white px-4 py-2 text-sm"
                    >
                      {user ? 'Donate' : 'Support'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          {causes.length} causes available
        </div>
      </div>
    </div>
  );
};

export default Causes;