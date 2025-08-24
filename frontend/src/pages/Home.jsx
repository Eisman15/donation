import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Home = () => {
  const { user } = useAuth();


  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-blue-600 text-white overflow-hidden">
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 flex justify-center">
              <Logo className="h-16 w-auto" textClassName="text-4xl font-bold" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Make a Difference Today
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 leading-relaxed">
              Connecting you to meaningful causes. Support campaigns, track progress, and build a better world together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <>
                  <Link 
                    to="/causes" 
                    className="bg-cyan-500 hover:bg-cyan-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Browse Causes
                  </Link>
           
                </>
              ) : (
                <>
                  <Link 
                    to="/register" 
                    className="bg-cyan-500 hover:bg-cyan-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Register Now
                  </Link>
                  <Link 
                    to="/causes" 
                    className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
                  >
                    Explore Causes
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

   

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Support HELPWISE?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make it simple to create meaningful change. Our platform connects hearts to causes that matters.
            </p>
          </div>         
        </div>
      </section>

      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <blockquote className="text-3xl md:text-4xl font-light text-gray-700 italic mb-6 max-w-4xl mx-auto">
            "The best way to find yourself is to lose yourself in the service of others."
          </blockquote>
          <cite className="text-lg text-gray-500 font-medium">— Mahatma Gandhi</cite>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <Logo className="h-10 w-auto mb-4" textClassName="text-2xl font-bold" />
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering communities to create positive change through meaningful donations and supporting impactful campaigns.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                  <span className="text-sm">t</span>
                </div>
                <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors cursor-pointer">
                  <span className="text-sm">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/causes" className="hover:text-white transition-colors">Browse Causes</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">How It Works</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Success Stories</span></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><span className="hover:text-white transition-colors cursor-pointer">Help Center</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Contact Us</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HELPWISE</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;