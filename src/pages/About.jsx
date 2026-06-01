import { useState, useEffect } from 'react';
import { fetchTrainers } from '../services/gymApi';
import ScrollToTop from '../components/layout/ScrollToTop';

function About() {
  const [trainers, setTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Novo estado!

  useEffect(() => {
    const getTrainers = async () => {
      const data = await fetchTrainers();
      if (data.success) {
        setTrainers(data.trainers.slice(0, 3));
      }
      setIsLoading(false); // O carregamento terminou, mesmo que venha vazio!
    };
    getTrainers();
  }, []);

  return (
    <>
      {/* Header da Página About */}
      <div className="relative h-[60vh] flex items-center justify-center bg-gym-dark overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1574680096141-9832005263d8?q=80&w=1454&auto=format&fit=crop")' }}
        ></div>
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-gym-black"></div>
        <h1 className="relative z-10 text-6xl font-extrabold uppercase italic tracking-tighter text-white">
          A Nossa <span className="text-gym-yellow">História</span>
        </h1>
      </div>

      {/* Conteúdo Principal */}
      <div className="bg-gym-black pb-20">
        <div className="container mx-auto px-6 -mt-20 relative z-20 max-w-5xl">
          
          {/* Caixa de Texto "Missão" */}
          <div className="bg-gym-dark p-10 md:p-14 border-t-4 border-gym-yellow shadow-2xl rounded-sm">
            <h2 className="text-3xl font-bold text-white mb-6 uppercase">Bem-vindo à <span className="text-gym-yellow">Domus Fit</span></h2>
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                A <strong>Domus Fit</strong> nasceu de uma idea simples: o fitness não deve ser complicado. Em 2024, abrimos as portas com o objetivo de criar um espaço onde iniciantes e atletas de elite partilham o mesmo chão, o mesmo ferro e a mesma vontade de vencer.
              </p>
              <p>
                "Domus" significa casa em latim. E é isso que somos. Não somos apenas um lugar onde pagas uma mensalidade; somos a casa da tua reconstrução física e mental.
              </p>
            </div>
            
            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 border-t border-white/10 pt-8">
              {[
                { label: "Membros", val: "500+" },
                { label: "Equipamentos", val: "Premium" },
                { label: "Treinadores", val: trainers.length > 0 ? `${trainers.length} Ativos` : "Certificados" }, // Estatística real baseada no tamanho da lista!
                { label: "Aberto", val: "24/7" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-gym-yellow">{stat.val}</div>
                  <div className="text-sm uppercase tracking-widest text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Secção da Equipa Dinâmica */}
          <div className="mt-24">
            <h2 className="text-4xl font-bold text-center text-white uppercase mb-12">
              Conhece a <span className="text-gym-yellow">Equipa</span>
            </h2>

            {isLoading ? (
          <p className="text-center text-gray-500">A carregar equipa...</p>
        ) : trainers.length === 0 ? (
          <p className="text-center text-gray-500">A nossa equipa está a ser formada. Volta em breve!</p>
        ) : (
              // Tailwind v4 lida de forma fantástica com grids flexíveis! Ele cria 3 colunas por defeito e salta de linha dinamicamente se houver 30 treinadores.
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {trainers.map((trainer, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-lg cursor-pointer border border-white/5 shadow-2xl">
                    {/* Imagem com Proporções Perfeitas */}
                    <div className="aspect-3/4 overflow-hidden bg-gray-800">
                      <img 
                        src={`https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=400&auto=format&fit=crop&sig=${trainer.id}`} 
                        alt={trainer.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                      />
                    </div>
                    
                    {/* Overlay com Informação */}
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-90 flex flex-col justify-end p-6">
                      <h3 className="text-2xl font-bold text-white group-hover:text-gym-yellow transition-colors">{trainer.name}</h3>
                      <p className="text-gray-300 font-medium tracking-wide">{trainer.specialty}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
      
      <ScrollToTop />
    </>
  );
}

export default About;