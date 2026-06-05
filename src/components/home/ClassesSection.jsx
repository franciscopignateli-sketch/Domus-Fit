import React from 'react';

// Coloquei este array de dados aqui fora do componente. 
// Como as aulas são fixas, reparei que se ficassem lá dentro o React ia 
// recriar isto sempre que a página atualizasse, o que tira um bocado de performance.
const classesData = [
  { title: "Cross Training", desc: "Alta intensidade, movimentos funcionais variados." },
  { title: "Powerlifting", desc: "Foco nos três grandes: Squat, Bench e Deadlift." },
  { title: "Boxe & Condição", desc: "Melhora a tua agilidade e resistência cardiovascular." },
];

function ClassesSection() {
  return (
    <section className="bg-gym-black py-20 px-6">
       <div className="container mx-auto">
          <h2 className="text-4xl font-bold uppercase text-center mb-12">
            Aulas de <span className="text-gym-yellow">Destaque</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {classesData.map((item, index) => (
              // Usei a tag article em vez de div para ficar mais semântico para o HTML
              <article key={index} className="bg-gym-dark p-8 border border-white/5 rounded-xl hover:border-gym-yellow transition-all duration-300 group hover:-translate-y-2">
                <div className="w-12 h-12 bg-gym-yellow mb-6 flex items-center justify-center group-hover:rotate-45 transition-transform">
                    <span className="text-gym-black font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gym-yellow transition-colors">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </article>
            ))}
          </div>
       </div>
    </section>
  );
}

export default ClassesSection;