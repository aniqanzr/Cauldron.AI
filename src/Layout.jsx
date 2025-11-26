import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Simple Sidebar for testing */}
      <div className="w-64 bg-white border-r p-4 flex flex-col gap-4">
        <h1 className="font-bold text-xl text-green-600">Cauldron.AI</h1>
        <nav className="flex flex-col gap-2">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded">Dashboard</Link>
          <Link to="/inventory" className="p-2 hover:bg-gray-100 rounded">Inventory</Link>
          <Link to="/recipes" className="p-2 hover:bg-gray-100 rounded">Recipes</Link>
          <Link to="/add-item" className="p-2 hover:bg-gray-100 rounded">Add Item</Link>
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}