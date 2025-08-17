import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import Logo from '../components/Logo';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative w-full max-w-lg">
        {/* Register Card */}
        <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-700 px-8 py-8 text-center">
            <div className="flex justify-center mb-4">
              <Logo className="h-12 w-auto" textClassName="text-2xl font-bold text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Join HELPWISE</h1>
            <p className="text-purple-100">Create your account and start making a difference</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                  <span className="text-red-500">⚠️</span>
                  <span>{errors.general}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">👤</span>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                      errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm flex items-center space-x-1"><span>❌</span><span>{errors.name}</span></p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">📧</span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm flex items-center space-x-1"><span>❌</span><span>{errors.email}</span></p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">🔒</span>
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                </div>
                {errors.password && <p className="text-red-500 text-sm flex items-center space-x-1"><span>❌</span><span>{errors.password}</span></p>}
                <div className="text-xs text-gray-500 mt-1">
                  Password must be 8+ characters with uppercase, lowercase, and number
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">🔐</span>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                      errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm flex items-center space-x-1"><span>❌</span><span>{errors.confirmPassword}</span></p>}
              </div>

              <div className="flex items-start space-x-3 text-sm">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500" 
                  required
                />
                <label htmlFor="terms" className="text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-purple-600 hover:text-purple-800 font-medium">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-purple-600 hover:text-purple-800 font-medium">Privacy Policy</a>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>✨</span>
                    <span>Create Account</span>
                  </div>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-600 hover:text-purple-800 font-medium transition-colors">
                Sign in here
              </Link>
            </p>
            <div className="mt-4 text-xs text-gray-500">
              <Link to="/" className="hover:text-gray-700 transition-colors">← Back to Home</Link>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-6 text-purple-100 text-sm">
            <div className="flex items-center space-x-2">
              <span>🔒</span>
              <span>Secure Registration</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>⚡</span>
              <span>Instant Access</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🌟</span>
              <span>Join 50K+ Donors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
