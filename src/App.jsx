import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Schedule from './pages/Schedule';
import Auth from './pages/Auth';
import Membership from './pages/Membership';
import Tools from './pages/Tools';
import Profile from './pages/Profile'; 
import MyBookings from './pages/MyBookings'; 
import AdminPanel from './pages/AdminPanel';
import TrainerPanel from './pages/TrainerPanel';
import Exercises from './pages/Exercises';
import ProtectedRoute from './routes/ProtectedRoute';
import Contact from './pages/Contact';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/exercises" element={<Exercises />} />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        <Route path="/contact" element={<Contact />} />
        
        <Route 
          path="/my-bookings" 
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/trainer" 
          element={
            <ProtectedRoute requiredRole="trainer">
              <TrainerPanel />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;