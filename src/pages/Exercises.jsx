import { useState } from 'react';
import ScrollToTop from '../components/layout/ScrollToTop';

function Exercises() {
  const [activeTab, setActiveTab] = useState('peito');

  // Base de dados local de exercícios organizada por categorias
  const exerciseData = {
    peito: [
      {
        name: "Supino Reto com Barra",
        difficulty: "Médio",
        equipment: "Barra e Banco Horizontal",
        img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500&auto=format&fit=crop",
        steps: [
          "Deita-te no banco com os pés bem firmes no chão.",
          "Agarra a barra com as mãos ligeiramente mais afastadas que a largura dos ombros.",
          "Desce a barra de forma controlada até tocar levemente no peito.",
          "Empurra a barra para cima, estendendo os braços sem bloquear os cotovelos."
        ]
      },
      {
        name: "Aberturas com Halteres (Flyes)",
        difficulty: "Fácil",
        equipment: "Halteres e Banco",
        img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500&auto=format&fit=crop",
        steps: [
          "Deita-te no banco segurando os halteres diretamente acima do peito.",
          "Com os cotovelos ligeiramente fletidos, abre os braços para os lados num arco amplo.",
          "Desce até sentires o peito a alongar de forma confortável.",
          "Contrai o peito e fecha os braços de volta à posição inicial pelo mesmo arco."
        ]
      }
    ],
    costas: [
      {
        name: "Puxada Atrás (Lat Pulldown)",
        difficulty: "Fácil",
        equipment: "Máquina de Polia Alta",
        img: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=500&auto=format&fit=crop",
        steps: [
          "Senta-te na máquina e ajusta o suporte das pernas.",
          "Segura a barra com as mãos bem afastadas (pega larga).",
          "Puxa a barra para baixo em direção à parte superior do peito, inclinando o tronco ligeiramente para trás.",
          "Contrai as costas e estende os braços lentamente subindo a barra de forma controlada."
        ]
      },
      {
        name: "Remada Curvada com Barra",
        difficulty: "Difícil",
        equipment: "Barra e Discos",
        img: "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?q=80&w=500&auto=format&fit=crop",
        steps: [
          "Segura a barra com as palmas das mãos voltadas para baixo e inclina o tronco para a frente (cerca de 45º).",
          "Mantém a coluna totalmente direita e os joelhos ligeiramente fletidos.",
          "Puxa a barra em direção ao abdómen, levando os cotovelos para trás junto ao corpo.",
          "Desce a barra lentamente até estender os braços por completo."
        ]
      }
    ],
    pernas: [
      {
        name: "Agachamento Livre (Squat)",
        difficulty: "Médio",
        equipment: "Barra e Rack de Agachamento",
        img: "https://images.unsplash.com/photo-1574680131999-6ac215244037?q=80&w=500&auto=format&fit=crop",
        steps: [
          "Coloca a barra sobre os trapézios (não no pescoço) e afasta os pés à largura dos ombros.",
          "Inicia o movimento empurrando a bacia para trás, como se te fosses sentar numa cadeira.",
          "Desce até as coxas ficarem pelo menos paralelas ao chão, mantendo os joelhos alinhados com a ponta dos pés.",
          "Empurra o chão com a força das pernas para voltar à posição vertical direita."
        ]
      },
      {
        name: "Prensa de Pernas (Leg Press 45º)",
        difficulty: "Fácil",
        equipment: "Máquina Leg Press",
        img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=500&auto=format&fit=crop",
        steps: [
          "Senta-te na máquina com as costas bem apoiadas no encosto.",
          "Coloca os pés na plataforma afastados à largura dos ombros.",
          "Destrava a máquina e desce a plataforma controladamente fletindo os joelhos até um ângulo de 90º.",
          "Empurra a plataforma estendendo as pernas sem bloquear totalmente os joelhos no topo."
        ]
      }
    ],
    bracos: [
      {
        name: "Curl de Bíceps com Halteres",
        difficulty: "Fácil",
        equipment: "Halteres",
        img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=500&auto=format&fit=crop",
        steps: [
          "De pé, segura um halter em cada mão com os braços estendidos ao longo do corpo.",
          "Mantém os cotovelos fixos junto ao tronco e dobra os braços subindo os halteres.",
          "Roda os pulsos para cima no topo do movimento para esmagar o bíceps.",
          "Desce os pesos de forma lenta e controlada até à posição inicial."
        ]
      },
      {
        name: "Extensões de Tríceps na Polia (Pushdown)",
        difficulty: "Fácil",
        equipment: "Máquina de Polia e Corda",
        img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=500&auto=format&fit=crop",
        steps: [
          "Segura a corda da polia alta com os cotovelos dobrados a 90º junto às costelas.",
          "Empurra a corda para baixo estendendo os braços por completo.",
          "Afasta as pontas da corda no final do movimento para contrair ao máximo os tríceps.",
          "Sobe as mãos lentamente mantendo sempre os cotovelos imóveis no mesmo sítio."
        ]
      }
    ]
  };

  const categories = [
    { id: 'peito', label: '💥 Peito' },
    { id: 'costas', label: '🦅 Costas' },
    { id: 'pernas', label: '🍗 Pernas' },
    { id: 'bracos', label: '💪 Braços / Ombros' }
  ];

  return (
    <div className="min-h-screen bg-gym-black pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-5xl">
        
        {/* Título */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white uppercase italic mb-4">
            Enciclopédia de <span className="text-gym-yellow">Exercícios</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Executa os teus treinos com a técnica perfeita. Escolhe um grupo muscular e descobre o passo a passo de cada movimento.
          </p>
        </div>

        {/* Abas de Navegação dos Músculos */}
        <div className="flex flex-wrap justify-center bg-gym-dark p-1.5 rounded-xl mb-12 border border-white/5 gap-2 max-w-3xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-5 py-3 rounded-lg font-bold uppercase text-xs tracking-wider transition-all cursor-pointer ${
                activeTab === cat.id 
                  ? 'bg-gym-yellow text-gym-black shadow-xl font-black scale-102' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grelha de Exercícios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {exerciseData[activeTab].map((ex, index) => (
            <div key={index} className="bg-gym-dark rounded-xl border border-white/10 overflow-hidden shadow-2xl flex flex-col">
              
              {/* Cabeçalho do Cartão com Imagem Cinematográfica */}
              <div className="h-56 relative bg-gray-900">
                <img src={ex.img} alt={ex.name} className="w-full h-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-linear-to-t from-gym-dark to-transparent"></div>
                
                {/* Etiquetas de Info sobre a imagem */}
                <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">{ex.name}</h3>
                </div>
              </div>

              {/* Corpo do Cartão */}
              <div className="p-6 space-y-6 grow flex flex-col justify-between">
                
                {/* Meta Dados (Equipamento / Dificuldade) */}
                <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4 text-xs uppercase font-bold tracking-wider">
                  <div>
                    <span className="text-gray-500 block mb-1">Equipamento</span>
                    <span className="text-white font-mono">{ex.equipment}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 block mb-1">Dificuldade</span>
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] ${
                      ex.difficulty === 'Fácil' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      ex.difficulty === 'Médio' ? 'bg-gym-yellow/10 text-gym-yellow border border-gym-yellow/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {ex.difficulty}
                    </span>
                  </div>
                </div>

                {/* Instruções Passo a Passo */}
                <div className="space-y-3 grow">
                  <h4 className="text-sm font-extrabold text-gym-yellow uppercase tracking-widest mb-2">Execução Correta:</h4>
                  <ol className="space-y-2.5">
                    {ex.steps.map((step, sIdx) => (
                      <li key={sIdx} className="text-gray-300 text-sm leading-relaxed flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-gym-yellow font-bold text-xs shrink-0 font-mono mt-0.5">
                          {sIdx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
      <ScrollToTop />
    </div>
  );
}

export default Exercises;