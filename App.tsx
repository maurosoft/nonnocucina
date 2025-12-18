import React, { useState } from 'react';
import { ChefHat, Loader2, UtensilsCrossed } from 'lucide-react';
import IngredientSelector from './components/IngredientSelector';
import Preferences from './components/Preferences';
import RecipeCard from './components/RecipeCard';
import { generateRecipe } from './services/geminiService';
import { RecipeRequest, RecipeResponse, CourseType } from './types';

const App: React.FC = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [customIngredients, setCustomIngredients] = useState('');
  const [mealType, setMealType] = useState<'pranzo' | 'cena'>('pranzo');
  const [courseType, setCourseType] = useState<CourseType>('sorpresa');
  const [peopleCount, setPeopleCount] = useState(2);
  const [intolerances, setIntolerances] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleIngredient = (name: string) => {
    setSelectedIngredients(prev => 
      prev.includes(name) 
        ? prev.filter(i => i !== name) 
        : [...prev, name]
    );
  };

  const handleGenerate = async () => {
    if (selectedIngredients.length === 0 && !customIngredients.trim()) {
      setError("NonnoWeb ha bisogno di almeno un ingrediente per iniziare!");
      return;
    }

    setLoading(true);
    setError(null);

    const request: RecipeRequest = {
      selectedIngredients,
      customIngredients,
      mealType,
      courseType,
      peopleCount,
      intolerances
    };

    try {
      const result = await generateRecipe(request);
      setRecipe(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError("Oh no! A NonnoWeb è caduta la farina sugli occhiali. Riprova tra poco.");
    } finally {
      setLoading(false);
    }
  };

  const resetApp = () => {
    setRecipe(null);
    setSelectedIngredients([]);
    setCustomIngredients('');
    setIntolerances('');
    setPeopleCount(2);
    setCourseType('sorpresa');
    setError(null);
  };

  if (recipe) {
    return (
      <div className="min-h-screen bg-stone-100 py-8 px-4 print:bg-white print:p-0">
         <header className="max-w-4xl mx-auto mb-8 flex items-center justify-between print:hidden">
            <div className="flex items-center gap-3">
              <div className="bg-nonno-600 p-2 rounded-lg text-white">
                <ChefHat size={32} />
              </div>
              <h1 className="text-2xl font-serif font-bold text-nonno-900">NonnoWeb</h1>
            </div>
         </header>
        <RecipeCard recipe={recipe} onReset={resetApp} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] print:bg-white">
      
      {/* Header */}
      <header className="bg-white border-b border-nonno-200 sticky top-0 z-50 shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-nonno-400 to-nonno-600 p-3 rounded-xl text-white shadow-lg transform rotate-3">
              <ChefHat size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-800 tracking-tight">NonnoWeb</h1>
              <p className="text-sm text-gray-500 font-sans hidden sm:block">La saggezza in cucina</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-12 print:hidden">
        
        {/* Intro */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-nonno-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <img 
              src="https://image.pollinations.ai/prompt/cute%20smiling%20italian%20grandpa%20chef%20with%20moustache%20and%20chef%20hat%20holding%20a%20wooden%20spoon%20cartoon%20illustration%20warm%20colors%20white%20background?width=300&height=300&model=flux&nologo=true" 
              alt="NonnoWeb Chef" 
              className="relative w-48 h-48 md:w-56 md:h-56 object-cover rounded-full border-4 border-white shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-nonno-900 leading-tight">
              NonnoWeb in Cucina
            </h2>
            <p className="text-xl text-gray-600 font-medium max-w-lg mx-auto leading-relaxed">
              "Dimmi cosa hai in dispensa e nel frigo e ti preparo una buonissima ricetta."
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm flex items-start gap-3">
            <UtensilsCrossed className="text-red-500 shrink-0 mt-1" />
            <p className="text-red-700 font-bold">{error}</p>
          </div>
        )}

        {/* Main Interface */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <IngredientSelector 
              selected={selectedIngredients} 
              onToggle={toggleIngredient}
              customIngredients={customIngredients}
              onCustomChange={setCustomIngredients}
            />
          </div>

          <div className="lg:col-span-1">
             <div className="sticky top-28 space-y-6">
                <Preferences 
                  mealType={mealType}
                  setMealType={setMealType}
                  courseType={courseType}
                  setCourseType={setCourseType}
                  peopleCount={peopleCount}
                  setPeopleCount={setPeopleCount}
                  intolerances={intolerances}
                  setIntolerances={setIntolerances}
                />

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className={`
                    w-full py-5 px-6 rounded-2xl text-white font-bold text-xl font-serif shadow-xl transition-all
                    flex items-center justify-center gap-3
                    ${loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-tomato-500 to-tomato-600 hover:from-tomato-600 hover:to-tomato-700 hover:scale-[1.02]'}
                  `}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      Nonno sta pensando...
                    </>
                  ) : (
                    <>
                      <UtensilsCrossed size={24} />
                      Chiedi a Nonno
                    </>
                  )}
                </button>
                
                <div className="text-center text-gray-400 text-sm italic">
                  NonnoWeb usa l'IA per suggerire ricette. Controlla sempre gli ingredienti per sicurezza.
                </div>
             </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default App;