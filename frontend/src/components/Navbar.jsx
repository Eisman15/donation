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
    <nav className="bg-blue-600 text-white border-b border-blue-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="hover:text-blue-200">
            <Logo className="h-8 w-auto" textClassName="text-xl font-bold" />
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={isActive('/') ? 'text-blue-200' : 'hover:text-blue-200'}>
              Home
            </Link>
            <Link to="/causes" className={isActive('/causes') ? 'text-blue-200' : 'hover:text-blue-200'}>
              Causes
            </Link>
            
            {user ? (
              <>
                <Link to="/profile" className={isActive('/profile') ? 'text-blue-200' : 'hover:text-blue-200'}>
                  Profile
                </Link>
                
                {user.role === 'admin' && (
                  <>
                    <Link to="/donors" className={isActive('/donors') ? 'text-blue-200' : 'hover:text-blue-200'}>
                      All Donors
                    </Link>
                    <Link to="/admin-causes" className={isActive('/admin-causes') ? 'text-blue-200' : 'hover:text-blue-200'}>
                      Admin
                    </Link>
                  </>
                )}
                
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-blue-500">
                  <span className="text-sm">
                    {user.name} 
                    {user.role && <span className="ml-2 px-2 py-1 text-xs bg-blue-800">{user.role}</span>}
                  </span>
                  <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 text-sm">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="hover:text-blue-200">Login</Link>
                <Link to="/register" className="bg-green-500 hover:bg-green-600 px-3 py-1">Register</Link>
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
