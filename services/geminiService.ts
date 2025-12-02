import { GoogleGenAI } from "@google/genai";
import { InventoryItem } from "../types";

// Helper to safely get the client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found. Gemini features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateRecipeSuggestion = async (items: InventoryItem[]) => {
  const ai = getAiClient();
  
  if (!ai) {
    return "Configuração de API necessária. Por favor, verifique se a chave da API (API_KEY) está configurada no ambiente.";
  }

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
    
    Formato da resposta:
    
    TÍTULO DA RECEITA
    Tempo de preparo: X min | Dificuldade: Fácil/Médio/Difícil
    
    INGREDIENTES
    - Lista...
    
    MODO DE PREPARO
    1. Passo...
    
    DICA DO CHEF
    Uma dica extra.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "Desculpe, não consegui gerar uma receita agora.";
  } catch (error) {
    console.error("Error generating recipe:", error);
    return "Erro ao conectar com o Chef IA. Verifique sua conexão ou tente mais tarde.";
  }
};