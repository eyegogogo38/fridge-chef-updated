
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, RecipeResponse, MealTime } from "../types";

// Note: process.env.API_KEY is handled externally by the platform.
export const generateRecipes = async (ingredients: string, mealTime: MealTime): Promise<Recipe[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  
  const prompt = `냉장고 재료: "${ingredients}". 식사 시간: "${mealTime}". 
  이 재료들을 사용하여 ${mealTime}에 어울리는 고급스럽고 감각적인 요리 3가지를 제안해주세요. 
  각 요리는 마치 파인다이닝 메뉴판에 있을 법한 이름과 설명을 가져야 하며, 조리 과정은 단계별로 논리적이고 구체적이어야 합니다.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recipes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Dish title" },
                description: { type: Type.STRING, description: "Elegant dish summary" },
                ingredients: { 
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Required ingredients"
                },
                instructions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Step-by-step methodology"
                }
              },
              required: ["title", "description", "ingredients", "instructions"]
            }
          }
        },
        required: ["recipes"]
      }
    }
  });

  const text = response.text;
  const data: RecipeResponse = JSON.parse(text || '{"recipes":[]}');
  
  return data.recipes.map((r, index) => ({
    ...r,
    id: `recipe-${Date.now()}-${index}`
  }));
};

export const generateRecipeImage = async (recipeTitle: string): Promise<string | undefined> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  
  const prompt = `Hyper-realistic close-up professional food photography of '${recipeTitle}'. 
  Avant-garde plating, top-tier restaurant aesthetic, warm ambient lighting, highly detailed textures, soft bokeh background, 8k resolution, cinematic composition.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Image generation failed:", error);
  }
  return undefined;
};
