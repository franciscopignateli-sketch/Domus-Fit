import { useState } from 'react';

function Tools() {
  const [activeTab, setActiveTab] = useState('imc'); // 'imc' ou 'calorias'

  // Estados IMC
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);

  // Estados Calorias
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState('1.2');
  const [calResult, setCalResult] = useState(null);

  const calculateBMI = (e) => {
    e.preventDefault();
    if (height && weight) {
      const h = height / 100; // converter cm para m
      const bmi = (weight / (h * h)).toFixed(1);
      setBmiResult(bmi);
    }
  };

  const calculateCalories = (e) => {
    e.preventDefault();
    // Fórmula de Harris-Benedict Simplificada
    let bmr;
    if (gender === 'male') {
      bmr = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
    } else {
      bmr = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
    }
    const total = Math.round(bmr * activity);
    setCalResult(total);
  };

  return (
    <div className="min-h-screen bg-gym-black pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-4xl font-extrabold text-white text-center mb-8 uppercase italic">
          Tools <span className="text-gym-yellow">&</span> Metrics
        </h1>

        {/* Abas */}
        <div className="flex bg-gym-dark p-1 rounded-lg mb-8 border border-white/10">
          <button 
            onClick={() => setActiveTab('imc')}
            className={`flex-1 py-3 rounded font-bold uppercase tracking-wider transition-all ${activeTab === 'imc' ? 'bg-white/10 text-gym-yellow shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Calculadora IMC
          </button>
          <button 
            onClick={() => setActiveTab('calorias')}
            className={`flex-1 py-3 rounded font-bold uppercase tracking-wider transition-all ${activeTab === 'calorias' ? 'bg-white/10 text-gym-yellow shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Calorias Diárias
          </button>
        </div>

        <div className="bg-gym-dark p-8 rounded-xl border border-white/10 shadow-2xl">
          
          {/* Calculadora IMC */}
          {activeTab === 'imc' && (
            <form onSubmit={calculateBMI} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Altura (cm)</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none" placeholder="180" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Peso (kg)</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none" placeholder="80" />
                </div>
              </div>
              <button className="w-full bg-gym-yellow text-gym-black font-bold py-3 rounded uppercase tracking-widest hover:bg-white transition-colors cursor-pointer">Calcular IMC</button>
              
              {bmiResult && (
                <div className="mt-6 p-4 bg-white/5 border border-gym-yellow rounded text-center animate-fade-in">
                  <p className="text-gray-400 text-sm uppercase">O teu IMC é</p>
                  <p className="text-4xl font-extrabold text-white">{bmiResult}</p>
                  <p className="text-gym-yellow text-sm mt-1">
                    {bmiResult < 18.5 ? "Abaixo do peso" : bmiResult < 25 ? "Peso Normal" : bmiResult < 30 ? "Sobrepeso" : "Obesidade"}
                  </p>
                </div>
              )}
            </form>
          )}

          {/* Calculadora Calorias */}
          {activeTab === 'calorias' && (
            <form onSubmit={calculateCalories} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Idade</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none" placeholder="25" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Género</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none">
                    <option value="male">Masculino</option>
                    <option value="female">Feminino</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Altura (cm)</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none" placeholder="180" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Peso (kg)</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none" placeholder="80" />
                </div>
              </div>
              <div>
                 <label className="block text-gray-400 text-sm mb-2">Nível de Atividade</label>
                 <select value={activity} onChange={(e) => setActivity(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-gym-yellow focus:outline-none">
                    <option value="1.2">Sedentário (Pouco ou nenhum exercício)</option>
                    <option value="1.375">Leve (1-3 dias/semana)</option>
                    <option value="1.55">Moderado (3-5 dias/semana)</option>
                    <option value="1.725">Intenso (6-7 dias/semana)</option>
                 </select>
              </div>

              <button className="w-full bg-gym-yellow text-gym-black font-bold py-3 rounded uppercase tracking-widest hover:bg-white transition-colors cursor-pointer">Calcular TMB</button>

              {calResult && (
                <div className="mt-6 p-4 bg-white/5 border border-gym-yellow rounded text-center animate-fade-in">
                  <p className="text-gray-400 text-sm uppercase">Gasto calórico estimado</p>
                  <p className="text-4xl font-extrabold text-white">{calResult} <span className="text-lg">kcal/dia</span></p>
                  <p className="text-gray-500 text-xs mt-2">Para manter o peso atual.</p>
                </div>
              )}
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default Tools;