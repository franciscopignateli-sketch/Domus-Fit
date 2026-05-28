import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserBookings } from '../services/gymApi'; // <-- Importamos a nova função!

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [nextClass, setNextClass] = useState(null); // Estado para guardar a próxima aula real

  useEffect(() => {
    const savedUser = localStorage.getItem('domus_user');
    
    if (!savedUser) {
      navigate('/login'); 
      return;
    } 

    const parsedUser = JSON.parse(savedUser);
    
    // Atualizamos para usar o ID real que vem da BD
    setUser({
      id: parsedUser.id, 
      name: parsedUser.name,
      email: parsedUser.email,
      plan: "Pro Member", // Vamos tornar isto real na fase das subscrições
      since: "Hoje",
      memberNumber: `DOMUS-${String(parsedUser.id).padStart(4, '0')}` // Ex: DOMUS-0012
    });

    // Função para carregar as reservas da base de dados
    const loadBookings = async () => {
      const data = await fetchUserBookings(parsedUser.id);
      
      if (data.success && data.bookings.length > 0) {
        // Como o PHP já ordena pela data mais próxima, a primeira aula (index 0) é a próxima!
        const upcoming = data.bookings[0];
        
        // Formatar a data e hora para ficar bonito no ecrã
        const dateObj = new Date(upcoming.class_datetime);
        const dateString = dateObj.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
        const timeString = dateObj.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

        setNextClass({
          name: upcoming.class_name,
          trainer: upcoming.trainer_name,
          date: `${dateString}, às ${timeString}`
        });
      }
    };

    loadBookings();

  }, [navigate]);

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
          
          {/* Cartão de Acesso (QR Code Real) */}
          <div className="bg-gym-dark p-8 rounded-xl border border-white/10 flex flex-col items-center text-center shadow-2xl">
            <h3 className="text-xl font-bold text-white uppercase mb-6">Passe de Entrada</h3>
            <div className="bg-white p-4 rounded-lg mb-4">
              <img 
                // O QR Code agora usa o ID real do utilizador!
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${user.memberNumber}`} 
                alt="QR Code" 
                className="w-40 h-40"
              />
            </div>
            <p className="text-sm text-gray-400 font-mono tracking-widest">{user.memberNumber}</p>
            <p className="text-xs text-gray-500 mt-2">Usa este código no torniquete.</p>
          </div>

          <div className="md:col-span-2 space-y-6">
            
            {/* Próximo Treino (Dinâmico) */}
            <div className="bg-linear-to-r from-gym-dark to-black p-6 rounded-xl border-l-4 border-gym-yellow">
              <h3 className="text-lg font-bold text-gray-400 uppercase mb-3">Próxima Aula</h3>
              <div className="flex justify-between items-end">
                <div>
                  {nextClass ? (
                    <>
                      <p className="text-2xl font-bold text-white">{nextClass.name}</p>
                      <p className="text-gray-300">{nextClass.date} • Com {nextClass.trainer}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-bold text-gray-500">Nenhuma aula agendada</p>
                      <p className="text-sm text-gray-400 mt-1">Ainda não marcaste o teu próximo treino.</p>
                    </>
                  )}
                </div>
                <Link to="/my-bookings" className="text-gym-yellow font-bold text-sm hover:underline cursor-pointer">
                  Ver Agenda &rarr;
                </Link>
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