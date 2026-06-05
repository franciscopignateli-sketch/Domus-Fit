import { useState, useEffect } from 'react';
import { fetchTrainers } from '../../services/gymApi';

function TrainersSection() {
  const [trainers, setTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Tive um erro chato aqui: se a internet estivesse lenta, a API demorava a responder.
    // Se o utilizador mudasse logo de página, o React tentava fazer o setTrainers num
    // componente que já não existia e dava erro na consola. 
    // Criei esta flag 'isMounted' para garantir que o state só atualiza se o componente ainda estiver visível.
    let isMounted = true;

    const getTrainers = async () => {
      try {
        const data = await fetchTrainers();
        if (isMounted) {
          if (data.success) {
            setTrainers(data.trainers.slice(0, 3));
          }
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Erro ao carregar equipa", error);
          setIsLoading(false);
        }
      }
    };

    getTrainers();

    // Quando o utilizador sai da página, passo a flag a falso.
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-24 bg-gym-black">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-white uppercase italic mb-4">
            A Nossa <span className="text-gym-yellow">Equipa</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Profissionais dedicados a ajudar-te a atingir a tua melhor versão. Conhece os nossos especialistas.
          </p>
        </div>

        {/* Mostro o loading enquanto a API não responde para não ficar um buraco vazio no site */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-10 h-10 border-4 border-gym-yellow border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : trainers.length === 0 ? (
          <p className="text-center text-gray-500">A nossa equipa está a ser formada. Volta em breve!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainers.map((trainer) => (
              <div key={trainer.id} className="group relative overflow-hidden rounded-lg cursor-pointer border border-white/5 shadow-2xl">
                <div className="aspect-3/4 overflow-hidden bg-gray-800">
                  <img 
                    src={`https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop&sig=${trainer.id}`} 
                    alt={trainer.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                </div>
                
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-90 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white group-hover:text-gym-yellow transition-colors">{trainer.name}</h3>
                  <p className="text-gray-300 font-medium tracking-wide">{trainer.specialty || "Treinador Especialista"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default TrainersSection;