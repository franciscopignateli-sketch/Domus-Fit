import { useState } from 'react';

function Schedule() {
  // Dados fictícios (Isto virá da Base de Dados no futuro)
  const [classes, setClasses] = useState([
    { id: 1, time: "07:00", name: "Morning Power", trainer: "João Silva", spots: 15, booked: false },
    { id: 2, time: "09:00", name: "Cross Training", trainer: "Marta Dias", spots: 5, booked: false },
    { id: 3, time: "12:30", name: "HIIT Lunch", trainer: "Pedro Costa", spots: 20, booked: false },
    { id: 4, time: "18:00", name: "Boxe Técnica", trainer: "João Silva", spots: 12, booked: false },
    { id: 5, time: "19:30", name: "Powerlifting", trainer: "Pedro Costa", spots: 0, booked: true }, // Exemplo de aula cheia
  ]);

  // Função para simular a reserva
  const toggleBooking = (id) => {
    setClasses(classes.map(cls => 
      cls.id === id ? { ...cls, booked: !cls.booked } : cls
    ));
  };

  return (
    <div className="min-h-screen bg-gym-black pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-extrabold text-white uppercase italic mb-8 border-l-4 border-gym-yellow pl-4">
          Agenda do <span className="text-gym-yellow">Dia</span>
        </h1>

        {/* Lista de Aulas */}
        <div className="space-y-4">
          {classes.map((cls) => (
            <div 
              key={cls.id} 
              className={`flex flex-col md:flex-row items-center justify-between p-6 rounded-lg border transition-all ${
                cls.booked 
                  ? "bg-gym-yellow/10 border-gym-yellow" 
                  : "bg-gym-dark border-white/5 hover:border-white/20"
              }`}
            >
              {/* Informação da Aula */}
              <div className="flex items-center gap-6 mb-4 md:mb-0 w-full md:w-auto">
                <div className="text-2xl font-bold text-gym-yellow font-mono">{cls.time}</div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase">{cls.name}</h3>
                  <p className="text-gray-400 text-sm">Treinador: {cls.trainer}</p>
                </div>
              </div>

              {/* Estado e Botão */}
              <div className="flex items-center gap-6">
                 {/* Mostrador de Vagas */}
                <div className="text-right hidden md:block">
                    <span className="block text-xs text-gray-500 uppercase tracking-widest">Vagas</span>
                    <span className={`font-bold ${cls.spots === 0 ? "text-red-500" : "text-white"}`}>
                        {cls.spots === 0 ? "Esgotado" : `${cls.spots} Livres`}
                    </span>
                </div>

                <button 
                  onClick={() => cls.spots > 0 && toggleBooking(cls.id)}
                  disabled={cls.spots === 0}
                  className={`px-6 py-2 rounded font-bold uppercase tracking-wider text-sm transition-all cursor-pointer ${
                    cls.booked
                      ? "bg-transparent border border-gym-yellow text-gym-yellow hover:bg-gym-yellow hover:text-black"
                      : cls.spots === 0
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : "bg-gym-yellow text-gym-black hover:bg-white hover:text-black"
                  }`}
                >
                  {cls.booked ? "Cancelar" : cls.spots === 0 ? "Cheio" : "Reservar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Schedule;