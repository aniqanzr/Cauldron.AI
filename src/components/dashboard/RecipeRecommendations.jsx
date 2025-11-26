
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, Users, Sparkles } from "lucide-react";
import { generateRecipe } from "@/ai";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const difficultyColors = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800"
};

export default function RecipeRecommendations({ foodItems }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const generateRecommendations = useCallback(async () => {
    setIsLoading(true);
    try {
      const availableIngredients = foodItems.map(item => `${item.name} (${item.quantity} ${item.unit})`).join(", ");

      // 1. Ask Google AI
      const aiResponseText = await generateRecipe(availableIngredients);

      // 2. Parse the text result
      // Remove any markdown formatting (```json) that Google might add
      const cleanText = aiResponseText.replace(/```json|```/g, '').trim();
      const json = JSON.parse(cleanText);

      // 3. Save to state
      setRecommendations(json.recipes || json || []);
    } catch (error) {
      console.error("Error generating recommendations:", error);
    }
    setIsLoading(false);
  }, [foodItems]);

  useEffect(() => {
    if (foodItems.length > 0) {
      generateRecommendations();
    }
  }, [foodItems, generateRecommendations]);

  return (
    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Recipe Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border border-gray-100 rounded-xl">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-14" />
                </div>
              </div>
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ChefHat className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Add some ingredients to get recipe suggestions!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.slice(0, 3).map((recipe, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{recipe.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{recipe.description}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      {recipe.can_make_now ? (
                        <Badge className="bg-green-100 text-green-800">
                          Can make now!
                        </Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-800">
                          Need 1-2 more ingredients
                        </Badge>
                      )}
                      <Badge className={difficultyColors[recipe.difficulty]}>
                        {recipe.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {recipe.prep_time} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {recipe.servings} servings
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  <strong>Ingredients needed:</strong> {recipe.ingredients_needed.slice(0, 3).join(", ")}
                  {recipe.ingredients_needed.length > 3 && ` +${recipe.ingredients_needed.length - 3} more`}
                </div>
              </motion.div>
            ))}
            
            <Button 
              onClick={generateRecommendations}
              variant="outline"
              className="w-full mt-4 border-green-200 hover:bg-green-50"
            >
              Generate New Recommendations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
