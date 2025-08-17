import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      title: "Browse Causes",
      description: "Find meaningful causes that align with your values and make a positive impact."
    },
    {
      title: "Make Donations", 
      description: "Support causes you care about with secure and transparent donations."
    },
    {
      title: "Track Impact",
      description: "See how your contributions are making a difference in real time."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Logo className="h-16 w-auto" textClassName="text-5xl font-light" />
          </div>
          <p className="text-xl mb-8 max-w-2xl mx-auto font-light">
            A simple platform connecting donors with meaningful causes
          </p>
          
          <div className="space-x-4">
            {user ? (
              <Link to="/causes" className="bg-white text-blue-600 px-8 py-3 font-medium hover:bg-gray-50 transition-colors">
                Explore Causes
              </Link>
            ) : (
              <>
                <Link to="/register" className="bg-white text-blue-600 px-8 py-3 font-medium hover:bg-gray-50 transition-colors mr-4">
                  Register Now
                </Link>
                <Link to="/causes" className="border border-white px-8 py-3 font-medium hover:bg-white hover:text-blue-600 transition-colors">
                  Browse Causes
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12 text-gray-800">How it works</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">{index + 1}</span>
                </div>
                <h3 className="text-xl font-medium mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <blockquote className="text-2xl font-light text-gray-700 mb-4 max-w-3xl mx-auto leading-relaxed">
            "The best way to find yourself is to lose yourself in the service of others."
          </blockquote>
          <cite className="text-gray-500 italic">— Mahatma Gandhi</cite>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-medium mb-3">HELPWISE</h3>
              <p className="text-gray-400">Making charitable giving simple and transparent</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Quick Links</h4>
              <ul className="text-gray-400 space-y-2">
                <li><Link to="/causes" className="hover:text-white transition-colors">Browse Causes</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Contact</h4>
              <p className="text-gray-400">info@helpwise.com</p>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-8 border-t border-gray-700">
            <p className="text-gray-400">&copy; 2024 HELPWISE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;