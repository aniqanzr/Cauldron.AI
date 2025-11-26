import React, { useState, useEffect, useCallback } from "react";
import { FoodItem } from "@/entities/FoodItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, Users, Sparkles, RefreshCw } from "lucide-react";
import { generateRecipe } from "@/ai";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import RecipeChatWidget from "../components/chat/recipechatwidget.jsx";

const difficultyColors = {
  easy: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  hard: "bg-red-100 text-red-800 border-red-200"
};

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Core function to generate recipes, always takes ingredients as an argument
  const generateRecipes = useCallback(async (ingredients) => {
    try {
      if (!ingredients || ingredients.length === 0) {
        setRecipes([]);
        return;
      }
      const availableIngredients = ingredients.map(item => `${item.name} (${item.quantity} ${item.unit})`).join(", ");
      
      // 1. Ask Google AI for recipes
      const aiResponseText = await generateRecipe(availableIngredients);

      // 2. Parse the text result into a real list
      let parsedData = [];
      try {
        // Google sometimes wraps JSON in markdown (```json ... ```), so we clean it.
        const cleanText = aiResponseText.replace(/```json|```/g, '').trim();
        const json = JSON.parse(cleanText);
        
        // Handle if the AI put the list inside a "recipes" property or just sent the array directly
        parsedData = json.recipes || json || [];
      } catch (error) {
        console.error("Failed to parse AI response:", error);
      }

      setRecipes(parsedData);
    } catch (error) {
      console.error("Error generating recipes:", error);
    }
  }, [setRecipes]); // setRecipes is a stable setter from useState

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await FoodItem.list("-created_date");
      setFoodItems(items); // This updates the state
      
      if (items.length > 0) {
        await generateRecipes(items); // Call with the fetched items
      } else {
        setRecipes([]); // Clear recipes if no food items
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  }, [generateRecipes]); // `generateRecipes` is a stable reference due to useCallback

  useEffect(() => {
    loadData();
  }, [loadData]); // `loadData` is now stable due to useCallback

  // Handler for the button click, which needs to use the current `foodItems` state
  const handleGenerateButtonClick = useCallback(() => {
    generateRecipes(foodItems);
  }, [generateRecipes, foodItems]); // `foodItems` is a dependency here because it's directly used.

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Recipe Suggestions</h1>
            <p className="text-gray-600">Discover delicious meals based on your available ingredients</p>
          </div>
          <Button
            onClick={handleGenerateButtonClick} // Use the memoized handler
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
            disabled={isLoading || foodItems.length === 0}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate New Recipes
          </Button>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border-0 shadow-md">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ChefHat className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes yet</h3>
            <p className="text-gray-600 mb-6">
              {foodItems.length === 0 
                ? "Add some ingredients to your inventory to get recipe suggestions"
                : "Click 'Generate New Recipes' to discover delicious meals"
              }
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm cursor-pointer"
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                        {recipe.name}
                      </CardTitle>
                      <div className="flex gap-1">
                        {recipe.can_make_now ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Can make now!
                          </Badge>
                        ) : (
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                            Need {recipe.missing_ingredients?.length || 1} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{recipe.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={difficultyColors[recipe.difficulty]}>
                        {recipe.difficulty}
                      </Badge>
                      {recipe.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {(recipe.prep_time || 0) + (recipe.cook_time || 0)} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {recipe.servings} servings
                      </div>
                    </div>

                    {recipe.missing_ingredients && recipe.missing_ingredients.length > 0 && (
                      <div className="text-xs text-gray-500">
                        <strong>Missing:</strong> {recipe.missing_ingredients.slice(0, 2).join(", ")}
                        {recipe.missing_ingredients.length > 2 && ` +${recipe.missing_ingredients.length - 2} more`}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Recipe Chat Widget */}
        <RecipeChatWidget foodItems={foodItems} />

        {selectedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedRecipe.name}</h2>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedRecipe(null)}
                    className="text-gray-500"
                  >
                    ✕
                  </Button>
                </div>

                <p className="text-gray-600 mb-6">{selectedRecipe.description}</p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-3">Ingredients</h3>
                    <ul className="space-y-1 text-sm">
                      {selectedRecipe.ingredients?.map((ingredient, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Recipe Info</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Prep Time:</span>
                        <span>{selectedRecipe.prep_time} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cook Time:</span>
                        <span>{selectedRecipe.cook_time} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Servings:</span>
                        <span>{selectedRecipe.servings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Difficulty:</span>
                        <Badge className={difficultyColors[selectedRecipe.difficulty]}>
                          {selectedRecipe.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Instructions</h3>
                  <ol className="space-y-3">
                    {selectedRecipe.instructions?.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}