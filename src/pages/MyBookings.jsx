import { useState, useEffect } from 'react';
import { fetchUserBookings, cancelClass } from '../services/gymApi';
import CustomModal from '../components/layout/CustomModal';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });
  const user = JSON.parse(localStorage.getItem('domus_user'));

  useEffect(() => {
    // Flag implementada para evitar atualizações de estado caso o utilizador 
    // abandone a página de reservas antes da resposta do servidor
    let isMounted = true;

    const loadMyBookings = async () => {
      if (!user) return;
      const data = await fetchUserBookings(user.id);
      if (isMounted && data.success) {
        setBookings(data.bookings);
      }
    };

    loadMyBookings();

    return () => {
      isMounted = false;
    };
  }, [user]); // user adicionado como dependência do useEffect

  const handleCancel = async (classId) => {
    setLoadingId(classId);
    const data = await cancelClass(user.id, classId);
    setLoadingId(null);

    if (data.success) {
      // Atualização otimista do estado em vez de fazer nova chamada à API
      // Remove a reserva cancelada diretamente do array local
      setBookings(prevBookings => prevBookings.filter(b => b.class_id !== classId));
    } else {
      setModal({
        isOpen: true,
        title: "Erro ao Cancelar",
        message: data.message,
        type: "error"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gym-black pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-extrabold text-white uppercase italic mb-8 border-l-4 border-gym-yellow pl-4">
          As Minhas <span className="text-gym-yellow">Aulas</span>
        </h1>

        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="bg-gym-dark p-8 rounded-xl text-center border border-white/5">
                <p className="text-gray-400">Não tens nenhuma aula agendada de momento.</p>
            </div>
          ) : (
            bookings.map((booking) => {
              const dateObj = new Date(booking.class_datetime);
              const dateString = dateObj.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
              const timeString = dateObj.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={booking.booking_id} className="flex flex-col md:flex-row items-center justify-between p-6 rounded-lg bg-gym-yellow/10 border border-gym-yellow">
                  <div className="flex items-center gap-6 mb-4 md:mb-0 w-full md:w-auto">
                    <div className="text-xl font-bold text-gym-yellow font-mono text-center">
                        <div>{dateString}</div>
                        <div className="text-2xl">{timeString}</div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white uppercase">{booking.class_name}</h3>
                      <p className="text-gray-400 text-sm">Treinador: {booking.trainer_name}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleCancel(booking.class_id)} 
                    disabled={loadingId === booking.class_id}
                    className="px-6 py-2 rounded font-bold uppercase tracking-wider text-sm transition-all bg-transparent border border-gym-yellow text-gym-yellow hover:bg-red-500 hover:text-white hover:border-red-500 cursor-pointer min-w-30"
                  >
                    {loadingId === booking.class_id ? "Aguarde..." : "Cancelar Reserva"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
      <CustomModal isOpen={modal.isOpen} onClose={() => setModal({ ...modal, isOpen: false })} title={modal.title} message={modal.message} type={modal.type} />
    </div>
  );
}

export default MyBookings;