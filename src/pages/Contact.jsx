import { useState } from 'react';
import ScrollToTop from '../components/layout/ScrollToTop';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // 'loading' ou 'success'

  // Simula o envio de um email para a apresentação
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Limpa a mensagem de sucesso ao fim de 4 segundos
      setTimeout(() => setStatus(null), 4000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gym-black pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-5xl">
        
        {/* Título */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white uppercase italic mb-4">
            Fale <span className="text-gym-yellow">Connosco</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tens dúvidas sobre os nossos planos ou queres fazer parte da equipa? Envia-nos uma mensagem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* COLUNA ESQUERDA - Informações */}
          <div className="space-y-8">
            <div className="bg-gym-dark p-8 rounded-xl border border-white/10 shadow-2xl h-full">
              <h3 className="text-2xl font-bold text-white mb-8 uppercase">Informações de Contacto</h3>
              
              <ul className="space-y-8 text-gray-300">
                <li className="flex items-center gap-6">
                  <span className="w-14 h-14 bg-gym-yellow/10 border border-gym-yellow/30 text-gym-yellow rounded-full flex items-center justify-center text-2xl shrink-0">📍</span>
                  <div>
                    <p className="font-bold text-white uppercase text-sm tracking-widest mb-1">Morada</p>
                    <p>Rua do Ginásio, 123<br/>9000-000 Funchal, Madeira</p>
                  </div>
                </li>
                <li className="flex items-center gap-6">
                  <span className="w-14 h-14 bg-gym-yellow/10 border border-gym-yellow/30 text-gym-yellow rounded-full flex items-center justify-center text-2xl shrink-0">📞</span>
                  <div>
                    <p className="font-bold text-white uppercase text-sm tracking-widest mb-1">Telefone</p>
                    <p>+351 912 345 678</p>
                  </div>
                </li>
                <li className="flex items-center gap-6">
                  <span className="w-14 h-14 bg-gym-yellow/10 border border-gym-yellow/30 text-gym-yellow rounded-full flex items-center justify-center text-2xl shrink-0">✉️</span>
                  <div>
                    <p className="font-bold text-white uppercase text-sm tracking-widest mb-1">Email</p>
                    <p>geral@domusfit.pt</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* COLUNA DIREITA - Formulário */}
          <div className="bg-gym-dark p-8 rounded-xl border border-white/10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {status === 'success' && (
                <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-400 p-4 rounded text-center font-bold text-sm uppercase tracking-wider animate-fade-in">
                  Mensagem enviada com sucesso!
                </div>
              )}

              <div>
                <label className="block text-gray-400 text-sm mb-2 font-semibold">O teu nome</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none transition-colors"
                  placeholder="Ex: João Silva"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2 font-semibold">O teu email</label>
                <input 
                  type="email" 
                  required 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none transition-colors"
                  placeholder="joao@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2 font-semibold">Assunto</label>
                <input 
                  type="text" 
                  required 
                  value={formData.subject} 
                  onChange={(e) => setFormData({...formData, subject: e.target.value})} 
                  className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none transition-colors"
                  placeholder="Ex: Dúvida sobre o Plano Gold"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2 font-semibold">Mensagem</label>
                <textarea 
                  required 
                  rows="4" 
                  value={formData.message} 
                  onChange={(e) => setFormData({...formData, message: e.target.value})} 
                  className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none transition-colors resize-none"
                  placeholder="Escreve aqui a tua mensagem..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={status === 'loading'} 
                className="w-full bg-gym-yellow text-gym-black font-bold py-3 rounded uppercase tracking-widest hover:bg-white transition-colors cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-wait"
              >
                {status === 'loading' ? 'A enviar...' : 'Enviar Mensagem'}
              </button>

            </form>
          </div>

        </div>
      </div>
      <ScrollToTop />
    </div>
  );
}

export default Contact;