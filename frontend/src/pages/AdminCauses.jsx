import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AdminCauses = () => {
  const { user } = useAuth();

  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newCause, setNewCause] = useState({
    title: '',
    description: '',
    targetAmount: '',
    image: '',
  });

  const authHeader = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
  const asNumber = (v) => {
    const n = Number.parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };

  useEffect(() => {
    const fetchCauses = async () => {
      try {
        const res = await axiosInstance.get('/api/causes', { headers: authHeader });
        setCauses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch causes');
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
      const payload = {
        title: newCause.title.trim(),
        description: newCause.description.trim(),
        image: newCause.image?.trim() || undefined,
        targetAmount: asNumber(newCause.targetAmount),
      };
      const res = await axiosInstance.post('/api/causes', payload, { headers: authHeader });
      setCauses((prev) => [res.data, ...prev]);
      setNewCause({ title: '', description: '', targetAmount: '', image: '' });
      setShowForm(false);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create cause');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cause?')) return;
    try {
      await axiosInstance.delete(`/api/causes/${id}`, { headers: authHeader });
      setCauses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <div className="p-20 text-center">Loading causes...</div>;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-200 text-red-700 px-6 py-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Manage Causes</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Create, edit, and remove causes shown to donors.
            </p>
            <p className="text-lg">Total Causes: {causes.length}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowForm((s) => !s)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {showForm ? 'Cancel' : 'New Cause'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Cause</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={newCause.title}
                    onChange={(e) => setNewCause((c) => ({ ...c, title: e.target.value }))}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Target Amount"
                    value={newCause.targetAmount}
                    onChange={(e) => setNewCause((c) => ({ ...c, targetAmount: e.target.value }))}
                    className="w-full p-2 border rounded"
                    step="0.01"
                    min="0"
                    required
                  />
                  <input
                    type="url"
                    placeholder="Image URL (optional)"
                    value={newCause.image}
                    onChange={(e) => setNewCause((c) => ({ ...c, image: e.target.value }))}
                    className="w-full p-2 border rounded md:col-span-2"
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={newCause.description}
                  onChange={(e) => setNewCause((c) => ({ ...c, description: e.target.value }))}
                  className="w-full p-2 border rounded"
                  rows={3}
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded-md border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {causes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No causes available</h3>
            <p className="text-gray-500 text-lg">Create your first cause to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {causes.map((cause) => {
              const amt = asNumber(cause.targetAmount ?? cause.goalAmount ?? 0);
              const desc = cause.description || '';
              return (
                <div key={cause._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {cause.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={cause.image}
                        alt={cause.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{cause.title}</h3>

                    <p className="text-gray-600 mb-4">
                      {desc.length > 160 ? `${desc.slice(0, 160)}…` : desc}
                    </p>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Target Amount</span>
                        <span className="font-semibold">${amt.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Created: {cause.createdAt ? new Date(cause.createdAt).toLocaleDateString() : '—'}
                      </div>
                      <button
                        onClick={() => handleDelete(cause._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        title="Delete cause"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCauses;
