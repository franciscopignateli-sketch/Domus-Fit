import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Tenta ir buscar o utilizador ao localStorage
    const savedUser = localStorage.getItem('domus_user');
    
    if (!savedUser) {
      // Se não existir, expulsa para a página de login
      navigate('/login'); 
    } else {
      // Se existir, converte o texto guardado de volta para um objeto
      const parsedUser = JSON.parse(savedUser);
      
      // Juntamos os dados reais da BD com os dados fictícios do ginásio
      setUser({
        name: parsedUser.name,
        email: parsedUser.email,
        plan: "Pro Member",
        since: "Hoje",
        id: "DOMUS-" + Math.floor(1000 + Math.random() * 9000) // Gera um ID aleatório
      });
    }
  }, [navigate]);

  // Enquanto verifica o login, não mostra nada para não piscar o ecrã
  if (!user) return null; 

  return (
    <div className="min-h-screen bg-gym-black pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-5xl">
        
        {/* Cabeçalho */}
        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 bg-gray-700 rounded-full overflow-hidden border-2 border-gym-yellow">
             <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" alt="User" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Olá, {user.name}</h1>
            <p className="text-gray-400">Membro desde {user.since} • <span className="text-gym-yellow font-bold">{user.plan}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Cartão de Acesso (QR Code) */}
          <div className="bg-gym-dark p-8 rounded-xl border border-white/10 flex flex-col items-center text-center shadow-2xl">
            <h3 className="text-xl font-bold text-white uppercase mb-6">Passe de Entrada</h3>
            <div className="bg-white p-4 rounded-lg mb-4">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${user.id}`} 
                alt="QR Code" 
                className="w-40 h-40"
              />
            </div>
            <p className="text-sm text-gray-400 font-mono tracking-widest">{user.id}</p>
            <p className="text-xs text-gray-500 mt-2">Usa este código no torniquete.</p>
          </div>

          {/* Estatísticas Rápidas (Barras CSS simples) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Próximo Treino */}
            <div className="bg-linear-to-r from-gym-dark to-black p-6 rounded-xl border-l-4 border-gym-yellow">
              <h3 className="text-lg font-bold text-gray-400 uppercase mb-1">Próxima Aula</h3>
              <div className="flex justify-between items-end">
                <div>
                   <p className="text-2xl font-bold text-white">Cross Training</p>
                   <p className="text-gray-300">Hoje, 18:00 • Com João Silva</p>
                </div>
                <button className="text-gym-yellow font-bold text-sm hover:underline cursor-pointer">Ver Agenda &rarr;</button>
              </div>
            </div>

            {/* Evolução de Cargas (Mock) */}
            <div className="bg-gym-dark p-8 rounded-xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-6">Minhas Metas</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Frequência Semanal</span>
                    <span className="text-gym-yellow font-bold">3/5 Treinos</span>
                  </div>
                  <div className="w-full bg-gray-700 h-2 rounded-full">
                    <div className="bg-gym-yellow h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Meta Peso (Deadlift)</span>
                    <span className="text-gym-yellow font-bold">120kg / 140kg</span>
                  </div>
                  <div className="w-full bg-gray-700 h-2 rounded-full">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="grid grid-cols-2 gap-4">
                <Link to="/schedule" className="bg-white/5 hover:bg-white/10 p-4 rounded-lg text-center border border-dashed border-gray-600 hover:border-gym-yellow transition-colors cursor-pointer">
                    <span className="block text-2xl mb-1">📅</span>
                    <span className="text-sm font-bold text-gray-300">Marcar Aula</span>
                </Link>
                <Link to="/tools" className="bg-white/5 hover:bg-white/10 p-4 rounded-lg text-center border border-dashed border-gray-600 hover:border-gym-yellow transition-colors cursor-pointer">
                    <span className="block text-2xl mb-1">⚖️</span>
                    <span className="text-sm font-bold text-gray-300">Calculadoras</span>
                </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;