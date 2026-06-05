import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGymClass, fetchGymClasses, fetchTrainers, createTrainer } from '../services/gymApi';
import CustomModal from '../components/layout/CustomModal';

function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('classes');
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });
  
  const [className, setClassName] = useState('');
  const [trainerId, setTrainerId] = useState('');
  const [classDatetime, setClassDatetime] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('20');
  
  const [tName, setTName] = useState('');
  const [tUsername, setTUsername] = useState('');
  const [tEmail, setTEmail] = useState('');
  const [tPassword, setTPassword] = useState('');
  const [tSpecialty, setTSpecialty] = useState('');
  
  const [trainers, setTrainers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // CALCULAR DATA MÍNIMA PERMITIDA (Hoje)
  const getMinDateTime = () => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000; 
    return new Date(now - tzOffset).toISOString().slice(0, 16);
  };
  const minDateTime = getMinDateTime();

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('domus_user'));
    if (!localUser || localUser.role !== 'admin') {
      setModal({ isOpen: true, title: "Acesso Negado", message: "Apenas administradores podem aceder a este painel.", type: "error" });
      setTimeout(() => navigate('/'), 2000);
      return;
    }
    loadInitialData();
  }, [navigate]);

  const loadInitialData = async () => {
    const trainersData = await fetchTrainers();
    if (trainersData.success) {
      setTrainers(trainersData.trainers);
      if (trainersData.trainers.length > 0) setTrainerId(trainersData.trainers[0].id);
    }
    const classesData = await fetchGymClasses();
    if (classesData.success) setClasses(classesData.classes);
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!className || !trainerId || !classDatetime || !maxCapacity) {
      setMessage({ type: 'error', text: 'Preenche todos os campos obrigatórios!' });
      return;
    }
    
    // Verificação dupla no lado do cliente
    if (classDatetime < minDateTime) {
      setMessage({ type: 'error', text: 'Não podes criar aulas com datas no passado!' });
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
      setClassName('');
      setClassDatetime('');
      const classesData = await fetchGymClasses();
      if (classesData.success) setClasses(classesData.classes);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const handleCreateTrainer = async (e) => {
    e.preventDefault();
    if (!tName || !tUsername || !tEmail || !tPassword || !tSpecialty) {
      setMessage({ type: 'error', text: 'Preenche todos os campos do treinador!' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    const result = await createTrainer({
      name: tName, username: tUsername, email: tEmail, password: tPassword, specialty: tSpecialty
    });

    setIsLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Sucesso! Novo treinador adicionado.' });
      setTName(''); setTUsername(''); setTEmail(''); setTPassword(''); setTSpecialty('');
      loadInitialData();
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
        <p className="text-gray-400 mb-8">Gestão global do ginásio: horários, modalidades e equipa técnica.</p>

        <div className="flex flex-col md:flex-row bg-gym-dark p-1 rounded-lg mb-8 border border-white/10 max-w-md gap-1">
          <button onClick={() => { setActiveTab('classes'); setMessage({type:'', text:''}); }} className={`flex-1 py-2.5 rounded font-bold uppercase text-xs tracking-wider transition-all cursor-pointer ${activeTab === 'classes' ? 'bg-white/10 text-gym-yellow shadow-lg' : 'text-gray-400 hover:text-white'}`}>
            🗓️ Aulas e Horários
          </button>
          <button onClick={() => { setActiveTab('trainers'); setMessage({type:'', text:''}); }} className={`flex-1 py-2.5 rounded font-bold uppercase text-xs tracking-wider transition-all cursor-pointer ${activeTab === 'trainers' ? 'bg-white/10 text-gym-yellow shadow-lg' : 'text-gray-400 hover:text-white'}`}>
            👥 Contratar Treinador
          </button>
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg mb-6 border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-red-500/10 border-red-500 text-red-400'}`}>
            {message.text}
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-gym-dark p-6 rounded-xl border border-white/10 shadow-2xl h-fit">
              <h2 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-2"><span>➕</span> Criar Nova Aula</h2>
              <form onSubmit={handleCreateClass} className="space-y-5">
                <div>
                  <label className="block text-gray-400 text-sm mb-2 font-semibold">Nome da Aula</label>
                  <input type="text" value={className} onChange={(e) => setClassName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none" placeholder="Ex: WOD Crossfit, Yoga Flow" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2 font-semibold">Treinador Responsável</label>
                  <select value={trainerId} onChange={(e) => setTrainerId(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none">
                    {trainers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.specialty})</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2 font-semibold">Data e Hora</label>
                    {/* BLOQUEIO DE DATAS PASSADAS ADICIONADO AQUI */}
                    <input type="datetime-local" min={minDateTime} value={classDatetime} onChange={(e) => setClassDatetime(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2 font-semibold">Vagas Máximas</label>
                    <input type="number" value={maxCapacity} onChange={(e) => setMaxCapacity(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none" min="1" />
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-gym-yellow text-gym-black font-bold py-3 rounded uppercase tracking-widest hover:bg-white transition-colors cursor-pointer mt-4">
                  {isLoading ? 'A Processar...' : 'Publicar Aula'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-gym-dark p-6 rounded-xl border border-white/10 shadow-2xl">
              <h2 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-2"><span>📅</span> Horário de Aulas Publicadas</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-sm uppercase font-bold">
                      <th className="py-3 px-4 whitespace-nowrap">Modalidade</th>
                      <th className="py-3 px-4">Treinador</th>
                      <th className="py-3 px-4 whitespace-nowrap">Data / Hora</th>
                      <th className="py-3 px-4 text-center">Capacidade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {classes.length === 0 ? (
                      <tr><td colSpan="4" className="py-8 text-center text-gray-500 font-medium">Nenhuma aula criada no sistema.</td></tr>
                    ) : (
                      classes.map((c) => {
                        const dateObj = new Date(c.class_datetime);
                        return (
                          <tr key={c.id} className="hover:bg-white/5 transition-colors text-white text-sm">
                            <td className="py-4 px-4 font-bold text-gym-yellow whitespace-nowrap">{c.class_name}</td>
                            <td className="py-4 px-4 text-gray-300">{c.trainer_name}</td>
                            <td className="py-4 px-4 text-gray-400 whitespace-nowrap">{dateObj.toLocaleDateString('pt-PT')} às {dateObj.toLocaleTimeString('pt-PT', {hour: '2-digit', minute:'2-digit'})}</td>
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
        )}

        {activeTab === 'trainers' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-gym-dark p-6 rounded-xl border border-white/10 shadow-2xl h-fit">
              <h2 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-2"><span>👤</span> Adicionar Treinador</h2>
              <form onSubmit={handleCreateTrainer} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5 font-semibold">Nome Completo</label>
                  <input type="text" value={tName} onChange={(e) => setTName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none" placeholder="Ex: Carlos Antunes" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5 font-semibold">Username de Acesso</label>
                  <input type="text" value={tUsername} onChange={(e) => setTUsername(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none" placeholder="ex: carlos_trainer" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5 font-semibold">Email Institucional</label>
                  <input type="email" value={tEmail} onChange={(e) => setTEmail(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none" placeholder="carlos@domusfit.com" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5 font-semibold">Password Provisória</label>
                  <input type="password" value={tPassword} onChange={(e) => setTPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none" placeholder="••••••••" minLength={6} />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5 font-semibold">Especialidade / Vertente</label>
                  <input type="text" value={tSpecialty} onChange={(e) => setTSpecialty(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none" placeholder="Ex: Bodybuilding, Cardio, Pilates" />
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-gym-yellow text-gym-black font-bold py-3 rounded uppercase tracking-widest hover:bg-white transition-colors cursor-pointer mt-4">
                  {isLoading ? 'A Processar...' : 'Registar Treinador'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-gym-dark p-6 rounded-xl border border-white/10 shadow-2xl">
              <h2 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-2"><span>📋</span> Equipa Técnica Atual</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-sm uppercase font-bold">
                      <th className="py-3 px-4 whitespace-nowrap">Nome</th>
                      <th className="py-3 px-4">Especialidade Principal</th>
                      <th className="py-3 px-4 text-center whitespace-nowrap">ID Interno</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {trainers.map((t) => (
                      <tr key={t.id} className="hover:bg-white/5 transition-colors text-white text-sm">
                        <td className="py-4 px-4 font-bold text-gym-yellow whitespace-nowrap">{t.name}</td>
                        <td className="py-4 px-4 text-gray-300">{t.specialty}</td>
                        <td className="py-4 px-4 text-center font-mono text-gray-400">#00{t.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
      <CustomModal isOpen={modal.isOpen} onClose={() => setModal({ ...modal, isOpen: false })} title={modal.title} message={modal.message} type={modal.type} />
    </div>
  );
}

export default AdminPanel;