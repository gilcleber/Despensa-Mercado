
import { GoogleGenAI } from "@google/genai";
import { InventoryItem } from "../types";

/**
 * Generates a recipe suggestion based on the provided inventory items.
 * Uses Gemini API to process the ingredients and return a recipe.
 */
export const generateRecipeSuggestion = async (items: InventoryItem[]) => {
  // Always initialize right before making an API call to ensure it uses the most up-to-date API key
  // The API key must be obtained exclusively from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
    // Using 'gemini-3-flash-preview' for basic text tasks like recipe generation
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        // Disable thinking budget for lower latency on basic tasks
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    // Directly access the .text property from GenerateContentResponse (not a method)
    return response.text || "Desculpe, não consegui gerar uma receita agora.";
  } catch (error) {
    console.error("Error generating recipe:", error);
    return "Erro ao conectar com o Chef IA. Verifique sua conexão ou tente mais tarde.";
  }
};
