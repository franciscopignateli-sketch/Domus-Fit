import { Link } from 'react-router-dom';

function CtaSection() {
  return (
    <section className="py-20 bg-gym-yellow relative overflow-hidden">
      {/* Padrão de fundo subtil */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [bg-size:16px_16px]"></div>
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-gym-black uppercase italic mb-6">
          Pronto para mudar a tua vida?
        </h2>
        <p className="text-gym-dark text-lg mb-10 font-medium max-w-2xl mx-auto">
          Junta-te ao Domus Fit hoje. Escolhe o plano perfeito para ti e começa a treinar sem limites. O teu futuro corpo agradece.
        </p>
        <Link 
          to="/membership" 
          className="inline-block bg-gym-black text-gym-yellow font-black uppercase tracking-widest py-4 px-10 rounded hover:bg-white hover:text-black transition-colors duration-300 shadow-2xl"
        >
          Ver Planos & Preços
        </Link>
      </div>
    </section>
  );
}

export default CtaSection;