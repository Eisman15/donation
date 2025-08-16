import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <Logo className="h-8 w-auto" textClassName="text-2xl font-bold" />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') ? 'bg-blue-800 text-white' : 'hover:bg-blue-500'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/causes" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/causes') ? 'bg-blue-800 text-white' : 'hover:bg-blue-500'
              }`}
            >
              Browse Causes
            </Link>
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/profile') ? 'bg-blue-800 text-white' : 'hover:bg-blue-500'
                  }`}
                >
                  My Profile
                </Link>
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-blue-500">
                  <span className="text-sm text-blue-200">Welcome, {user.name || user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-medium hover:text-blue-200 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button className="text-white hover:text-blue-200 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
