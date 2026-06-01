import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTrainerAgenda } from '../services/gymApi';

function TrainerPanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('domus_user'));
    
    // Proteção dupla: Só treinadores entram aqui
    if (!localUser || localUser.role !== 'trainer') {
      navigate('/');
      return;
    }
    
    setUser(localUser);
    loadAgenda(localUser.id);
  }, [navigate]);

  const loadAgenda = async (userId) => {
    const data = await fetchTrainerAgenda(userId);
    if (data.success) {
      setClasses(data.classes);
    }
    setIsLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gym-black pt-24 pb-12 px-6 relative">
      <div className="container mx-auto max-w-4xl">
        
        {/* Cabeçalho do Treinador */}
        <div className="flex items-center gap-6 mb-12 bg-gym-dark p-8 rounded-xl border border-white/5">
          <div className="w-20 h-20 bg-gray-700 rounded-full overflow-hidden border-2 border-gym-yellow shrink-0">
             <img src={user.photo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} alt="Trainer" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white uppercase italic">Olá, <span className="text-gym-yellow">{user.name}</span>!</h1>
            <p className="text-gray-400">Aqui tens a tua agenda e a lotação das tuas turmas.</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-2">
          <span>📅</span> As Minhas Próximas Aulas
        </h2>

        {isLoading ? (
          <p className="text-gray-400">A carregar a tua agenda...</p>
        ) : classes.length === 0 ? (
          <div className="bg-gym-dark p-8 rounded-xl border border-white/5 text-center">
            <p className="text-gray-400">Não tens nenhuma aula agendada de momento. Aproveita o descanso! 🏖️</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((c) => {
              const dateObj = new Date(c.class_datetime);
              const percentage = (c.booked_count / c.max_capacity) * 100;
              const isFull = c.booked_count >= c.max_capacity;

              return (
                <div key={c.id} className="bg-gym-dark p-6 rounded-xl border border-white/10 hover:border-gym-yellow/50 transition-colors shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase">{c.class_name}</h3>
                      <p className="text-gym-yellow font-medium mt-1">
                        {dateObj.toLocaleDateString('pt-PT', { weekday: 'long', day: '2-digit', month: 'long' })}
                      </p>
                      <p className="text-gray-400 flex items-center gap-2 mt-1">
                        <span>⏰</span> {dateObj.toLocaleTimeString('pt-PT', {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    {isFull && (
                      <span className="bg-red-500/20 text-red-500 text-xs font-bold px-2 py-1 rounded uppercase">Lotada</span>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5">
                    <div className="flex justify-between text-sm text-gray-400 mb-2 font-bold uppercase">
                      <span>Alunos Inscritos</span>
                      <span className={isFull ? 'text-red-400' : 'text-white'}>
                        {c.booked_count} / {c.max_capacity}
                      </span>
                    </div>
                    <div className="w-full bg-black/50 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${isFull ? 'bg-red-500' : 'bg-gym-yellow'}`} 
                        style={{ width: `${Math.min(percentage, 100)}%` }}>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default TrainerPanel;