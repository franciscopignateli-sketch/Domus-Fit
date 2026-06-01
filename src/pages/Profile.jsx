import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserBookings, fetchUserProfile, updateUserProfile, uploadUserPhoto } from '../services/gymApi';

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [user, setUser] = useState(null);
  const [nextClass, setNextClass] = useState(null);
  
  // Estados para edição inline
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [stats, setStats] = useState({
    completedThisMonth: 0,
    bookedThisMonth: 0,
    monthlyTarget: 12 // Meta de 12 aulas/treinos por mês
  });

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('domus_user'));
    if (!localUser) {
      navigate('/login');
      return;
    }
    loadFullProfile(localUser.id);
  }, [navigate]);

  const loadFullProfile = async (userId) => {
    const profileData = await fetchUserProfile(userId);
    if (profileData.success) {
      const u = profileData.user;
      
      let daysLeft = 0;
      let planActive = false;
      if (u.plan_expires) {
        const expires = new Date(u.plan_expires);
        const today = new Date();
        const diffTime = expires - today;
        daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        planActive = daysLeft > 0;
      }

      setUser({
        id: u.id,
        name: u.name,
        username: u.username,
        email: u.email,
        photo: u.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
        plan: u.plan_name && planActive ? u.plan_name : "Sem Plano Ativo",
        daysLeft: daysLeft,
        planActive: planActive,
        memberNumber: `DOMUS-${String(u.id).padStart(4, '0')}`
      });

      setEditName(u.name);
    }

    const bookingsData = await fetchUserBookings(userId);
    if (bookingsData.success && bookingsData.bookings.length > 0) {
      const now = new Date();
      
      // 1. Definir a Próxima Aula
      // Filtra as aulas que ainda vão acontecer e apanha a primeira
      const futureBookings = bookingsData.bookings.filter(b => new Date(b.class_datetime) >= now);
      if (futureBookings.length > 0) {
        const upcoming = futureBookings[0];
        const dateObj = new Date(upcoming.class_datetime);
        setNextClass({
          name: upcoming.class_name,
          trainer: upcoming.trainer_name,
          date: `${dateObj.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}, às ${dateObj.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`
        });
      }

      // 2. Calcular as Estatísticas do Mês Atual
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const thisMonthBookings = bookingsData.bookings.filter(b => {
        const classDate = new Date(b.class_datetime);
        return classDate.getMonth() === currentMonth && classDate.getFullYear() === currentYear;
      });

      const completed = thisMonthBookings.filter(b => new Date(b.class_datetime) < now).length;
      
      setStats({
        completedThisMonth: completed,
        bookedThisMonth: thisMonthBookings.length,
        monthlyTarget: 12
      });
    }
  };

  // Lidar com Upload de Foto clicando na imagem
  const handlePhotoClick = () => {
    if (!isUploading) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const result = await uploadUserPhoto(user.id, file);
    setIsUploading(false);

    if (result.success) {
      setUser({ ...user, photo: result.photo_url });
      const localUser = JSON.parse(localStorage.getItem('domus_user'));
      localStorage.setItem('domus_user', JSON.stringify({ ...localUser, photo: result.photo_url }));
    } else {
      alert("Erro ao enviar foto: " + result.message);
    }
  };

  // Guardar apenas o nome inline
  const handleSaveName = async () => {
    if (editName.trim() === '') return;
    
    const result = await updateUserProfile({
      user_id: user.id,
      name: editName,
      photo: user.photo, 
      password: '' // Mantém a antiga
    });

    if (result.success) {
      setUser({ ...user, name: editName });
      setIsEditingName(false);
      const localUser = JSON.parse(localStorage.getItem('domus_user'));
      localStorage.setItem('domus_user', JSON.stringify({ ...localUser, name: editName }));
    } else {
      alert(result.message);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gym-black pt-24 pb-12 px-6 relative">
      <div className="container mx-auto max-w-5xl">
        
        {/* CABEÇALHO PERFIL */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-12 bg-gym-dark p-8 rounded-xl border border-white/5">
          <div className="flex flex-col md:flex-row items-center gap-6">
            
            {/* FOTO DE PERFIL COM HOVER PARA UPLOAD */}
            <div 
              onClick={handlePhotoClick}
              className="relative w-24 h-24 bg-gray-700 rounded-full overflow-hidden border-2 border-gym-yellow shrink-0 group cursor-pointer"
            >
              <img src={user.photo} alt="User" className={`w-full h-full object-cover transition-opacity duration-300 ${isUploading ? 'opacity-50' : 'group-hover:opacity-40'}`} />
              
              {/* Ícone de Câmara que aparece no hover */}
              {!isUploading && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
              )}
              
              {/* Loading spinner */}
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-gym-yellow border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {/* Input de ficheiro invisível */}
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </div>

            <div className="text-center md:text-left">
              {/* NOME COM EDIÇÃO INLINE */}
              {isEditingName ? (
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={e => setEditName(e.target.value)} 
                    className="bg-black/50 border border-gym-yellow rounded px-3 py-1 text-white text-xl md:text-2xl outline-none w-48"
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="p-2 bg-gym-yellow rounded text-black hover:bg-white transition-colors">✓</button>
                  <button onClick={() => {setIsEditingName(false); setEditName(user.name);}} className="p-2 bg-white/10 rounded text-white hover:bg-white/20 transition-colors">✕</button>
                </div>
              ) : (
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <h1 className="text-3xl font-bold text-white uppercase">{user.name}</h1>
                  <button onClick={() => setIsEditingName(true)} className="text-gray-500 hover:text-gym-yellow transition-colors" title="Editar Nome">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                  </button>
                </div>
              )}
              
              <p className="text-gray-400 mt-1">@{user.username} • {user.email}</p>
              
              {/* Etiqueta do Plano */}
              <div className="mt-3 inline-block px-4 py-1 rounded-full bg-gym-yellow/10 border border-gym-yellow">
                <span className="text-gym-yellow font-bold uppercase text-sm">
                  {user.plan} {user.planActive && `(Faltam ${user.daysLeft} dias)`}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* COLUNA ESQUERDA: QR Code */}
          <div className="bg-gym-dark p-8 rounded-xl border border-white/10 flex flex-col items-center text-center shadow-2xl h-fit">
            <h3 className="text-xl font-bold text-white uppercase mb-6">Passe de Entrada</h3>
            <div className={`p-4 rounded-lg mb-4 ${user.planActive ? "bg-white" : "bg-red-500/20 opacity-50"}`}>
              {user.planActive ? (
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${user.memberNumber}`} alt="QR Code" className="w-40 h-40" />
              ) : (
                <div className="w-40 h-40 flex items-center justify-center text-red-500 font-bold rotate-[-15deg] uppercase">Plano Expirado</div>
              )}
            </div>
            <p className="text-sm text-gray-400 font-mono tracking-widest">{user.memberNumber}</p>
            {user.planActive ? (
              <p className="text-xs text-gray-500 mt-2">Usa este código no torniquete.</p>
            ) : (
              <Link to="/membership" className="mt-2 text-xs text-gym-yellow hover:underline uppercase font-bold">Subscrever Plano &rarr;</Link>
            )}
          </div>

          {/* COLUNA DIREITA: Próxima Aula + Ações + Metas */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Próximo Treino */}
            <div className="bg-linear-to-r from-gym-dark to-black p-6 rounded-xl border-l-4 border-gym-yellow">
              <h3 className="text-lg font-bold text-gray-400 uppercase mb-3">Próxima Aula</h3>
              <div className="flex justify-between items-end">
                <div>
                  {nextClass ? (
                    <>
                      <p className="text-2xl font-bold text-white">{nextClass.name}</p>
                      <p className="text-gray-300">{nextClass.date} • Com {nextClass.trainer}</p>
                    </>
                  ) : (
                    <p className="text-xl font-bold text-gray-500">Nenhuma aula agendada</p>
                  )}
                </div>
                <Link to="/my-bookings" className="text-gym-yellow font-bold text-sm hover:underline cursor-pointer whitespace-nowrap ml-4">
                  Ver Minhas Aulas &rarr;
                </Link>
              </div>
            </div>

            {/* Metas e Progresso (Gamificação) */}
            <div className="bg-gym-dark p-6 rounded-xl border border-white/10">
              <h3 className="text-lg font-bold text-white uppercase mb-4 flex items-center gap-2">
                <span>🔥</span> O Teu Progresso Mensal
              </h3>
              
              <div className="space-y-5">
                {/* Meta Mensal de Frequência */}
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-2 font-bold uppercase">
                    <span>Meta de Treinos Mensal</span>
                    <span className="text-white">{stats.completedThisMonth} / {stats.monthlyTarget} Dias</span>
                  </div>
                  <div className="w-full bg-black/50 rounded-full h-2.5 border border-white/5">
                    <div 
                      className="bg-gym-yellow h-2.5 rounded-full transition-all duration-1000" 
                      style={{ width: `${Math.min((stats.completedThisMonth / stats.monthlyTarget) * 100, 100)}%` }}>
                    </div>
                  </div>
                </div>

                {/* Assiduidade nas Aulas Marcadas */}
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-2 font-bold uppercase">
                    <span>Aulas Concluídas vs Marcadas</span>
                    <span className="text-white">{stats.completedThisMonth} / {stats.bookedThisMonth || 1} Aulas</span>
                  </div>
                  <div className="w-full bg-black/50 rounded-full h-2.5 border border-white/5">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000" 
                      style={{ width: `${stats.bookedThisMonth > 0 ? (stats.completedThisMonth / stats.bookedThisMonth) * 100 : 0}%` }}>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="grid grid-cols-2 gap-4">
                <Link to="/membership" className="bg-white/5 hover:bg-white/10 p-5 rounded-lg text-center border border-dashed border-gray-600 hover:border-gym-yellow transition-colors cursor-pointer">
                    <span className="block text-2xl mb-2">⭐</span>
                    <span className="text-sm font-bold text-gray-300 uppercase">Ver Planos</span>
                </Link>
                <Link to="/schedule" className="bg-white/5 hover:bg-white/10 p-5 rounded-lg text-center border border-dashed border-gray-600 hover:border-gym-yellow transition-colors cursor-pointer">
                    <span className="block text-2xl mb-2">📅</span>
                    <span className="text-sm font-bold text-gray-300 uppercase">Marcar Aula</span>
                </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;