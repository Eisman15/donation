import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
  const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    setLoading(true);
    
    try {
      const { confirmPassword, ...registrationData } = formData;
      await axiosInstance.post('/api/auth/register', registrationData);
    
      navigate('/login', { 
        state: { 
          message: 'Your registration is successful! Please log in.' 
        }
      });
    } catch (error) {
      
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <div className="bg-white rounded-xl shadow-lg border-0 p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>
          
          <form onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-4 rounded-md">
                {errors.general}
              </div>
            )}

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Name:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your full name"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Password:</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Password"
              />
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              <small className="text-gray-600">8+ chars, uppercase, lowercase, number</small>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Confirm Password:</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm password"
              />
              {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input type="checkbox" required className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                <span className="text-sm text-gray-600">I agree to terms and conditions</span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-md disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-gray-100">
            <p>Already have an account? <Link to="/login" className="text-blue-600 underline">Login</Link></p>
            <p className="text-sm mt-2"><Link to="/" className="text-gray-500 underline">← Home</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
