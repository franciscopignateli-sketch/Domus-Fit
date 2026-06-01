import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGymClasses, bookClass, cancelClass } from '../services/gymApi'; 

function Schedule() {
  const [classes, setClasses] = useState([]);
  const [loadingClassId, setLoadingClassId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // <-- Novo estado adicionado
  const navigate = useNavigate();
  
  const userString = localStorage.getItem('domus_user');
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setIsLoading(true); // Garante que mostra o "a carregar" sempre que faz fetch
    const data = await fetchGymClasses(user ? user.id : null);

    if (data.success) {
      const formattedClasses = data.classes.map(cls => {
        const dateObj = new Date(cls.class_datetime);
        
        // Formata a data (Ex: "01 jun")
        const dateString = dateObj.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
        // Formata a hora (Ex: "18:00")
        const timeString = dateObj.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
        
        return {
          id: cls.id,
          date: dateString,
          time: timeString,
          name: cls.class_name,
          trainer: cls.trainer_name,
          spots: cls.max_capacity - cls.current_bookings,
          booked: cls.is_booked > 0 
        };
      });
      setClasses(formattedClasses);
    }
    
    setIsLoading(false); // <-- Termina o loading quer haja aulas ou não!
  };

  const toggleBooking = async (cls) => {
    if (!user) {
      alert("Precisas de fazer login para reservar aulas!");
      navigate('/login');
      return;
    }

    setLoadingClassId(cls.id);

    let data;
    if (cls.booked) {
        data = await cancelClass(user.id, cls.id);
    } else {
        data = await bookClass(user.id, cls.id);
    }

    setLoadingClassId(null);

    if (data.success) {
      setClasses(classes.map(c => {
        if (c.id === cls.id) {
          return { 
            ...c, 
            booked: !c.booked,
            spots: c.booked ? c.spots + 1 : c.spots - 1 
          };
        }
        return c;
      }));
    } else {
      alert(data.message); 
      if (data.message === "Já tens o teu lugar marcado nesta aula!") {
          setClasses(classes.map(c => c.id === cls.id ? { ...c, booked: true } : c));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gym-black pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-extrabold text-white uppercase italic mb-8 border-l-4 border-gym-yellow pl-4">
          Agenda de <span className="text-gym-yellow">Aulas</span>
        </h1>

        <div className="space-y-4">
          {isLoading ? (
            <p className="text-gray-400 text-center py-10">A carregar aulas...</p>
          ) : classes.length === 0 ? (
            <div className="bg-gym-dark p-10 rounded-lg border border-white/5 text-center">
              <span className="block text-4xl mb-4">🗓️</span>
              <p className="text-gray-300 text-lg">De momento não existem aulas agendadas.</p>
              <p className="text-gray-500 mt-2">Volta mais tarde para veres as novidades do nosso horário!</p>
            </div>
          ) : (
            classes.map((cls) => (
              <div 
                key={cls.id} 
                className={`flex flex-col md:flex-row items-center justify-between p-6 rounded-lg border transition-all ${
                  cls.booked ? "bg-gym-yellow/10 border-gym-yellow" : "bg-gym-dark border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-6 mb-4 md:mb-0 w-full md:w-auto">
                  
                  <div className="text-xl font-bold text-gym-yellow font-mono text-center">
                    <div>{cls.date}</div>
                    <div className="text-2xl">{cls.time}</div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white uppercase">{cls.name}</h3>
                    <p className="text-gray-400 text-sm">Treinador: {cls.trainer}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden md:block">
                      <span className="block text-xs text-gray-500 uppercase tracking-widest">Vagas</span>
                      <span className={`font-bold ${cls.spots <= 0 ? "text-red-500" : "text-white"}`}>
                          {cls.spots <= 0 ? "Esgotado" : `${cls.spots} Livres`}
                      </span>
                  </div>

                  <button 
                    onClick={() => toggleBooking(cls)}
                    disabled={(cls.spots <= 0 && !cls.booked) || loadingClassId === cls.id}
                    className={`px-6 py-2 rounded font-bold uppercase tracking-wider text-sm transition-all cursor-pointer min-w-30 ${
                      cls.booked
                        ? "bg-transparent border border-gym-yellow text-gym-yellow hover:bg-red-500 hover:text-white hover:border-red-500"
                        : cls.spots <= 0
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                          : "bg-gym-yellow text-gym-black hover:bg-white hover:text-black"
                    } ${loadingClassId === cls.id ? "opacity-50 cursor-wait" : ""}`}
                  >
                    {loadingClassId === cls.id 
                        ? "Aguarde..." 
                        : cls.booked ? "Cancelar" : cls.spots <= 0 ? "Cheio" : "Reservar"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Schedule;