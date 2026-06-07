import HeroCarousel from '../components/home/HeroCarousel';
import DescriptionSection from '../components/home/DescriptionSection';
import ClassesSection from '../components/home/ClassesSection';
import TrainersSection from '../components/home/TrainersSection';
import CtaSection from '../components/home/CtaSection';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/layout/ScrollToTop';

function Home() {
  return (
    <>
      <HeroCarousel />
      <DescriptionSection />
      <ClassesSection />
      <TrainersSection />
      <CtaSection />
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default Home;