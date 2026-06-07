import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/Logo_Trans.png';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogged, setIsLogged] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Verifica o estado de autenticação lendo o localStorage sempre que a rota da aplicação muda
  useEffect(() => {
    const userString = localStorage.getItem('domus_user');
    if (userString) {
      const user = JSON.parse(userString);
      setIsLogged(true);
      setUserRole(user.role);
    } else {
      setIsLogged(false);
      setUserRole(null);
    }
  }, [location]);

  // Garante que o menu mobile é fechado ao navegar para uma nova página
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Limpa a sessão local e redireciona para a página de entrada
  const handleLogout = () => {
    localStorage.removeItem('domus_user');
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gym-black/95 backdrop-blur-md text-white p-4 fixed w-full z-50 border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center relative">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Domus Fit Logo" className="h-13 w-auto hover:scale-105 transition-transform" />
        </Link>
        
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="md:hidden text-white hover:text-gym-yellow transition-colors focus:outline-none"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

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

          {isLogged && userRole === 'admin' && (
            <Link to="/admin" className="text-gym-yellow font-bold hover:underline transition-all underline-offset-4 decoration-2">
              Painel Admin
            </Link>
          )}

          {isLogged && userRole === 'trainer' && (
            <Link to="/trainer" className="text-gym-yellow font-bold hover:underline transition-all underline-offset-4 decoration-2">
              Agenda Treinador
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

        {isMenuOpen && (
          <div className="absolute top-15 left-0 w-full bg-gym-black/95 border-b border-white/10 md:hidden flex flex-col p-6 gap-6 shadow-2xl animate-fade-in z-50">
            <Link to="/" className="hover:text-gym-yellow font-bold uppercase tracking-wider transition-all">Home</Link>
            <Link to="/about" className="hover:text-gym-yellow font-bold uppercase tracking-wider transition-all">About</Link>
            <Link to="/schedule" className="hover:text-gym-yellow font-bold uppercase tracking-wider transition-all">Agendar</Link>
            <Link to="/membership" className="hover:text-gym-yellow font-bold uppercase tracking-wider transition-all">Planos</Link>
            <Link to="/tools" className="hover:text-gym-yellow font-bold uppercase tracking-wider transition-all">Ferramentas</Link>
            <Link to="/exercises" className="hover:text-gym-yellow font-bold uppercase tracking-wider transition-all">Exercícios</Link>
            
            {isLogged && (
              <Link to="/profile" className="hover:text-gym-yellow font-bold uppercase tracking-wider transition-all border-t border-white/10 pt-4">Meu Perfil</Link>
            )}

            {isLogged && userRole === 'admin' && (
              <Link to="/admin" className="text-gym-yellow font-bold uppercase tracking-wider hover:underline">
                Painel Administração
              </Link>
            )}

            {isLogged && userRole === 'trainer' && (
              <Link to="/trainer" className="text-gym-yellow font-bold uppercase tracking-wider hover:underline">
                Agenda de Treinador
              </Link>
            )}
            
            <div className="pt-4 mt-2 border-t border-white/10">
              {isLogged ? (
                <button 
                  onClick={handleLogout}
                  className="w-full py-3 bg-red-500 text-white rounded font-bold uppercase tracking-widest cursor-pointer"
                >
                  Terminar Sessão
                </button>
              ) : (
                <Link to="/login" className="block text-center w-full py-3 bg-gym-yellow text-gym-black rounded font-bold uppercase tracking-widest">
                  Fazer Login
                </Link>
              )}
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;