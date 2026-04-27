import { Link } from 'react-router-dom';

function Navbar() {
  return (
    // Mudei bg-slate-900 para bg-gym-black/90 (com transparência) e adicionei backdrop-blur
    <nav className="bg-gym-black/90 backdrop-blur-md text-white p-4 fixed w-full z-50 border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo agora é amarelo */}
        <Link to="/" className="text-2xl font-extrabold tracking-tighter text-gym-yellow uppercase italic">
          Domus Fit
        </Link>
        
        <div className="hidden md:flex gap-8 font-semibold uppercase text-sm tracking-wider items-center">
          <Link to="/" className="hover:text-gym-yellow transition-all">Home</Link>
          <Link to="/about" className="hover:text-gym-yellow transition-all">About</Link>
          <Link to="/schedule" className="hover:text-gym-yellow transition-all">Agendar</Link>
          <Link to="/membership" className="hover:text-gym-yellow transition-all">Planos</Link>
          <Link to="/tools" className="hover:text-gym-yellow transition-all">Ferramentas</Link>
          <Link to="/profile" className="hover:text-gym-yellow transition-all">Perfil</Link>
          
          {/* Botão de Login destacado */}
          <Link to="/login" className="px-5 py-2 border-2 border-gym-yellow text-gym-yellow hover:bg-gym-yellow hover:text-black transition-colors rounded font-bold">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;