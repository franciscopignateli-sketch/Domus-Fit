import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogged, setIsLogged] = useState(false);
  const [userRole, setUserRole] = useState(null); // Guardar o papel do utilizador

  useEffect(() => {
    const userString = localStorage.getItem('domus_user');
    if (userString) {
      const user = JSON.parse(userString);
      setIsLogged(true);
      setUserRole(user.role); // 'user', 'trainer' ou 'admin'
    } else {
      setIsLogged(false);
      setUserRole(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('domus_user');
    navigate('/login');
  };

  return (
    <nav className="bg-gym-black/90 backdrop-blur-md text-white p-4 fixed w-full z-50 border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold tracking-tighter text-gym-yellow uppercase italic">
          Domus Fit
        </Link>
        
        <div className="hidden md:flex gap-8 font-semibold uppercase text-sm tracking-wider items-center">
          <Link to="/" className="hover:text-gym-yellow transition-all">Home</Link>
          <Link to="/about" className="hover:text-gym-yellow transition-all">About</Link>
          <Link to="/schedule" className="hover:text-gym-yellow transition-all">Agendar</Link>
          <Link to="/membership" className="hover:text-gym-yellow transition-all">Planos</Link>
          <Link to="/tools" className="hover:text-gym-yellow transition-all">Ferramentas</Link>
          <Link to="/exercises" className="hover:text-gym-yellow transition-all">Exercícios</Link>
          
          {isLogged && (
            <Link to="/profile" className="hover:text-gym-yellow transition-all">Perfil</Link>
          )}

          {/* SÓ MOSTRA SE O UTILIZADOR FOR ADMIN */}
          {isLogged && userRole === 'admin' && (
            <Link to="/admin" className="text-gym-yellow font-bold hover:underline transition-all underline-offset-4 decoration-2">
              Painel Admin
            </Link>
          )}

          {/* SÓ MOSTRA SE FOR TREINADOR */}
          {isLogged && userRole === 'trainer' && (
            <Link to="/trainer" className="text-gym-yellow font-bold hover:underline transition-all underline-offset-4 decoration-2">
              Agenda do Treinador
            </Link>
          )}
          
          {isLogged ? (
            <button 
              onClick={handleLogout}
              className="px-5 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors rounded font-bold cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="px-5 py-2 border-2 border-gym-yellow text-gym-yellow hover:bg-gym-yellow hover:text-black transition-colors rounded font-bold">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;