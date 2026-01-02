import HeroCarousel from './HeroCarousel';
import DescriptionSection from './DescriptionSection';
import ClassesSection from './ClassesSection';
import ScrollToTop from './ScrollToTop';

function Home() {
  return (
    // Usamos um fragment (<>...</>) porque temos múltiplos elementos raiz
    <>
      <HeroCarousel />
      <DescriptionSection />
      <ClassesSection />
      
      {/* Secção extra só para termos scroll suficiente para o botão aparecer */}
      <section className="h-96 bg-gym-dark flex items-center justify-center">
        <p className="text-gray-500 uppercase tracking-widest">Mais conteúdo em breve...</p>
      </section>

      {/* O botão fica aqui, ele gere a sua própria visibilidade */}
      <ScrollToTop />
    </>
  );
}

export default Home;