import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGymClass, fetchGymClasses, fetchTrainers } from '../services/gymApi';

function AdminPanel() {
  const navigate = useNavigate();
  
  // Estados do formulário
  const [className, setClassName] = useState('');
  const [trainerId, setTrainerId] = useState('');
  const [classDatetime, setClassDatetime] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('20');
  
  // Estados para dados da página
  const [trainers, setTrainers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Segurança básica: Verificar se o utilizador está logado e é ADMIN
    const localUser = JSON.parse(localStorage.getItem('domus_user'));
    if (!localUser || localUser.role !== 'admin') {
      alert('Acesso negado! Esta área é exclusiva para administradores.');
      navigate('/');
      return;
    }

    loadInitialData();
  }, [navigate]);

  const loadInitialData = async () => {
    // Carrega os treinadores para o Select
    const trainersData = await fetchTrainers();
    if (trainersData.success) {
      setTrainers(trainersData.trainers);
      if (trainersData.trainers.length > 0) setTrainerId(trainersData.trainers[0].id);
    }

    // Carrega as aulas existentes para listar ao lado
    const classesData = await fetchGymClasses();
    if (classesData.success) {
      setClasses(classesData.classes);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!className || !trainerId || !classDatetime || !maxCapacity) {
      setMessage({ type: 'error', text: 'Preenche todos os campos obrigatórios!' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    const result = await createGymClass({
      name: className,
      trainer_id: trainerId,
      class_datetime: classDatetime,
      max_capacity: parseInt(maxCapacity)
    });

    setIsLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Excelente! Aula criada com sucesso.' });
      // Limpar formulário
      setClassName('');
      setClassDatetime('');
      // Recarregar a lista de aulas para mostrar a nova
      const classesData = await fetchGymClasses();
      if (classesData.success) setClasses(classesData.classes);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="min-h-screen bg-gym-black pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-extrabold text-white mb-2 uppercase italic">
          Painel de <span className="text-gym-yellow">Administração</span>
        </h1>
        <p className="text-gray-400 mb-10">Gestão de horários, aulas de grupo e alocação de treinadores.</p>

        {message.text && (
          <div className={`p-4 rounded-lg mb-6 border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-red-500/10 border-red-500 text-red-400'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUNA ESQUERDA: Formulário para criar aula */}
          <div className="bg-gym-dark p-6 rounded-xl border border-white/10 shadow-2xl h-fit">
            <h2 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-2">
              <span>➕</span> Criar Nova Aula
            </h2>

            <form onSubmit={handleCreateClass} className="space-y-5">
              <div>
                <label className="block text-gray-400 text-sm mb-2 font-semibold">Nome da Aula / Modalidade</label>
                <input 
                  type="text" 
                  value={className} 
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none" 
                  placeholder="Ex: WOD Crossfit, Pilates Avançado" 
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2 font-semibold">Treinador Responsável</label>
                <select 
                  value={trainerId} 
                  onChange={(e) => setTrainerId(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none"
                >
                  {trainers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.specialty})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2 font-semibold">Data e Hora</label>
                  <input 
                    type="datetime-local" 
                    value={classDatetime} 
                    onChange={(e) => setClassDatetime(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2 font-semibold">Capacidade Máxima</label>
                  <input 
                    type="number" 
                    value={maxCapacity} 
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none" 
                    placeholder="20"
                    min="1"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-gym-yellow text-gym-black font-bold py-3 rounded uppercase tracking-widest hover:bg-white transition-colors cursor-pointer mt-4"
              >
                {isLoading ? 'A Processar...' : 'Publicar Aula'}
              </button>
            </form>
          </div>

          {/* COLUNA DIREITA (Ocupa 2 colunas no desktop): Listagem das aulas já existentes */}
          <div className="lg:col-span-2 bg-gym-dark p-6 rounded-xl border border-white/10 shadow-2xl">
            <h2 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-2">
              <span>📅</span> Horário de Aulas Publicadas
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-sm uppercase font-bold">
                    <th className="py-3 px-4">Aula</th>
                    <th className="py-3 px-4">Treinador</th>
                    <th className="py-3 px-4">Data / Hora</th>
                    <th className="py-3 px-4 text-center">Vagas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {classes.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500 font-medium">Nenhuma aula criada no sistema até ao momento.</td>
                    </tr>
                  ) : (
                    classes.map((c) => {
                      const dateObj = new Date(c.class_datetime);
                      return (
                        <tr key={c.id} className="hover:bg-white/5 transition-colors text-white text-sm">
                          <td className="py-4 px-4 font-bold text-gym-yellow">{c.name}</td>
                          <td className="py-4 px-4 text-gray-300">{c.trainer_name}</td>
                          <td className="py-4 px-4 text-gray-400">
                            {dateObj.toLocaleDateString('pt-PT')} às {dateObj.toLocaleTimeString('pt-PT', {hour: '2-digit', minute:'2-digit'})}
                          </td>
                          <td className="py-4 px-4 text-center font-mono text-gray-300">{c.max_capacity}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminPanel;