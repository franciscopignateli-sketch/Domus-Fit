import { useState, useEffect } from 'react';

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Função para verificar a posição do scroll
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Função para subir ao topo suavemente
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Adicionar o listener quando o componente monta
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    // Limpar o listener quando desmonta
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    // Renderiza o botão apenas se isVisible for true
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          // Botão fixo no canto inferior direito, amarelo com seta preta
          className="fixed bottom-8 right-8 bg-gym-yellow text-gym-black p-4 rounded-full shadow-lg hover:bg-yellow-400 transition-all hover:scale-110 z-50 cursor-pointer animate-bounce"
          aria-label="Subir ao topo"
        >
          {/* Seta SVG simples */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
          </svg>
        </button>
      )}
    </>
  );
}

export default ScrollToTop;