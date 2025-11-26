import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, Users, RefreshCw } from "lucide-react";
import { generateRecipe } from "@/ai";
import { Skeleton } from "@/components/ui/skeleton";

const difficultyColors = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800"
};

export default function RecipesWidget({ foodItems = [], limit = 3 }) {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const generateRecipes = useCallback(async () => {
    if (foodItems.length === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
const ingredients = foodItems.map(item => item.name).join(", ");

      // 1. Ask Google AI
      const aiResponseText = await generateRecipe(ingredients);

      // 2. Parse the text result
      // We strip out markdown (```json) just in case Google adds it
      const cleanText = aiResponseText.replace(/```json|```/g, '').trim();
      const json = JSON.parse(cleanText);

      // 3. Save to state (handle if it returns { recipes: [] } or just [])
      setRecipes(json.recipes || json || []);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  }, [foodItems, limit]);

  useEffect(() => {
    generateRecipes();
  }, [generateRecipes]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-3 border rounded-lg">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-full mb-2" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-12" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400">
        <ChefHat className="w-12 h-12 mb-2 opacity-50" />
        <p className="text-sm">Add ingredients for recipes</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 space-y-2 overflow-auto">
        {recipes.slice(0, limit).map((recipe, index) => (
          <div key={index} className="p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-1">
              <h4 className="font-medium text-sm text-gray-900">{recipe.name}</h4>
              {recipe.can_make_now && (
                <Badge className="bg-green-100 text-green-800 text-xs">Ready</Badge>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">{recipe.description}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {recipe.prep_time}m
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" /> {recipe.servings}
              </span>
              <Badge className={`${difficultyColors[recipe.difficulty]} text-xs`}>
                {recipe.difficulty}
              </Badge>
            </div>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={generateRecipes}
        className="mt-3 w-full"
        disabled={isLoading}
      >
        <RefreshCw className={`w-3 h-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
}