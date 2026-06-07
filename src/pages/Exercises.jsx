import { useState } from 'react';
import ScrollToTop from '../components/layout/ScrollToTop';

// Estrutura de dados extraída do componente para prevenir reinicialização 
// da base de dados em cada mudança de tab (otimização de memória).
const exerciseData = {
  peito: [
    {
      name: "Supino Plano com Barra",
      difficulty: "Médio",
      equipment: "Barra e Banco Horizontal",
      img: "https://www.inspireusafoundation.org/wp-content/uploads/2022/04/barbell-bench-press.gif",
      steps: [
        "Deita-te no banco horizontal com os pés bem firmes no chão.",
        "Agarra a barra com uma pega ligeiramente superior à largura dos ombros.",
        "Desce a barra verticalmente de forma controlada até tocar levemente no peito.",
        "Empurra a barra para cima com força, estendendo os braços sem bloquear os cotovelos."
      ]
    },
    {
      name: "Supino Inclinado com Barra",
      difficulty: "Médio",
      equipment: "Barra e Banco Inclinado",
      img: "https://www.hipertrofia.org/blog/wp-content/uploads/2023/09/barbell-incline-bench-press.gif",
      steps: [
        "Ajusta o banco para uma inclinação de cerca de 30 a 45 graus.",
        "Retira a barra do suporte mantendo os braços firmes e o core contraído.",
        "Desce a barra controladamente em direção à parte superior do peito (clavícula).",
        "Empurra o peso de volta para cima focando a contração na zona superior do peitoral."
      ]
    },
    {
      name: "Aberturas em Polia Alta (Cable Crossover)",
      difficulty: "Fácil",
      equipment: "Estação de Cabos / Polias",
      img: "https://image.tuasaude.com/media/article/ly/ur/exercicios-para-peitoral_73975.gif?width=686&height=487",
      steps: [
        "Posiciona as polias na posição alta e segura as pegas dando um passo em frente.",
        "Inclina o tronco ligeiramente para a frente e mantém os cotovelos semi-fletidos.",
        "Puxa os cabos para a frente e para baixo até as mãos se encontrarem em frente à bacia.",
        "Regressa lentamente à posição inicial sentindo o alongamento do peito."
      ]
    }
  ],
  costas: [
    {
      name: "Elevações na Barra Fixa (Pull Up)",
      difficulty: "Difícil",
      equipment: "Barra Fixa",
      img: "https://www.inspireusafoundation.org/wp-content/uploads/2022/11/pull-up.gif",
      steps: [
        "Agarra a barra com as palmas das mãos voltadas para fora (pega em pronação).",
        "Mantém o corpo direito e puxa o teu peso para cima levando os cotovelos para baixo.",
        "Sobe até que o teu queixo ultrapasse completamente a linha da barra.",
        "Desce de forma lenta e controlada até estender os braços na totalidade."
      ]
    },
    {
      name: "Remada Curvada na Smith Machine",
      difficulty: "Médio",
      equipment: "Multiforças / Smith Machine",
      img: "https://www.inspireusafoundation.org/wp-content/uploads/2022/10/smith-machine-bent-over-row.gif",
      steps: [
        "Destrava a barra e inclina o tronco à frente mantendo a coluna totalmente direita.",
        "Puxa a barra em direção à zona inferior do abdómen de forma explosiva.",
        "Esmaga as escápulas no topo do movimento, focando a força nas costas e não nos braços.",
        "Controla a descida da barra estendendo os braços por completo."
      ]
    },
    {
      name: "Extensão Lombar (Hyperextension)",
      difficulty: "Fácil",
      equipment: "Banco Romano / Hiperextensões",
      img: "https://www.inspireusafoundation.org/wp-content/uploads/2022/04/weighted-hyperextension.gif",
      steps: [
        "Posiciona-te no banco apoiando a bacia de forma a conseguires dobrar o tronco livremente.",
        "Cruza os braços no peito (ou segura um disco se quiseres carga extra).",
        "Desce o tronco controladamente fletindo a bacia.",
        "Sobe o tronco contraindo os glúteos e a zona lombar até alinhar o corpo."
      ]
    }
  ],
  pernas: [
    {
      name: "Agachamento Frontal (Front Squat)",
      difficulty: "Difícil",
      equipment: "Barra e Discos",
      img: "https://www.kettlebellkings.com/cdn/shop/articles/Front_Squats.gif?v=1694617488",
      steps: [
        "Apoia a barra sobre a parte frontal dos ombros, cruzando os braços ou em pega olímpica.",
        "Afasta os pés à largura dos ombros com as pontas ligeiramente voltadas para fora.",
        "Agacha-te verticalmente mantendo o peito alto e os cotovelos apontados para a frente.",
        "Sobe empurrando o chão com os calcanhares até estender as pernas."
      ]
    },
    {
      name: "Extensão de Pernas na Máquina",
      difficulty: "Fácil",
      equipment: "Cadeira Extensora",
      img: "https://www.inspireusafoundation.org/wp-content/uploads/2021/06/leg-extension-machine.gif",
      steps: [
        "Senta-te na máquina com as costas bem encostadas e ajusta o rolo acima do tornozelo.",
        "Segura os apoios laterais para estabilizar a bacia no banco.",
        "Estende as pernas por completo para cima contraindo os quadríceps ao máximo.",
        "Desce o peso de forma lenta e controlada até ao ângulo inicial."
      ]
    },
    {
      name: "Peso Morto Convencional (Deadlift)",
      difficulty: "Difícil",
      equipment: "Barra Olímpica e Discos",
      img: "https://www.kettlebellkings.com/cdn/shop/articles/barbell-deadlift-movement_1200x1200_crop_center.gif?v=1692228918",
      steps: [
        "Coloca-te de pé com a barra a meio dos pés e agarra-a à largura dos ombros.",
        "Desce a bacia, alinha as costas e contrai as omoplatas para criar tensão.",
        "Sobe com a barra junto às pernas, estendendo os joelhos e a bacia em simultâneo.",
        "Finaliza em posição vertical e desce a barra pelo mesmo trajeto controlado."
      ]
    }
  ],
  bracos: [
    {
      name: "Press de Ombros com Halteres",
      difficulty: "Médio",
      equipment: "Halteres e Banco Vertical",
      img: "https://boxlifemagazine.com/wp-content/uploads//2023/05/developpe-epaule-halteres.gif",
      steps: [
        "Senta-te num banco com apoio a 90 graus e eleva os halteres à altura das orelhas.",
        "Empurra os halteres para cima descrevendo um arco ligeiro até se aproximarem no topo.",
        "Não bloques os cotovelos no final da subida para manter a tensão nos deltoides.",
        "Desce controladamente até que os braços façam um ângulo reto."
      ]
    },
    {
      name: "Elevações Laterais com Halteres",
      difficulty: "Fácil",
      equipment: "Halteres",
      img: "https://cdn.shopify.com/s/files/1/0449/8453/3153/files/Dumbbell_Lateral_Raises_muscle_worked_600x600.gif?v=1698802254",
      steps: [
        "De pé, segura os halteres ao lado do corpo com o tronco ligeiramente inclinado.",
        "Eleva os braços para os lados até que os cotovelos fiquem alinhados com os ombros.",
        "Mantém o dedo mindinho ligeiramente mais alto que o polegar (como se estivesses a verter uma garrafa).",
        "Controla a descida impedindo que os halteres se batam à frente do corpo."
      ]
    },
    {
      name: "Curl de Bíceps Alternado",
      difficulty: "Fácil",
      equipment: "Halteres",
      img: "https://homeworkouts.org/wp-content/uploads/anim-dumbbell-bicep-curls.gif",
      steps: [
        "Agarra os halteres com as palmas voltadas para dentro (pega neutra).",
        "Sobe um halter fletindo o cotovelo e roda o pulso para cima (supinação) a meio do caminho.",
        "Contrai o bíceps no topo por um segundo.",
        "Desce lentamente e repete o processo para o outro braço."
      ]
    },
    {
      name: "Extensão de Tríceps Sentado",
      difficulty: "Fácil",
      equipment: "Halter",
      img: "https://newlife.com.cy/wp-content/uploads/2019/12/21881301-Dumbbell-Seated-Triceps-Extension_Upper-Arms_360.gif",
      steps: [
        "Senta-te e segura um halter pesado com as duas mãos por trás da cabeça.",
        "Mantém os cotovelos apontados para cima e o mais fechados junto à cabeça possível.",
        "Estende os braços para elevar o halter em direção ao teto.",
        "Desce o halter devagar fletindo os cotovelos por trás da nuca."
      ]
    }
  ],
  abdominal: [
    {
      name: "Abdominal Crunch Clássico",
      difficulty: "Fácil",
      equipment: "Tapete de Ginásio",
      img: "https://fitnessprogramer.com/wp-content/uploads/2015/11/Crunch.gif",
      steps: [
        "Deita-te de costas com os joelhos dobrados e os pés apoiados no chão.",
        "Coloca as mãos de leve atrás da cabeça ou cruzadas sobre o peito.",
        "Contrai o abdómen e eleva apenas os ombros e a parte superior das costas do chão.",
        "Expira no topo e regressa devagar controlando o movimento de descida."
      ]
    },
    {
      name: "Elevação de Pernas Deitado",
      difficulty: "Fácil",
      equipment: "Tapete de Ginásio",
      img: "https://www.inspireusafoundation.org/wp-content/uploads/2022/06/lying-leg-raise.gif",
      steps: [
        "Deita-te de barriga para cima com as pernas esticadas e as mãos sob os glúteos para proteção.",
        "Sobe as duas pernas juntas até formarem um ângulo de 90 graus com o chão.",
        "Mantém a zona lombar bem colada ao chão durante todo o exercício.",
        "Desce as pernas lentamente até ficarem a poucos centímetros do chão sem lhe tocar."
      ]
    }
  ]
};

