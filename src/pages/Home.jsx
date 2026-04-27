import HeroCarousel from '../components/home/HeroCarousel';
import DescriptionSection from '../components/home/DescriptionSection';
import ClassesSection from '../components/home/ClassesSection';
import ScrollToTop from '../components/layout/ScrollToTop';

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