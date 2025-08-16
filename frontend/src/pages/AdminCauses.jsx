import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AdminCauses = () => {
  const { user } = useAuth();
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCause, setNewCause] = useState({
    title: '',
    description: '',
    targetAmount: '',
    status: 'active'
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchCauses = async () => {
      try {
        const response = await axiosInstance.get('/api/causes');
        setCauses(response.data);
      } catch (error) {
        setError('Failed to fetch causes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchCauses();
    } else {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
    }
  }, [user]);

  const handleCreateCause = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/causes', newCause, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCauses([response.data, ...causes]);
      setNewCause({ title: '', description: '', targetAmount: '', status: 'active' });
      setShowCreateForm(false);
    } catch (error) {
      alert('Failed to create cause. Please try again.');
    }
  };

  const handleStatusUpdate = async (causeId, newStatus) => {
    try {
      await axiosInstance.put(`/api/causes/${causeId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setCauses(causes.map(cause => 
        cause._id === causeId ? { ...cause, status: newStatus } : cause
      ));
    } catch (error) {
      alert('Failed to update cause status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading causes...</div>
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
    <div className="max-w-6xl mx-auto mt-20 p-6">
      <div className="bg-white shadow-md rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Causes</h1>
            <p className="text-gray-600 mt-1">Create and manage fundraising causes</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            {showCreateForm ? 'Cancel' : 'Create New Cause'}
          </button>
        </div>
        
        {showCreateForm && (
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Cause</h3>
            <form onSubmit={handleCreateCause} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Cause Title"
                  value={newCause.title}
                  onChange={(e) => setNewCause({ ...newCause, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Target Amount ($)"
                  value={newCause.targetAmount}
                  onChange={(e) => setNewCause({ ...newCause, targetAmount: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                  min="1"
                />
              </div>
              <textarea
                placeholder="Cause Description"
                value={newCause.description}
                onChange={(e) => setNewCause({ ...newCause, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows="3"
                required
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Create Cause
              </button>
            </form>
          </div>
        )}
        
        {causes.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No causes found. Create your first cause!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cause
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {causes.map((cause) => (
                  <tr key={cause._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{cause.title}</div>
                        <div className="text-sm text-gray-500">{cause.description.substring(0, 100)}...</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${cause.targetAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        cause.status === 'active' ? 'bg-green-100 text-green-800' :
                        cause.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        cause.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {cause.status.charAt(0).toUpperCase() + cause.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(cause.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select
                        value={cause.status}
                        onChange={(e) => handleStatusUpdate(cause._id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="paused">Paused</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Total Causes: {causes.length}
            </div>
            <div className="text-sm text-gray-600">
              Active: {causes.filter(c => c.status === 'active').length} | 
              Completed: {causes.filter(c => c.status === 'completed').length} | 
              Paused: {causes.filter(c => c.status === 'paused').length} | 
              Cancelled: {causes.filter(c => c.status === 'cancelled').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCauses;