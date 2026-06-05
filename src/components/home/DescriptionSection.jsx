import { Link } from 'react-router-dom';

function DescriptionSection() {
  return (
    <section className="bg-gym-dark py-20 px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
            <img 
                src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop" 
                alt="Atleta no ginásio" 
                className="rounded-lg shadow-2xl border-b-4 border-r-4 border-gym-yellow"
            />
        </div>
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl font-bold uppercase">
            Mais do que um <span className="text-gym-yellow">Ginásio</span>
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            No Domus Fit, não alugamos apenas máquinas. Construímos atletas. O nosso espaço foi desenhado para focar no essencial: o teu progresso. Sem distrações, apenas ferro, suor e resultados.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed">
            Temos treinadores dedicados, áreas de peso livre expansivas e um ambiente que te empurra para superar o teu recorde pessoal todos os dias.
          </p>
          
          {/* Troquei aqui o href="#" pelo Link apontando para o about para ligar bem as páginas */}
          <Link to="/about" className="inline-block mt-4 text-gym-yellow font-bold border-b-2 border-gym-yellow hover:text-white hover:border-white transition-colors uppercase tracking-wider">
            Conhece o Espaço &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

export default DescriptionSection;