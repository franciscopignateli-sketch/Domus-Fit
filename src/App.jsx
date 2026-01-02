import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import About from './About';
import Schedule from './Schedule';
import Auth from './Auth';
import Membership from './Membership';
import Tools from './Tools';
import Profile from './Profile'; // <--- 1. CONFIRMA SE ESTE IMPORT ESTÁ AQUI

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
        
        {/* 2. CONFIRMA SE ESTA LINHA EXISTE */}
        <Route path="/profile" element={<Profile />} /> 
        
        <Route path="/login" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;