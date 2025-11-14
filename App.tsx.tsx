import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import { SearchBar } from './components/SearchBar';
import { RecipeCard } from './components/RecipeCard';
import { Recipe, SearchMode } from './types';
import { findRecipesByIngredients, findRecipeByName } from './services/geminiService';
import AuthPage from './components/AuthPage';

const RecipeFinder: React.FC<{onLogout: () => void}> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<SearchMode>(SearchMode.BY_INGREDIENTS);
  const [inputValue, setInputValue] = useState('');
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userIngredients, setUserIngredients] = useState<string[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setError(null);
    setRecipes(null);

    try {
      let foundRecipes: Recipe[];
      if (activeTab === SearchMode.BY_INGREDIENTS) {
        setUserIngredients(inputValue.split(',').map(s => s.trim()));
        foundRecipes = await findRecipesByIngredients(inputValue);
      } else {
        setUserIngredients([]);
        foundRecipes = await findRecipeByName(inputValue);
      }
      setRecipes(foundRecipes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholder = () => {
    return activeTab === SearchMode.BY_INGREDIENTS
      ? "Digite os ingredientes que você tem, separados por vírgula..."
      : "Qual receita você gostaria de encontrar?";
  };
  
  const WelcomeMessage: React.FC = () => (
    <div className="text-center p-8 bg-white rounded-lg shadow-md border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Bem-vindo ao CozinhaJCM!</h2>
        <p className="text-gray-600">
            {activeTab === SearchMode.BY_INGREDIENTS
                ? "Não sabe o que cozinhar? Liste os ingredientes que você tem na sua cozinha, e eu te darei ótimas sugestões de receitas!"
                : "Com vontade de algo específico? Busque pelo nome da receita e encontre o passo a passo completo."
            }
        </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header onLogout={onLogout} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="bg-white p-6 rounded-b-lg shadow-md">
            <SearchBar
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onSubmit={handleSearch}
              placeholder={getPlaceholder()}
              isLoading={isLoading}
              isTextArea={activeTab === SearchMode.BY_INGREDIENTS}
            />
          </div>
          
          <div className="mt-6">
            {isLoading && (
              <div className="flex justify-center items-center flex-col gap-4 text-orange-700">
                <svg className="animate-spin h-10 w-10 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="font-semibold text-lg">Buscando as melhores receitas para você...</p>
              </div>
            )}
            {error && <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
            
            {!isLoading && !error && !recipes && <WelcomeMessage />}

            {recipes && recipes.length === 0 && (
              <div className="text-center p-4 bg-yellow-100 text-yellow-800 rounded-lg">
                Nenhuma receita encontrada. Tente usar termos diferentes ou verificar a ortografia.
              </div>
            )}
            
            {recipes && recipes.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recipes.map((recipe, index) => (
                  <RecipeCard key={index} recipe={recipe} userIngredients={userIngredients} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};


const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (email: string) => {
        localStorage.setItem('loggedInUser', email);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        setIsAuthenticated(false);
    };
    
    return (
        <>
            {isAuthenticated ? (
                <RecipeFinder onLogout={handleLogout} />
            ) : (
                <AuthPage onLoginSuccess={handleLogin} />
            )}
        </>
    );
};

export default App;