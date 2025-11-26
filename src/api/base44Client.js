// This file simulates the Base44 connection so your app doesn't crash.

export const base44 = {
  // Simulate a logged-in user
  currentUser: {
    id: "local-user-1",
    firstName: "Chef",
    lastName: "Cook",
    email: "chef@example.com"
  },
  
  // Fake Authentication functions
  auth: {
    signIn: () => Promise.resolve({ user: { id: "1", name: "Chef" } }),
    signOut: () => console.log("Simulated Sign Out"),
    getSession: () => ({ user: { id: "1" } }),
  },

  // Fake Database Access
  // If your code tries to call base44.db.something, it won't crash immediately
  db: {
    collection: () => ({
      get: () => Promise.resolve([]),
      add: () => Promise.resolve({ id: "new-id" }),
    })
  }
};