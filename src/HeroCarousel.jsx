import { useState, useEffect } from 'react';

function HeroCarousel() {
  const slides = [
    { 
      img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
      title: "Define o Teu Limite",
      subtitle: "Treino de alta intensidade na Domus Fit."
    },
    { 
      img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1475&auto=format&fit=crop",
      title: "Força Pura",
      subtitle: "Equipamento de ponta para a tua evolução."
    },
    { 
      img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop",
      title: "Comunidade",
      subtitle: "Junta-te à família que nunca desiste."
    },
  ];

  const [curr, setCurr] = useState(0);

  const prev = () => setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
  const next = () => setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));

  // Autoplay: muda de slide a cada 5 segundos
  useEffect(() => {
    const slideInterval = setInterval(next, 5000);
    // Limpa o intervalo se o componente for desmontado ou o utilizador clicar
    return () => clearInterval(slideInterval);
  }, [curr]); // Adicionar [curr] reinicia o timer quando o slide muda

  return (
    <div className="relative w-full h-screen overflow-hidden group">
      {/* Container dos Slides - Move-se com transform translate */}
      <div 
        className="flex transition-transform ease-out duration-700 h-full" 
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full h-full shrink-0 relative">
            <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.img})` }}
            ></div>
            <div className="absolute inset-0 bg-black/60"></div>
            
            {/* Texto */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
              <h1 className="text-5xl md:text-7xl font-extrabold text-white uppercase italic mb-4 drop-shadow-xl animate-fade-in-up">
                <span className="text-gym-yellow">{slide.title}</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mb-8 font-light">
                {slide.subtitle}
              </p>
              <button className="bg-gym-yellow text-gym-black px-8 py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors cursor-pointer">
                Começar Hoje
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Setas de Navegação (Esquerda) */}
      <button 
        onClick={prev} 
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 hover:bg-gym-yellow hover:text-black text-white rounded-full transition-all cursor-pointer opacity-0 group-hover:opacity-100 z-20"
      >
        <svg size={40} className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
      </button>

      {/* Setas de Navegação (Direita) */}
      <button 
        onClick={next} 
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 hover:bg-gym-yellow hover:text-black text-white rounded-full transition-all cursor-pointer opacity-0 group-hover:opacity-100 z-20"
      >
        <svg size={40} className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Indicadores (Bolinhas) */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
        {slides.map((_, i) => (
          <div 
            key={i}
            onClick={() => setCurr(i)}
            className={`transition-all w-3 h-3 rounded-full cursor-pointer ${curr === i ? "bg-gym-yellow w-8" : "bg-white/50 hover:bg-white"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroCarousel;