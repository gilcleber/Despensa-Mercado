import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { generateRecipeSuggestion } from '../services/geminiService';
import { ChefHat, Loader2, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Assuming generic standard renderer, but since we can't import external untested, we will do basic rendering or text-pre-wrap

interface Props {
  items: InventoryItem[];
}

const RecipeSuggester: React.FC<Props> = ({ items }) => {
  const [recipe, setRecipe] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateRecipeSuggestion(items);
    setRecipe(result);
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto pb-24">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
          <ChefHat className="text-primary" size={32} />
          Chef IA
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Descubra o que cozinhar com o que você já tem em casa.
        </p>
      </div>

      {!recipe && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleGenerate}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform transition active:scale-95 flex items-center gap-2"
          >
            <ChefHat size={24} />
            Sugerir Receita
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-gray-500 animate-pulse">O Chef está analisando seus ingredientes...</p>
        </div>
      )}

      {recipe && !loading && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-slate-700 animate-fade-in">
          <div className="prose dark:prose-invert max-w-none whitespace-pre-line">
            {recipe}
          </div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleGenerate}
              className="text-primary hover:text-emerald-700 font-medium flex items-center gap-2 px-4 py-2 border border-primary rounded-full hover:bg-emerald-50 dark:hover:bg-slate-700 transition"
            >
              <RefreshCw size={18} />
              Gerar Nova Sugestão
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeSuggester;