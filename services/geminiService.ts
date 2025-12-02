import { GoogleGenAI } from "@google/genai";
import { InventoryItem } from "../types";

// Initialize Gemini Client
// In a real production app, ensure this key is secure or proxy via backend.
// For this PWA demo, we use the env variable directly as instructed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRecipeSuggestion = async (items: InventoryItem[]) => {
  if (items.length === 0) {
    return "Adicione itens ao seu estoque para que eu possa sugerir uma receita!";
  }

  // Create a summary string of available ingredients
  const ingredientsList = items
    .filter(i => i.quantity > 0)
    .map(i => `${i.quantity} ${i.unit} de ${i.name}`)
    .join(', ');

  const prompt = `
    Aja como um Chef de Cozinha criativo e prático.
    Eu tenho os seguintes ingredientes em casa: ${ingredientsList}.
    
    Por favor, sugira uma receita detalhada que eu possa fazer utilizando PRINCIPALMENTE esses ingredientes.
    Se precisar de ingredientes básicos extras (água, sal, óleo, temperos comuns), pode assumir que eu tenho.
    
    Formato da resposta (use Markdown):
    ## Nome da Receita
    **Tempo de preparo:** X min
    **Dificuldade:** Fácil/Médio/Difícil
    
    ### Ingredientes
    - Lista...
    
    ### Modo de Preparo
    1. Passo...
    
    ### Dica do Chef
    Uma dica extra.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Low latency preferred for UI
      }
    });

    return response.text || "Desculpe, não consegui gerar uma receita agora.";
  } catch (error) {
    console.error("Error generating recipe:", error);
    return "Erro ao conectar com o Chef IA. Verifique sua conexão ou tente mais tarde.";
  }
};
