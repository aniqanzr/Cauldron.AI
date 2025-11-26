
import React, { useState, useEffect, useCallback } from "react";
import { FoodItem } from "@/entities/FoodItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import InventoryCard from "../components/inventory/InventoryCard";
import EditItemModal from "../components/inventory/EditItemModal";

export default function Inventory() {
  const [foodItems, setFoodItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [editingItem, setEditingItem] = useState(null);

  const loadFoodItems = async () => {
    setIsLoading(true);
    try {
      const items = await FoodItem.list("-created_date");
      setFoodItems(items);
    } catch (error) {
      console.error("Error loading food items:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadFoodItems();
  }, []);

  const filterItems = useCallback(() => {
    let filtered = foodItems;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter(item => item.location === locationFilter);
    }

    setFilteredItems(filtered);
  }, [foodItems, searchTerm, categoryFilter, locationFilter]);

  useEffect(() => {
    filterItems();
  }, [filterItems]);

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      await FoodItem.delete(item.id);
      loadFoodItems();
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleUpdate = async (itemId, data) => {
    try {
      await FoodItem.update(itemId, data);
      setEditingItem(null);
      await loadFoodItems();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const categories = ["vegetables", "fruits", "dairy", "meat", "grains", "spices", "canned", "frozen", "beverages", "snacks", "condiments", "other"];
  const locations = ["fridge", "pantry", "freezer", "cabinet", "counter"];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kitchen Inventory</h1>
            <p className="text-gray-600">Manage all your food items and track expiry dates</p>
          </div>
          <Link to={createPageUrl("AddItem")}>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Add New Item
            </Button>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-green-200 focus:border-green-300"
              />
            </div>
            
            <div className="flex gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 border-green-200">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-32 border-green-200">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location.charAt(0).toUpperCase() + location.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/80 rounded-xl p-6 shadow-md animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Filter className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || categoryFilter !== "all" || locationFilter !== "all" 
                ? "No items match your filters"
                : "No items in your inventory yet"
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || categoryFilter !== "all" || locationFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Start by adding some food items to track"
              }
            </p>
            <Link to={createPageUrl("AddItem")}>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Item
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <InventoryCard
                key={item.id}
                item={item}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <EditItemModal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        item={editingItem}
        onSave={handleUpdate}
      />
    </div>
  );
}
