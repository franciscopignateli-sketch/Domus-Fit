import { useState, useMemo } from 'react';

// Movido para fora do componente: 
// Evita recriar a base de dados na memória a cada renderização do React.
const foodDatabase = [
  { id: 1, name: "Banana (100g)", kcal: 89, prot: 1.1, carbs: 22.8, fat: 0.3 },
  { id: 2, name: "Peito de Frango Grelhado (100g)", kcal: 165, prot: 31, carbs: 0, fat: 3.6 },
  { id: 3, name: "Arroz Branco Cozido (100g)", kcal: 130, prot: 2.7, carbs: 28, fat: 0.3 },
  { id: 4, name: "Ovo Cozido (1 unidade)", kcal: 78, prot: 6, carbs: 0.6, fat: 5 },
  { id: 5, name: "Aveia em Flocos (50g)", kcal: 190, prot: 6.5, carbs: 33, fat: 3.5 },
  { id: 6, name: "Whey Protein (1 scoop - 30g)", kcal: 120, prot: 24, carbs: 3, fat: 1.5 },
  { id: 7, name: "Manteiga de Amendoim (1 c.sopa - 15g)", kcal: 90, prot: 4, carbs: 3, fat: 8 },
  { id: 8, name: "Maçã (1 unidade média)", kcal: 95, prot: 0.5, carbs: 25, fat: 0.3 },
  { id: 9, name: "Batata Doce Cozida (100g)", kcal: 86, prot: 1.6, carbs: 20, fat: 0.1 },
  { id: 10, name: "Azeite (1 c.sopa - 15ml)", kcal: 119, prot: 0, carbs: 0, fat: 13.5 },
];

