import { useState, useEffect } from 'react';

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // window.scrollY substitui o window.pageYOffset que está descontinuado nos browsers modernos
  // Apenas ativa o botão se o scroll vertical for superior a 300px
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // behavior: 'smooth' aplica uma animação de subida em vez de um salto instantâneo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // O botão só é renderizado no DOM se o estado isVisible for true
  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 bg-gym-yellow text-gym-black p-4 rounded-full shadow-lg hover:bg-yellow-400 transition-all hover:scale-110 z-50 cursor-pointer animate-bounce"
      aria-label="Subir ao topo"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
      </svg>
    </button>
  );
}

export default ScrollToTop;