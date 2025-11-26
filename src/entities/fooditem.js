// This file simulates the Base44 database client.
// It provides the "list" method that your Recipes page is trying to call.

export const FoodItem = {
  // Simulate fetching data from the database
  list: async () => {
    // Fake a small loading delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return dummy data that matches your JSON schema structure
    return [
      { 
        id: "1", 
        name: "Organic Milk", 
        quantity: 1, 
        unit: "l", 
        category: "dairy",
        expiry_date: new Date(Date.now() + 86400000 * 3).toISOString(), // Expires in 3 days
        location: "fridge"
      },
      { 
        id: "2", 
        name: "Cheddar Cheese", 
        quantity: 500, 
        unit: "g", 
        category: "dairy",
        expiry_date: new Date(Date.now() + 86400000 * 10).toISOString(),
        location: "fridge"
      },
      { 
        id: "3", 
        name: "Chicken Breast", 
        quantity: 1, 
        unit: "kg", 
        category: "meat",
        expiry_date: new Date(Date.now() + 86400000 * 2).toISOString(), // Expires in 2 days
        location: "freezer"
      },
      { 
        id: "4", 
        name: "Spinach", 
        quantity: 1, 
        unit: "pieces", 
        category: "vegetables",
        expiry_date: new Date(Date.now() - 86400000).toISOString(), // Expired yesterday
        location: "fridge"
      },
      { 
        id: "5", 
        name: "Pasta", 
        quantity: 2, 
        unit: "pieces", 
        category: "grains",
        expiry_date: new Date(Date.now() + 86400000 * 60).toISOString(),
        location: "pantry"
      },
      { 
        id: "6", 
        name: "Tomato Sauce", 
        quantity: 2, 
        unit: "cans", 
        category: "canned",
        expiry_date: new Date(Date.now() + 86400000 * 100).toISOString(),
        location: "pantry"
      }
    ];
  },

  // Simulate adding a new item
  create: async (newItem) => {
    console.log("Simulated saving:", newItem);
    return { ...newItem, id: Math.random().toString() };
  }
};