import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateRecipe(ingredients) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // We MUST tell the AI to return JSON, or the app will crash trying to read it.
    const prompt = `
      You are a professional chef. I have these ingredients: ${ingredients}.
      
      Generate 6 diverse recipe suggestions.
      RETURN ONLY RAW JSON. Do not write "Here is your recipe" or any other text.
      
      The JSON must be an object with a "recipes" array. Each recipe object must have these fields:
      - name (string)
      - description (string)
      - ingredients (array of strings)
      - instructions (array of strings)
      - prep_time (number, in minutes)
      - cook_time (number, in minutes)
      - difficulty (string: "easy", "medium", or "hard")
      - servings (number)
      - can_make_now (boolean)
      - missing_ingredients (array of strings)
      - tags (array of strings)
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error);
    return "[]";
  }
}