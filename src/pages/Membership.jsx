import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribePlan } from '../services/gymApi';
import CustomModal from '../components/layout/CustomModal';

function Membership() {
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });
  
  const userString = localStorage.getItem('domus_user');
  const user = userString ? JSON.parse(userString) : null;

  const handleSubscribe = async (planName) => {
    if (!user) {
      setModal({
        isOpen: true,
        title: "Sessão Necessária",
        message: "Precisas de fazer login para subscrever um plano!",
        type: "error"
      });
      // Dá tempo para a pessoa ler antes de a mandar para o login
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    setLoadingPlan(planName);
    const data = await subscribePlan(user.id, planName);
    setLoadingPlan(null);

    if (data.success) {
      // Pop-up de SUCESSO
      setModal({
        isOpen: true,
        title: "Subscrição Ativa! 🎉",
        message: `Parabéns! Subscreveste o ${planName}. O teu plano é válido até ${data.plan_data.plan_expires}.`,
        type: "success"
      });
      // Espera 2.5 segundos para a pessoa ler e depois manda para o perfil
      setTimeout(() => navigate('/profile'), 2500);
    } else {
      // Pop-up de ERRO
      setModal({
        isOpen: true,
        title: "Erro na Subscrição",
        message: data.message,
        type: "error"
      });
    }
  };

  const plans = [
    {
      name: "Iron Plan",
      price: "29€",
      period: "/ mês",
      features: ["Acesso livre horário reduzido", "1 Aula de grupo por semana", "Balneários"],
      color: "border-gray-500",
      btnColor: "bg-gray-500 hover:bg-gray-400 text-white"
    },
    {
      name: "Gold Plan",
      price: "39€",
      period: "/ mês",
      features: ["Acesso livre trânsito total", "Aulas de grupo ilimitadas", "Avaliação Física Mensal", "Toalha incluída"],
      color: "border-gym-yellow",
      btnColor: "bg-gym-yellow hover:bg-white text-black"
    },
    {
      name: "Elite Plan",
      price: "59€",
      period: "/ mês",
      features: ["Tudo do Gold Plan", "1 Sessão Personal Trainer/semana", "Acesso ao Spa", "Nutrição incluída"],
      color: "border-blue-500",
      btnColor: "bg-blue-500 hover:bg-blue-400 text-white"
    }
  ];

  // Variável para saber se é Staff (Admin ou Treinador)
  const isStaff = user && user.role !== 'user';

  return (
    <div className="min-h-screen bg-gym-black pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white uppercase italic mb-4">
            Escolhe o teu <span className="text-gym-yellow">Plano</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Sem fidelização. Pagas apenas 30 dias de cada vez. Junta-te à Domus Fit e transforma a tua vida hoje.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`bg-gym-dark p-8 rounded-2xl border-2 flex flex-col transition-transform hover:-translate-y-2 ${plan.color} ${plan.name === "Gold Plan" ? "shadow-[0_0_30px_rgba(252,211,77,0.15)] relative" : ""}`}
            >
              {plan.name === "Gold Plan" && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gym-yellow text-black font-bold px-4 py-1 rounded-full text-sm uppercase tracking-wider">
                  Mais Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-white mb-2 uppercase">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                <span className="text-gray-400 ml-2">{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-8 grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <span className="text-gym-yellow mr-3">✔</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleSubscribe(plan.name)}
                disabled={loadingPlan === plan.name || isStaff}
                className={`w-full py-4 rounded font-bold uppercase tracking-widest transition-colors cursor-pointer ${
                  isStaff 
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5" 
                    : plan.btnColor
                } ${loadingPlan === plan.name ? "opacity-50 cursor-wait" : ""}`}
              >
                {isStaff 
                  ? "Acesso Incluído" 
                  : loadingPlan === plan.name 
                    ? "A processar..." 
                    : "Subscrever"}
              </button>
            </div>
          ))}
        </div>
      </div>
      <CustomModal 
        isOpen={modal.isOpen} 
        onClose={() => setModal({ ...modal, isOpen: false })} 
        title={modal.title} 
        message={modal.message} 
        type={modal.type} 
      />
    </div>
  );
}

export default Membership;