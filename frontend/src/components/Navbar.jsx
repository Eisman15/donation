import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

// This component creates the navigation bar at the top of every page
const Navbar = () => {
  // Get user info and logout function from auth context
  const { user, logout } = useAuth();
  // Hook to navigate to different pages
  const navigate = useNavigate();
  // Hook to know which page we're currently on
  const location = useLocation();

  // Function that runs when user clicks logout button
  const handleLogout = () => {
    // Clear user session
    logout();
    // Send user back to login page
    navigate('/login');
  };

  // Helper function to check if we're on a specific page (for highlighting nav links)
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <Logo className="h-8 w-auto" textClassName="text-2xl font-bold" />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={isActive('/') ? 'bg-blue-800 px-3 py-2 rounded' : 'hover:bg-blue-500 px-3 py-2 rounded'}>
              Home
            </Link>
            <Link to="/causes" className={isActive('/causes') ? 'bg-blue-800 px-3 py-2 rounded' : 'hover:bg-blue-500 px-3 py-2 rounded'}>
              Causes
            </Link>
            
            {user ? (
              <>
                <Link to="/profile" className={isActive('/profile') ? 'bg-blue-800 px-3 py-2 rounded' : 'hover:bg-blue-500 px-3 py-2 rounded'}>
                  Profile
                </Link>
                
                {user.role === 'admin' && (
                  <>
                    <Link to="/donors" className={isActive('/donors') ? 'bg-blue-800 px-3 py-2 rounded' : 'hover:bg-blue-500 px-3 py-2 rounded'}>
                      All Donors
                    </Link>
                    <Link to="/admin-causes" className={isActive('/admin-causes') ? 'bg-blue-800 px-3 py-2 rounded' : 'hover:bg-blue-500 px-3 py-2 rounded'}>
                      Admin
                    </Link>
                  </>
                )}
                
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-blue-500">
                  <span className="text-sm">
                    {user.name} 
                    {user.role && <span className="ml-2 px-2 py-1 text-xs bg-blue-800 rounded">{user.role}</span>}
                  </span>
                  <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="px-4 py-2 hover:text-blue-200">Login</Link>
                <Link to="/register" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">Register</Link>
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
