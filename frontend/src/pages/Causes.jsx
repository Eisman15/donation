import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Causes = () => {
  const { user } = useAuth();
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCause, setNewCause] = useState({
    title: '',
    description: '',
    goalAmount: '',
    category: '',
    image: ''
  });
  const [donationAmounts, setDonationAmounts] = useState({});

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

  const calculateProgress = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  if (loading) {
    return <div className="container mx-auto p-6">Loading causes...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Donation Causes</h1>
        {user && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showCreateForm ? 'Cancel' : 'Create New Cause'}
          </button>
        )}
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateCause} className="bg-gray-100 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Cause</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Cause Title"
              value={newCause.title}
              onChange={(e) => setNewCause({ ...newCause, title: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={newCause.category}
              onChange={(e) => setNewCause({ ...newCause, category: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Goal Amount ($)"
              value={newCause.goalAmount}
              onChange={(e) => setNewCause({ ...newCause, goalAmount: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={newCause.image}
              onChange={(e) => setNewCause({ ...newCause, image: e.target.value })}
              className="p-2 border rounded"
            />
          </div>
          <textarea
            placeholder="Description"
            value={newCause.description}
            onChange={(e) => setNewCause({ ...newCause, description: e.target.value })}
            className="w-full p-2 border rounded mt-4"
            rows="3"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded mt-4 hover:bg-green-600"
          >
            Create Cause
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {causes.map((cause) => (
          <div key={cause._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {cause.image && (
              <img
                src={cause.image}
                alt={cause.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{cause.title}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {cause.category}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{cause.description}</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>${cause.currentAmount} / ${cause.goalAmount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${calculateProgress(cause.currentAmount, cause.goalAmount)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {calculateProgress(cause.currentAmount, cause.goalAmount).toFixed(1)}% funded
                </div>
              </div>

              {user && (
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={donationAmounts[cause._id] || ''}
                    onChange={(e) => setDonationAmounts({
                      ...donationAmounts,
                      [cause._id]: e.target.value
                    })}
                    className="flex-1 p-2 border rounded text-sm"
                    min="1"
                  />
                  <button
                    onClick={() => handleDonate(cause._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600"
                  >
                    Donate
                  </button>
                </div>
              )}

              {!user && (
                <p className="text-gray-500 text-sm text-center">
                  Please login to donate to this cause
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {causes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No causes available yet.</p>
          {user && (
            <p className="text-gray-400">Be the first to create a cause!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Causes;