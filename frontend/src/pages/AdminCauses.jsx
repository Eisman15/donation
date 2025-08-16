import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AdminCauses = () => {
  const { user } = useAuth();
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCause, setNewCause] = useState({ title: '', description: '', targetAmount: '' });
  const [showForm, setShowForm] = useState(false);

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

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/causes', newCause, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCauses([response.data, ...causes]);
      setNewCause({ title: '', description: '', targetAmount: '' });
      setShowForm(false);
    } catch (error) {
      alert('Failed to create cause');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/api/causes/${id}`, { status }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setCauses(causes.map(c => c._id === id ? { ...c, status } : c));
    } catch (error) {
      alert('Update failed');
    }
  };

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (error) return <div className="p-20 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto mt-20 p-6">
      <div className="bg-white shadow-md rounded-lg">
        <div className="p-6 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Causes</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {showForm ? 'Cancel' : 'New Cause'}
          </button>
        </div>
        
        {showForm && (
          <div className="p-6 border-b bg-gray-50">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={newCause.title}
                  onChange={(e) => setNewCause({ ...newCause, title: e.target.value })}
                  className="p-3 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Target Amount"
                  value={newCause.targetAmount}
                  onChange={(e) => setNewCause({ ...newCause, targetAmount: e.target.value })}
                  className="p-3 border rounded"
                  required
                />
              </div>
              <textarea
                placeholder="Description"
                value={newCause.description}
                onChange={(e) => setNewCause({ ...newCause, description: e.target.value })}
                className="w-full p-3 border rounded"
                rows="3"
                required
              />
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
                Create
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
                        onChange={(e) => updateStatus(cause._id, e.target.value)}
                        className="border rounded px-2 py-1"
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