const categories = [
  { id: 'peito', label: '💥 Peito' },
  { id: 'costas', label: '🦅 Costas' },
  { id: 'pernas', label: '🍗 Pernas' },
  { id: 'bracos', label: '💪 Braços & Ombros' },
  { id: 'abdominal', label: '🍫 Abdominais' }
];

function Exercises() {
  const [activeTab, setActiveTab] = useState('peito');

  return (
    <div className="min-h-screen bg-gym-black pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-5xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white uppercase italic mb-4">
            Enciclopédia de <span className="text-gym-yellow">Exercícios</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Executa os teus treinos com a técnica perfeita. Escolhe um grupo muscular e descobre o movimento animado passo a passo.
          </p>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {exerciseData[activeTab].map((ex, index) => (
            <div key={index} className="bg-gym-dark rounded-xl border border-white/10 overflow-hidden shadow-2xl flex flex-col transition-all duration-300 hover:border-white/20">
              
              <div className="h-80 relative bg-black/40 flex items-center justify-center overflow-hidden border-b border-white/5 p-2">
                <img 
                  src={ex.img} 
                  alt={ex.name} 
                  className="max-w-full max-h-full object-contain mix-blend-screen opacity-90"
                  loading="lazy" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-gym-dark via-transparent to-transparent pointer-events-none"></div>
              </div>

              <div className="p-6 space-y-6 grow flex flex-col justify-between">
                
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">{ex.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4 text-xs uppercase font-bold tracking-wider">
                    <div>
                      <span className="text-gray-500 block mb-1">Equipamento</span>
                      <span className="text-white font-mono text-xs">{ex.equipment}</span>
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
                </div>

                <div className="space-y-3 grow">
                  <h4 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest mb-2">Instruções Técnicas:</h4>
                  <ol className="space-y-3">
                    {ex.steps.map((step, sIdx) => (
                      <li key={sIdx} className="text-gray-300 text-sm leading-relaxed flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-gym-yellow font-bold text-xs shrink-0 font-mono mt-0.5">
                          {sIdx + 1}
                        </span>
                        <span className="text-gray-300">{step}</span>
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