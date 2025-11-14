import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    recipeName: {
      type: Type.STRING,
      description: "O nome da receita."
    },
    description: {
      type: Type.STRING,
      description: "Uma descrição curta e atrativa da receita."
    },
    prepTime: {
      type: Type.STRING,
      description: "O tempo total de preparo e cozimento, por exemplo, '45 minutos'."
    },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        description: "Um ingrediente necessário com sua quantidade, por exemplo, '1 xícara de farinha'."
      }
    },
    instructions: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        description: "Uma única etapa do modo de preparo."
      }
    }
  },
  required: ["recipeName", "description", "prepTime", "ingredients", "instructions"]
};

const findRecipes = async (prompt: string): Promise<Recipe[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: recipeSchema
        },
      },
    });

    const responseText = response.text.trim();
    const recipes = JSON.parse(responseText);
    
    // Gemini can sometimes return a single object instead of an array for one result
    if (Array.isArray(recipes)) {
        return recipes;
    } else if (typeof recipes === 'object' && recipes !== null) {
        return [recipes];
    }
    return [];

  } catch (error) {
    console.error("Error fetching recipes from Gemini API:", error);
    throw new Error("Não foi possível buscar as receitas. Por favor, tente novamente.");
  }
};

export const findRecipesByIngredients = (ingredients: string): Promise<Recipe[]> => {
  const prompt = `Você é um assistente de culinária prestativo. Baseado nos seguintes ingredientes: ${ingredients}, sugira até 5 receitas. Se os ingredientes forem insuficientes para uma refeição completa, sugira receitas simples ou complementos. Forneça a resposta em um array JSON de objetos de receita.`;
  return findRecipes(prompt);
};

export const findRecipeByName = (query: string): Promise<Recipe[]> => {
  const prompt = `Você é um assistente de culinária prestativo. Encontre até 5 receitas para "${query}". Forneça a resposta em um array JSON de objetos de receita.`;
  return findRecipes(prompt);
};