import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGymClasses, bookClass, cancelClass } from '../services/gymApi'; 
import CustomModal from '../components/layout/CustomModal';

function Schedule() {
  const [classes, setClasses] = useState([]);
  const [loadingClassId, setLoadingClassId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });
  
  const [filterModality, setFilterModality] = useState('');
  const [filterTrainer, setFilterTrainer] = useState('');
  
  const userString = localStorage.getItem('domus_user');
  const user = userString ? JSON.parse(userString) : null;
  const isClient = !user || user.role === 'user';

  useEffect(() => {
    let isMounted = true;

    const loadClasses = async () => {
      setIsLoading(true); 
      const data = await fetchGymClasses(user ? user.id : null);

      if (isMounted && data.success) {
        const formattedClasses = data.classes.map(cls => {
          const dateObj = new Date(cls.class_datetime);
          return {
            id: cls.id,
            date: dateObj.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }),
            time: dateObj.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
            name: cls.class_name,
            trainer: cls.trainer_name,
            spots: cls.max_capacity - cls.current_bookings,
            booked: cls.is_booked > 0 
          };
        });
        setClasses(formattedClasses);
        setIsLoading(false); 
      }
    };

    loadClasses();

    return () => {
      isMounted = false;
    };
  }, []); // Sem dependência user aqui para evitar re-fetch infinito, assumindo que auth state muda rotas

  const toggleBooking = async (cls) => {
    if (!isClient) return;

    if (!user) {
      setModal({ isOpen: true, title: "Sessão Necessária", message: "Precisas de fazer login para reservar aulas!", type: "error" });
      setTimeout(() => navigate('/login'), 2000);
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
        if (c.id === cls.id) return { ...c, booked: !c.booked, spots: c.booked ? c.spots + 1 : c.spots - 1 };
        return c;
      }));
    } else {
      setModal({ isOpen: true, title: "Aviso", message: data.message, type: "error" });
      if (data.message === "Já tens o teu lugar marcado nesta aula!") {
          setClasses(classes.map(c => c.id === cls.id ? { ...c, booked: true } : c));
      }
    }
  };

  // Implementação do useMemo para as listas de filtros.
  // Resolve o problema de performance onde o React iterava todo o array de classes para extrair
  // treinadores e modalidades únicas sempre que um input ou botão era clicado na página.
  const uniqueModalities = useMemo(() => {
    return [...new Set(classes.map(c => c.name))];
  }, [classes]);

  const uniqueTrainers = useMemo(() => {
    return [...new Set(classes.map(c => c.trainer))];
  }, [classes]);

  // A filtragem das aulas também foi encapsulada no useMemo
  const filteredClasses = useMemo(() => {
    return classes.filter(c => {
      return (filterModality === '' || c.name === filterModality) &&
             (filterTrainer === '' || c.trainer === filterTrainer);
    });
  }, [classes, filterModality, filterTrainer]);

  return (
    <div className="min-h-screen bg-gym-black pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-extrabold text-white uppercase italic mb-8 border-l-4 border-gym-yellow pl-4">
          Agenda de <span className="text-gym-yellow">Aulas</span>
        </h1>

        {!isLoading && classes.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 mb-8 bg-gym-dark p-4 rounded-xl border border-white/5 shadow-lg">
            <select 
              value={filterModality} 
              onChange={(e) => setFilterModality(e.target.value)}
              className="flex-1 bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none cursor-pointer"
            >
              <option value="">Todas as Modalidades</option>
              {uniqueModalities.map((mod, i) => <option key={i} value={mod}>{mod}</option>)}
            </select>

            <select 
              value={filterTrainer} 
              onChange={(e) => setFilterTrainer(e.target.value)}
              className="flex-1 bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none cursor-pointer"
            >
              <option value="">Todos os Treinadores</option>
              {uniqueTrainers.map((tr, i) => <option key={i} value={tr}>{tr}</option>)}
            </select>
          </div>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
               <div className="w-8 h-8 border-4 border-gym-yellow border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredClasses.length === 0 ? (
            <div className="bg-gym-dark p-10 rounded-lg border border-white/5 text-center">
              <span className="block text-4xl mb-4">🗓️</span>
              <p className="text-gray-300 text-lg">De momento não existem aulas para este filtro.</p>
              <button onClick={() => {setFilterModality(''); setFilterTrainer('');}} className="text-gym-yellow mt-4 text-sm font-bold uppercase hover:underline cursor-pointer">
                Limpar Filtros
              </button>
            </div>
          ) : (
            filteredClasses.map((cls) => (
              <div key={cls.id} className={`flex flex-col md:flex-row items-center justify-between p-6 rounded-lg border transition-all ${cls.booked ? "bg-gym-yellow/10 border-gym-yellow" : "bg-gym-dark border-white/5 hover:border-white/20"}`}>
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
                    disabled={(cls.spots <= 0 && !cls.booked) || loadingClassId === cls.id || !isClient}
                    className={`px-6 py-2 rounded font-bold uppercase tracking-wider text-sm transition-all cursor-pointer min-w-30 ${
                      !isClient ? "bg-gray-800 text-gray-500 border border-white/5 cursor-not-allowed" 
                      : cls.booked ? "bg-transparent border border-gym-yellow text-gym-yellow hover:bg-red-500 hover:text-white hover:border-red-500"
                      : cls.spots <= 0 ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                      : "bg-gym-yellow text-gym-black hover:bg-white hover:text-black"
                    } ${loadingClassId === cls.id ? "opacity-50 cursor-wait" : ""}`}
                  >
                    {loadingClassId === cls.id 
                        ? "Aguarde..." 
                        : !isClient 
                          ? "Staff" 
                          : cls.booked ? "Cancelar" : cls.spots <= 0 ? "Cheio" : "Reservar"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <CustomModal isOpen={modal.isOpen} onClose={() => setModal({ ...modal, isOpen: false })} title={modal.title} message={modal.message} type={modal.type} />
    </div>
  );
}

export default Schedule;