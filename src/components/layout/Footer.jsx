import { Link } from 'react-router-dom';
import logo from '../../assets/Logo_Trans.png';

function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-12 border-t border-white/10">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-white/10 pb-8">
          
          <div>
            <Link to="/" className="block mb-4">
              {/* Apliquei um efeito grayscale que desaparece no hover. Fica muito premium! */}
              <img 
                src={logo} 
                alt="Domus Fit Logo" 
                className="h-20 w-auto grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300" 
              />
            </Link>
            <p className="text-sm">
              Mais do que um ginásio, uma casa para a tua evolução. Treino, foco e resultados.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-gym-yellow transition-colors">Sobre Nós</Link></li>
              <li><Link to="/schedule" className="hover:text-gym-yellow transition-colors">Horário de Aulas</Link></li>
              <li><Link to="/membership" className="hover:text-gym-yellow transition-colors">Planos e Preços</Link></li>
              <li><Link to="/tools" className="hover:text-gym-yellow transition-colors">Ferramentas (IMC/Calorias)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase mb-4">Contactos</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">📍 Rua do Ginásio, 123, Funchal</li>
              <li className="flex items-center gap-2">📞 +351 912 345 678</li>
              <li className="flex items-center gap-2">✉️ geral@domusfit.pt</li>
            </ul>
          </div>
        </div>

        {/* new Date().getFullYear() atualiza o ano do copyright automaticamente sem manutenção manual */}
        <div className="text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} Domus Fit. Projeto de PAP. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

export default Footer;