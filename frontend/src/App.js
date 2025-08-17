import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorProfilePage from './pages/DonorProfilePage';
import Causes from './pages/Causes';
import AllDonors from './pages/AllDonors';
import AdminCauses from './pages/AdminCauses';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<DonorProfilePage />} />
        <Route path="/causes" element={<Causes />} />
        <Route path="/donors" element={<AllDonors />} />
        <Route path="/admin-causes" element={<AdminCauses />} />
      </Routes>
    </Router>
  );
}

export default App;
