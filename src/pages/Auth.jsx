import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../components/layout/CustomModal';
import logo from '../assets/Logo_Trans.png';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState(''); 
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMsg(''); 

    const endpoint = isLogin ? 'login.php' : 'register.php';
    const url = `http://localhost/domus_backend/${endpoint}`;

    const payload = isLogin 
      ? { login_input: loginInput, password } 
      : { name, username, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        if (!isLogin) {
          setModal({
            isOpen: true,
            title: "Bem-vindo!",
            message: "Conta criada com sucesso! Podes fazer login agora.",
            type: "success"
          });
          
          setIsLogin(true);
          setPassword('');
          setLoginInput(username); 
        } else {
          localStorage.setItem('domus_user', JSON.stringify(data.user));
          navigate('/profile');
        }
      } else {
        setErrorMsg(data.message);
      }
    } catch (error) {
      console.error("Erro no fetch:", error);
      setErrorMsg("Falha na ligação ao servidor. Verifica o estado do serviço (XAMPP).");
    }
  };

  return (
    <div className="min-h-screen bg-gym-black flex items-center justify-center p-6 pt-20">
      <div className="w-full max-w-md bg-gym-dark border border-white/10 p-8 rounded-xl shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gym-yellow"></div>

        <div className="flex justify-center mb-6 mt-2">
          <img src={logo} alt="Domus Fit" className="h-16 w-auto" />
        </div>

        <h2 className="text-3xl font-extrabold text-white text-center mb-8 uppercase italic">
          {isLogin ? 'Entrar na ' : 'Junta-te à '} 
          <span className="text-gym-yellow">Domus</span>
        </h2>

        {errorMsg && (
            <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm text-center">
                {errorMsg}
            </div>
        )}

        <form className="space-y-6" onSubmit={handleAuth}>
          {!isLogin ? (
            <>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Nome Completo</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none transition-colors" placeholder="O teu nome" required />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none transition-colors" placeholder="ex: joao_silva" minLength={3} maxLength={20} required />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none transition-colors" placeholder="email@exemplo.com" required />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email ou Username</label>
              <input type="text" value={loginInput} onChange={(e) => setLoginInput(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none transition-colors" placeholder="O teu email ou username" required />
            </div>
          )}

          <div>
            <label className="block text-gray-400 text-sm mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none transition-colors" placeholder="******" minLength={6} required />
            {!isLogin && <p className="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres.</p>}
          </div>

          <button className="w-full bg-gym-yellow text-gym-black font-bold py-3 rounded uppercase tracking-widest hover:bg-white transition-colors cursor-pointer mt-4">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-400 text-sm">
          {isLogin ? "Ainda não és membro?" : "Já tens conta?"}
          <button 
            type="button"
            onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg('');
                setPassword(''); 
            }}
            className="ml-2 text-gym-yellow font-bold hover:underline cursor-pointer"
          >
            {isLogin ? "Regista-te aqui" : "Faz Login"}
          </button>
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

export default Auth;