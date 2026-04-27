import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importar useNavigate

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); // Hook para mudar de página

  const handleAuth = (e) => {
    e.preventDefault(); // Impede o recarregamento
    // Simulação: Se for Login, vai para o perfil
    // Futuramente, aqui ligarias à Base de Dados
    navigate('/profile'); 
  };

  return (
    <div className="min-h-screen bg-gym-black flex items-center justify-center p-6 pt-20">
      <div className="w-full max-w-md bg-gym-dark border border-white/10 p-8 rounded-xl shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gym-yellow"></div>

        <h2 className="text-3xl font-extrabold text-white text-center mb-8 uppercase italic">
          {isLogin ? 'Entrar na ' : 'Junta-te à '} 
          <span className="text-gym-yellow">Domus</span>
        </h2>

        {/* Adicionei o handleAuth no onSubmit */}
        <form className="space-y-6" onSubmit={handleAuth}>
          {!isLogin && (
            <div>
              <label className="block text-gray-400 text-sm mb-2">Nome Completo</label>
              <input type="text" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none transition-colors" placeholder="O teu nome" required />
            </div>
          )}
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">Email</label>
            <input type="email" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none transition-colors" placeholder="email@exemplo.com" required />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Password</label>
            <input type="password" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none transition-colors" placeholder="******" required />
          </div>

          <button className="w-full bg-gym-yellow text-gym-black font-bold py-3 rounded uppercase tracking-widest hover:bg-white transition-colors cursor-pointer mt-4">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-400 text-sm">
          {isLogin ? "Ainda não és membro?" : "Já tens conta?"}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-gym-yellow font-bold hover:underline cursor-pointer"
          >
            {isLogin ? "Regista-te aqui" : "Faz Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;