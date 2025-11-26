// This file simulates the Base44 database client for Recipes.

export const Recipe = {
  // Simulate fetching saved recipes
  list: async () => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Fake delay

    return [
      {
        id: "1",
        name: "Classic Pancakes",
        description: "Fluffy homemade pancakes perfect for breakfast.",
        ingredients: ["Flour", "Milk", "Eggs", "Sugar", "Baking Powder"],
        instructions: ["Mix dry ingredients", "Whisk wet ingredients", "Combine", "Cook on griddle"],
        prep_time: 10,
        cook_time: 15,
        difficulty: "easy",
        servings: 4,
        tags: ["breakfast", "vegetarian"]
      },
      {
        id: "2",
        name: "Grilled Cheese Sandwich",
        description: "Crispy, cheesy comfort food.",
        ingredients: ["Bread", "Cheddar Cheese", "Butter"],
        instructions: ["Butter bread", "Place cheese between slices", "Grill until golden"],
        prep_time: 5,
        cook_time: 10,
        difficulty: "easy",
        servings: 1,
        tags: ["lunch", "quick"]
      }
    ];
  },

  // Simulate saving a new recipe
  create: async (recipe) => {
    console.log("Simulated saving recipe:", recipe);
    return { ...recipe, id: Math.random().toString() };
  },

  // Simulate getting a single recipe
  get: async (id) => {
    console.log("Simulated fetching recipe:", id);
    return {
      id: id,
      name: "Mock Recipe",
      description: "This is a placeholder for a fetched recipe.",
      ingredients: ["Ingredient A", "Ingredient B"],
      instructions: ["Step 1", "Step 2"],
      prep_time: 10,
      cook_time: 20,
      difficulty: "medium",
      servings: 2,
      tags: ["mock"]
    };
  }
};