import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Schedule from './pages/Schedule';
import Auth from './pages/Auth';
import Membership from './pages/Membership';
import Tools from './pages/Tools';
import Profile from './pages/Profile'; 

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/tools" element={<Tools />} />
        
        <Route path="/profile" element={<Profile />} /> 
        
        <Route path="/login" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;