function Tools() {
  const [activeTab, setActiveTab] = useState('imc'); 

  // ESTADOS IMC 
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);

  // ESTADOS CALORIAS (TMB) 
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState('1.2');
  const [calResult, setCalResult] = useState(null);

  // ESTADOS CONTADOR MACROS
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [consumedFoods, setConsumedFoods] = useState([]);

  const calculateBMI = (e) => {
    e.preventDefault();
    if (height && weight) {
      const h = height / 100;
      const bmi = (weight / (h * h)).toFixed(1);
      setBmiResult(bmi);
    }
  };

  const calculateCalories = (e) => {
    e.preventDefault();
    let bmr;
    // Fórmula de Harris-Benedict (revisto para a PAP)
    if (gender === 'male') {
      bmr = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
    } else {
      bmr = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
    }
    const total = Math.round(bmr * activity);
    setCalResult(total);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Otimização: Apenas começa a filtrar após a segunda letra digitada
    if (query.length > 1) {
      const filtered = foodDatabase.filter(food => 
        food.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const addFood = (food) => {
    setConsumedFoods([...consumedFoods, food]);
    setSearchQuery(''); 
    setSuggestions([]); 
  };

  const removeFood = (indexToRemove) => {
    setConsumedFoods(consumedFoods.filter((_, index) => index !== indexToRemove));
  };

  // Implementei o useMemo aqui.
  // Antes, sempre que eu digitava uma letra no input de pesquisa (atualizando o estado searchQuery), 
  // o React recalculava a soma total dos macros. Com o useMemo, a soma só acontece
  // quando a lista 'consumedFoods' é efetivamente alterada (adicionar/remover alimento).
  const totalMacros = useMemo(() => {
    return consumedFoods.reduce((acc, food) => {
      return {
        kcal: acc.kcal + food.kcal,
        prot: acc.prot + food.prot,
        carbs: acc.carbs + food.carbs,
        fat: acc.fat + food.fat
      };
    }, { kcal: 0, prot: 0, carbs: 0, fat: 0 });
  }, [consumedFoods]);

  return (
    <div className="min-h-screen bg-gym-black pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold text-white text-center mb-8 uppercase italic">
          Tools <span className="text-gym-yellow">&</span> Metrics
        </h1>

        <div className="flex flex-col md:flex-row bg-gym-dark p-1 rounded-lg mb-8 border border-white/10 gap-1">
          <button 
            onClick={() => setActiveTab('imc')}
            className={`flex-1 py-3 rounded font-bold uppercase tracking-wider text-xs md:text-sm transition-all cursor-pointer ${activeTab === 'imc' ? 'bg-white/10 text-gym-yellow shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Calc. IMC
          </button>
          <button 
            onClick={() => setActiveTab('calorias')}
            className={`flex-1 py-3 rounded font-bold uppercase tracking-wider text-xs md:text-sm transition-all cursor-pointer ${activeTab === 'calorias' ? 'bg-white/10 text-gym-yellow shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            TMB (Metabolismo)
          </button>
          <button 
            onClick={() => setActiveTab('macros')}
            className={`flex-1 py-3 rounded font-bold uppercase tracking-wider text-xs md:text-sm transition-all cursor-pointer ${activeTab === 'macros' ? 'bg-white/10 text-gym-yellow shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Diário Macros
          </button>
        </div>

        <div className="bg-gym-dark p-8 rounded-xl border border-white/10 shadow-2xl min-h-100">
          
          {/* ================= ABA 1: CALCULADORA IMC ================= */}
          {activeTab === 'imc' && (
            <form onSubmit={calculateBMI} className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-white uppercase mb-4 border-b border-white/10 pb-2">Índice de Massa Corporal</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2 font-semibold">Altura (cm)</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none" placeholder="180" required />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2 font-semibold">Peso (kg)</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none" placeholder="80" required />
                </div>
              </div>
              <button type="submit" className="w-full bg-gym-yellow text-gym-black font-bold py-3 rounded uppercase tracking-widest hover:bg-white transition-colors cursor-pointer">Calcular IMC</button>
              
              {bmiResult && (
                <div className="mt-6 p-6 bg-white/5 border border-gym-yellow rounded-lg text-center animate-fade-in-up">
                  <p className="text-gray-400 text-sm uppercase font-bold tracking-widest mb-2">O teu resultado</p>
                  <p className="text-5xl font-black text-white">{bmiResult}</p>
                  <p className={`text-sm mt-3 font-bold uppercase px-3 py-1 inline-block rounded-full ${
                    bmiResult < 18.5 ? "bg-blue-500/20 text-blue-400" : 
                    bmiResult < 25 ? "bg-emerald-500/20 text-emerald-400" : 
                    bmiResult < 30 ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"
                  }`}>
                    {bmiResult < 18.5 ? "Abaixo do peso" : bmiResult < 25 ? "Peso Normal" : bmiResult < 30 ? "Sobrepeso" : "Obesidade"}
                  </p>
                </div>
              )}
            </form>
          )}

          {/* ================= ABA 2: CALCULADORA CALORIAS ================= */}
          {activeTab === 'calorias' && (
            <form onSubmit={calculateCalories} className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-white uppercase mb-4 border-b border-white/10 pb-2">Gasto Calórico Basal</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-gray-400 text-sm mb-2 font-semibold">Idade</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none" placeholder="25" required />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-gray-400 text-sm mb-2 font-semibold">Género</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none cursor-pointer">
                    <option value="male">Masc.</option>
                    <option value="female">Fem.</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-gray-400 text-sm mb-2 font-semibold">Altura (cm)</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none" placeholder="180" required />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-gray-400 text-sm mb-2 font-semibold">Peso (kg)</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none" placeholder="80" required />
                </div>
              </div>
              <div>
                 <label className="block text-gray-400 text-sm mb-2 font-semibold">Fator de Atividade</label>
                 <select value={activity} onChange={(e) => setActivity(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none cursor-pointer">
                    <option value="1.2">Sedentário (Trabalho de secretária)</option>
                    <option value="1.375">Leve (Treino 1-3 dias/semana)</option>
                    <option value="1.55">Moderado (Treino 3-5 dias/semana)</option>
                    <option value="1.725">Intenso (Treino 6-7 dias/semana)</option>
                 </select>
              </div>
              <button type="submit" className="w-full bg-gym-yellow text-gym-black font-bold py-3 rounded uppercase tracking-widest hover:bg-white transition-colors cursor-pointer">Calcular TMB</button>

              {calResult && (
                <div className="mt-6 p-6 bg-white/5 border border-gym-yellow rounded-lg text-center animate-fade-in-up">
                  <p className="text-gray-400 text-sm uppercase font-bold tracking-widest mb-2">Para manter o peso precisas de</p>
                  <p className="text-5xl font-black text-white">{calResult} <span className="text-xl text-gym-yellow font-bold uppercase">kcal/dia</span></p>
                  <div className="flex flex-col md:flex-row justify-center gap-4 mt-4 text-xs uppercase font-bold">
                    <span className="bg-red-500/20 text-red-400 px-3 py-2 rounded">Perder Peso: {calResult - 300} kcal</span>
                    <span className="bg-emerald-500/20 text-emerald-400 px-3 py-2 rounded">Ganhar Massa: {calResult + 300} kcal</span>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* ================= ABA 3: DIÁRIO DE MACROS ================= */}
          {activeTab === 'macros' && (
            <div className="animate-fade-in flex flex-col h-full">
              <h2 className="text-2xl font-bold text-white uppercase mb-4 border-b border-white/10 pb-2">Registo Alimentar</h2>
              
              <div className="relative mb-8">
                <label className="block text-gray-400 text-sm mb-2 font-semibold">Procurar Alimento</label>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none" 
                  placeholder="Ex: banana, frango, whey..." 
                />
                
                {suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/10 rounded-lg shadow-2xl overflow-hidden">
                    {suggestions.map(food => (
                      <li 
                        key={food.id} 
                        onClick={() => addFood(food)}
                        className="p-3 hover:bg-white/10 cursor-pointer flex justify-between items-center text-sm border-b border-white/5 last:border-0"
                      >
                        <span className="text-white font-bold">{food.name}</span>
                        <span className="text-gym-yellow font-mono">{food.kcal} kcal</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grow mb-8">
                <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-3 font-bold">Alimentos Adicionados</h3>
                {consumedFoods.length === 0 ? (
                  <div className="text-center p-8 border-2 border-dashed border-white/10 rounded-lg text-gray-500">
                    Nenhum alimento adicionado hoje. Pesquisa acima para começar!
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {consumedFoods.map((food, index) => (
                      <li key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 animate-fade-in">
                        <div>
                          <span className="text-white block font-bold text-sm">{food.name}</span>
                          <span className="text-xs text-gray-500">
                            P: {food.prot}g | C: {food.carbs}g | G: {food.fat}g
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-gym-yellow font-mono font-bold">{food.kcal} kcal</span>
                          <button 
                            onClick={() => removeFood(index)}
                            className="text-gray-500 hover:text-red-500 cursor-pointer"
                            title="Remover"
                          >
                            ✕
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                <p className="text-center text-gray-400 text-xs uppercase tracking-widest font-bold mb-3">Totais do Dia</p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-gym-yellow/10 border border-gym-yellow/30 p-2 rounded">
                    <p className="text-[10px] md:text-xs text-gym-yellow uppercase font-bold">Calorias</p>
                    <p className="text-lg md:text-xl font-black text-white">{totalMacros.kcal.toFixed(0)}</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 p-2 rounded">
                    <p className="text-[10px] md:text-xs text-blue-400 uppercase font-bold">Prot.</p>
                    <p className="text-lg md:text-xl font-black text-white">{totalMacros.prot.toFixed(1)}g</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-2 rounded">
                    <p className="text-[10px] md:text-xs text-emerald-400 uppercase font-bold">Carbs</p>
                    <p className="text-lg md:text-xl font-black text-white">{totalMacros.carbs.toFixed(1)}g</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 p-2 rounded">
                    <p className="text-[10px] md:text-xs text-red-400 uppercase font-bold">Gordura</p>
                    <p className="text-lg md:text-xl font-black text-white">{totalMacros.fat.toFixed(1)}g</p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Tools;