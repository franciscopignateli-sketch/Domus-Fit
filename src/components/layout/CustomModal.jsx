import { useEffect } from 'react';

function CustomModal({ isOpen, onClose, title, message, type = 'success' }) {
  // Fecha o modal ao carregar na tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Fundo desfocado com clique para fechar */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      ></div>

      {/* Caixa do Pop-up */}
      <div className={`relative bg-gym-dark border-2 rounded-xl p-8 max-w-sm w-full text-center shadow-2xl transform scale-100 transition-all ${
        type === 'error' ? 'border-red-500' : 'border-gym-yellow'
      }`}>
        
        {/* Ícone Gigante Dinâmico */}
        <div className="text-5xl mb-4 select-none">
          {type === 'error' ? '❌' : '💪'}
        </div>

        {/* Título */}
        <h3 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2">
          {title || (type === 'error' ? 'Erro!' : 'Sucesso!')}
        </h3>

        {/* Mensagem descritiva */}
        <p className="text-gray-300 text-sm leading-relaxed mb-6">
          {message}
        </p>

        {/* Botão de Fecho */}
        <button
          onClick={onClose}
          className={`w-full py-3 rounded font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer ${
            type === 'error' 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-gym-yellow text-gym-black hover:bg-white'
          }`}
        >
          Ok, entendi
        </button>
      </div>
    </div>
  );
}

export default CustomModal;