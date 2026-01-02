import { Link } from 'react-router-dom';

function Membership() {
  const plans = [
    {
      name: "Básico",
      price: "29,90",
      features: ["Acesso 07h - 22h", "Área de Musculação", "Balneários", "Sem fidelização"],
      highlight: false
    },
    {
      name: "Pro",
      price: "39,90",
      features: ["Acesso 24/7", "Acesso a todas as Aulas", "Área de Musculação", "Consultas Nutrição (1x/mês)", "Convida um amigo (Sábados)"],
      highlight: true
    },
    {
      name: "Elite",
      price: "59,90",
      features: ["Acesso Total 24/7", "Acompanhamento PT (2x/mês)", "Plano de Treino Personalizado", "Acesso Zona Spa & Sauna", "Toalha e Kit Banho incluídos"],
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-gym-black py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white uppercase italic mb-4">
            Investe em <span className="text-gym-yellow">Ti</span>
          </h1>
          <p className="text-gray-400 text-lg">Escolhe o plano que se adapta aos teus objetivos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative p-8 rounded-xl border flex flex-col h-full ${
                plan.highlight 
                  ? "bg-white/5 border-gym-yellow shadow-[0_0_30px_rgba(250,204,21,0.15)] md:scale-110 z-10" 
                  : "bg-gym-dark border-white/5 text-gray-300"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gym-yellow text-gym-black font-bold px-4 py-1 rounded-full text-sm uppercase tracking-widest">
                  Mais Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold uppercase mb-4 text-white">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}€</span>
                <span className="text-sm text-gray-500"> /mês</span>
              </div>
              
              <ul className="space-y-4 mb-8 grow">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gym-yellow shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-sm">{feat}</span>
                  </li>
                ))}
              </ul>

              <Link 
                to="/login"
                className={`w-full py-3 rounded font-bold uppercase tracking-widest text-center transition-colors ${
                  plan.highlight 
                    ? "bg-gym-yellow text-gym-black hover:bg-white" 
                    : "border border-white/20 hover:border-gym-yellow hover:text-gym-yellow"
                }`}
              >
                Aderir Agora
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Membership;