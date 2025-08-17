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
    image: ''
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchCauses = async () => {
      try {
        const response = await axiosInstance.get('/api/causes');
        setCauses(response.data);
      } catch (error) {
        setError('Failed to fetch causes');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchCauses();
    } else {
      setError('Access denied');
      setLoading(false);
    }
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/causes', newCause, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setCauses([response.data, ...causes]);
      setNewCause({ title: '', description: '', targetAmount: '', image: '' });
      setShowForm(false);
    } catch (error) {
      alert('Failed to create cause');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/api/causes/${id}`, { status }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setCauses(causes.map(c => c._id === id ? { ...c, status } : c));
    } catch (error) {
      alert('Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this cause?')) {
      try {
        await axiosInstance.delete(`/api/causes/${id}`, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setCauses(causes.filter(c => c._id !== id));
        alert('Cause deleted successfully');
      } catch (error) {
        alert(`Delete failed: ${error.response?.data?.message || error.message}`);
      }
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded max-w-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Causes</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'New Cause'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Cause</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newCause.title}
                    onChange={(e) => setNewCause({ ...newCause, title: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
                  <input
                    type="number"
                    value={newCause.targetAmount}
                    onChange={(e) => setNewCause({ ...newCause, targetAmount: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={newCause.image}
                  onChange={(e) => setNewCause({ ...newCause, image: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newCause.description}
                  onChange={(e) => setNewCause({ ...newCause, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows="3"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Create Cause
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">All Causes ({causes.length})</h2>
            {causes.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No causes yet. Create your first cause!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Cause</th>
                      <th className="text-left py-2 px-4">Target</th>
                      <th className="text-left py-2 px-4">Status</th>
                      <th className="text-left py-2 px-4">Created</th>
                      <th className="text-left py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {causes.map((cause) => (
                      <tr key={cause._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            {cause.image && (
                              <img 
                                src={cause.image} 
                                alt={cause.title}
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <div>
                              <div className="font-medium">{cause.title}</div>
                              <div className="text-sm text-gray-500">{cause.description.substring(0, 50)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-green-600 font-medium">
                          ${(cause.targetAmount || cause.goalAmount || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={cause.status || 'active'}
                            onChange={(e) => updateStatus(cause._id, e.target.value)}
                            className="text-sm border rounded px-2 py-1"
                          >
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="paused">Paused</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(cause.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDelete(cause._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCauses;