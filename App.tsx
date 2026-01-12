
import React, { useState, useEffect } from 'react';
import { MealTime, Recipe } from './types';
import { generateRecipes, generateRecipeImage } from './services/geminiService';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState('');
  const [mealTime, setMealTime] = useState<MealTime>('아침');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    setLoading(true);
    setRecipes([]);
    setStatusMessage('쉐프가 영감을 기록하고 있습니다...');

    try {
      const generatedRecipes = await generateRecipes(ingredients, mealTime);
      setRecipes(generatedRecipes);
      setStatusMessage('미적 구성을 시각화하는 중입니다...');

      const recipesWithImages = await Promise.all(
        generatedRecipes.map(async (recipe) => {
          const imageUrl = await generateRecipeImage(recipe.title);
          return { ...recipe, imageUrl };
        })
      );

      setRecipes(recipesWithImages);
    } catch (error) {
      console.error(error);
      alert('오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="min-h-screen selection:bg-[var(--point-primary)] selection:text-white">
      <style>{`
        :root {
          --point-primary: #008080; 
          --point-secondary: #BFFF00;
          --bg-main: #FFFFFF;
          --frame-color: rgba(0, 0, 0, 0.1);
          --unified-lh: 1.1;
          --text-faint: rgba(0, 0, 0, 0.5);
          --text-muted: rgba(0, 0, 0, 0.7);
        }
        .dark {
          --point-primary: #00FFCC; 
          --point-secondary: #FF4D00;
          --bg-main: #050505;
          --frame-color: rgba(255, 255, 255, 0.1);
          --text-faint: rgba(255, 255, 255, 0.6);
          --text-muted: rgba(255, 255, 255, 0.8);
        }
        
        .title-reveal {
          animation: reveal 1.2s cubic-bezier(0.77, 0, 0.175, 1);
        }
        @keyframes reveal {
          0% { transform: translateY(100%); clip-path: inset(0 0 100% 0); }
          100% { transform: translateY(0); clip-path: inset(0 0 0 0); }
        }
        
        input::placeholder {
          opacity: 0.3;
          font-weight: 300;
        }

        .app-frame {
          position: fixed;
          inset: 1rem;
          border: 1px solid var(--frame-color);
          pointer-events: none;
          z-index: 90;
        }
        
        h2, h3 {
          line-height: var(--unified-lh) !important;
          font-weight: 700 !important; /* 가독성을 위해 볼드 처리 */
        }
        
        .faint-text { color: var(--text-faint); }
        .muted-text { color: var(--text-muted); }
      `}</style>

      <div className="app-frame" />

      <header className="fixed top-0 w-full z-[100] px-8 py-8 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto group">
          <div className="w-[1px] h-8 transition-all duration-500 group-hover:h-12 bg-current opacity-40"></div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold tracking-[0.4em] uppercase leading-none">Palette</h1>
            <span className="text-[8px] font-bold tracking-[0.6em] uppercase faint-text">AI Atelier</span>
          </div>
        </div>
        
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full border border-current/20 backdrop-blur-sm transition-all hover:scale-110 active:scale-90"
        >
          {isDarkMode ? (
            <svg className="w-4 h-4 text-[#00FFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.344l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
          ) : (
            <svg className="w-4 h-4 text-[#008080]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 118.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          )}
        </button>
      </header>

      <main className="relative max-w-5xl mx-auto px-8 md:px-16">
        <section className="min-h-[90vh] flex flex-col justify-center pt-24 pb-20">
          <div className="overflow-hidden mb-6">
            <span className="inline-block text-[9px] font-bold tracking-[1em] uppercase faint-text title-reveal">Epicurean Discovery</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-left">
            <div className="overflow-hidden">
               <span className="inline-block title-reveal">당신의</span>
            </div>
            <div className="overflow-hidden">
               <span className="inline-block title-reveal" style={{ animationDelay: '0.1s' }}>냉장고 속</span>
            </div>
            <div className="overflow-hidden mt-4">
               <span className="inline-block title-reveal" style={{ color: 'var(--point-primary)', animationDelay: '0.2s' }}>숨겨진 미식</span>
            </div>
          </h2>

          <div className="max-w-xl text-left animate-in fade-in slide-in-from-left-6 duration-1000 delay-500 mb-16">
            <p className="text-lg md:text-xl font-normal leading-relaxed muted-text tracking-tight">
              가장 평범한 재료가 예술적인 한 끼로 <br />
              재탄생하는 순간을 포착합니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-16">
            <div className="grid md:grid-cols-2 gap-16">
              <div className="space-y-6">
                <label className="text-[9px] font-bold uppercase tracking-[0.8em] faint-text">Interval</label>
                <div className="flex flex-col items-start gap-4">
                  {(['아침', '점심', '저녁'] as MealTime[]).map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setMealTime(time)}
                      className="group relative flex items-center"
                    >
                      <span className={`text-3xl md:text-4xl font-bold transition-all duration-700 ${mealTime === time ? 'opacity-100 translate-x-4' : 'opacity-20 hover:opacity-40 translate-x-0'}`}>
                        {time}
                      </span>
                      {mealTime === time && (
                        <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--point-secondary)' }}></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[9px] font-bold uppercase tracking-[0.8em] faint-text">Inventory</label>
                <div className="relative group">
                  <input
                    type="text"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="계란, 우유, 베이컨..."
                    className="w-full bg-transparent border-none py-4 text-2xl md:text-4xl font-bold outline-none transition-all duration-500"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-current opacity-20"></div>
                  <div 
                    className={`absolute bottom-0 left-0 h-[1.5px] transition-all duration-1000 ease-in-out ${ingredients ? 'w-full' : 'w-0'}`}
                    style={{ backgroundColor: 'var(--point-primary)' }}
                  ></div>
                </div>
                <p className="text-[8px] font-bold tracking-[0.2em] uppercase faint-text">Use commas to divide.</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-6 rounded-full text-[9px] font-bold tracking-[1em] uppercase transition-all duration-700 border border-current hover:bg-current hover:text-[var(--bg-main)] ${
                loading ? 'opacity-20 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {loading ? 'Crafting...' : 'Reveal My Palette'}
            </button>
          </form>
        </section>

        {loading && (
          <div className="fixed inset-0 z-[200] bg-[var(--bg-main)]/95 flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
            <div className="w-px h-24 bg-current opacity-10 mb-8"></div>
            <p className="text-[9px] font-bold tracking-[1em] uppercase animate-pulse text-center pl-[1em]">{statusMessage}</p>
            <div className="w-px h-24 bg-current opacity-10 mt-8"></div>
          </div>
        )}

        {recipes.length > 0 && (
          <div className="space-y-64 pb-48">
            {recipes.map((recipe, index) => (
              <RecipeDisplay key={recipe.id} recipe={recipe} index={index} />
            ))}
          </div>
        )}
      </main>

      <footer className="py-32 px-8 border-t border-current/5 relative z-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tighter">Chef's Palette</h2>
            <p className="text-[9px] font-medium tracking-widest max-w-xs leading-relaxed uppercase faint-text">
              일상의 재료에서 발견하는 새로운 가치.
            </p>
          </div>
          <span className="text-[8px] font-bold tracking-[0.6em] faint-text uppercase opacity-50">© 2024 AI CULINARY ART STUDIO</span>
        </div>
      </footer>
    </div>
  );
};

interface RecipeDisplayProps {
  recipe: Recipe;
  index: number;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, index }) => {
  return (
    <article className="grid md:grid-cols-12 gap-16 items-start animate-in fade-in slide-in-from-left-12 duration-1000">
      <div className="md:col-span-6">
        <div className="relative group rounded-[2rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-xl">
           <div className="absolute top-8 left-8 z-10 pointer-events-none">
              <span className="text-6xl font-bold opacity-10 leading-none tracking-tighter">0{index + 1}</span>
           </div>
           <div className="aspect-[4/5] overflow-hidden">
             {recipe.imageUrl ? (
                <img 
                  src={recipe.imageUrl} 
                  alt={recipe.title} 
                  className="w-full h-full object-cover transition-transform duration-[6s] group-hover:scale-105"
                />
             ) : (
                <div className="w-full h-full flex items-center justify-center">
                   <div className="w-6 h-6 border border-current opacity-10 rounded-full animate-spin"></div>
                </div>
             )}
           </div>
        </div>
      </div>

      <div className="md:col-span-6 space-y-12 text-left pt-6">
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="w-8 h-[1px] bg-current opacity-20"></span>
            <span className="text-[8px] font-bold tracking-[0.6em] uppercase faint-text">Philosophy</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tighter">
            {recipe.title}
          </h3>
          <p className="text-lg font-normal muted-text leading-relaxed tracking-tight">
            {recipe.description}
          </p>
        </section>

        <section className="space-y-6 pt-6 border-t border-current/5">
          <h4 className="text-[8px] font-bold uppercase tracking-[0.8em] faint-text">Palette</h4>
          <ul className="space-y-3">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-center gap-4 group">
                <div className="w-1 h-1 rounded-full opacity-40 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: 'var(--point-secondary)' }}></div>
                <span className="text-base font-normal muted-text group-hover:opacity-100 transition-opacity">{ing}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-8 pt-6 border-t border-current/5">
          <h4 className="text-[8px] font-bold uppercase tracking-[0.8em] faint-text">Method</h4>
          <div className="space-y-10">
            {recipe.instructions.map((step, i) => (
              <div key={i} className="flex gap-8 group">
                <span className="text-xl font-bold opacity-30 group-hover:opacity-100 shrink-0" style={{ color: 'var(--point-primary)' }}>
                  {(i + 1).toString().padStart(2, '0')}
                </span>
                <p className="text-base font-normal leading-relaxed muted-text group-hover:opacity-100 transition-opacity flex-1 pb-4">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
};

export default App;
