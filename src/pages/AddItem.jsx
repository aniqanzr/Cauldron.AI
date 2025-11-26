import React, { useState } from "react";
import { FoodItem } from "@/entities/FoodItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import ReceiptScanner from "../components/additem/ReceiptScanner";
import ExtractedItemsList from "../components/additem/ExtractedItemsList";

export default function AddItem() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [extractedItems, setExtractedItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    expiry_date: "",
    location: "",
    notes: ""
  });

  const handleItemsExtracted = (items) => {
    setExtractedItems(items);
  };

  const handleAddExtractedItem = (item) => {
    setFormData(prev => ({
      ...prev,
      name: item.name,
      category: item.category || "",
      quantity: item.quantity?.toString() || "1",
      unit: item.unit || "pieces"
    }));
    setExtractedItems(prev => prev.filter(i => i !== item));
  };

  const handleRemoveExtractedItem = (index) => {
    setExtractedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await FoodItem.create({
        ...formData,
        quantity: parseFloat(formData.quantity)
      });
      
      navigate(createPageUrl("Inventory"));
    } catch (error) {
      console.error("Error adding food item:", error);
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const categories = [
    { value: "vegetables", label: "Vegetables 🥬" },
    { value: "fruits", label: "Fruits 🍎" },
    { value: "dairy", label: "Dairy 🧀" },
    { value: "meat", label: "Meat 🥩" },
    { value: "grains", label: "Grains 🌾" },
    { value: "spices", label: "Spices 🌶️" },
    { value: "canned", label: "Canned 🥫" },
    { value: "frozen", label: "Frozen ❄️" },
    { value: "beverages", label: "Beverages 🥤" },
    { value: "snacks", label: "Snacks 🍪" },
    { value: "condiments", label: "Condiments 🍯" },
    { value: "other", label: "Other 📦" }
  ];

  const units = [
    { value: "pieces", label: "Pieces" },
    { value: "kg", label: "Kilograms (kg)" },
    { value: "g", label: "Grams (g)" },
    { value: "l", label: "Liters (l)" },
    { value: "ml", label: "Milliliters (ml)" },
    { value: "cups", label: "Cups" },
    { value: "tbsp", label: "Tablespoons" },
    { value: "tsp", label: "Teaspoons" },
    { value: "oz", label: "Ounces (oz)" },
    { value: "lbs", label: "Pounds (lbs)" },
    { value: "cans", label: "Cans" },
    { value: "bottles", label: "Bottles" }
  ];

  const locations = [
    { value: "fridge", label: "Fridge ❄️" },
    { value: "pantry", label: "Pantry 🏠" },
    { value: "freezer", label: "Freezer 🧊" },
    { value: "cabinet", label: "Cabinet 🗄️" },
    { value: "counter", label: "Counter 🔢" }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Inventory"))}
            className="border-green-200 hover:bg-green-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Item</h1>
            <p className="text-gray-600">Add a food item to your kitchen inventory</p>
          </div>
        </div>

        {/* Receipt Scanner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <ReceiptScanner onItemsExtracted={handleItemsExtracted} />
        </motion.div>

        {/* Extracted Items List */}
        {extractedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <ExtractedItemsList
              items={extractedItems}
              onAddItem={handleAddExtractedItem}
              onRemoveItem={handleRemoveExtractedItem}
              onClearAll={() => setExtractedItems([])}
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-green-500" />
                Item Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Item Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="e.g. Organic Spinach"
                      required
                      className="border-green-200 focus:border-green-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange("category", value)}
                      required
                    >
                      <SelectTrigger className="border-green-200">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange("quantity", e.target.value)}
                      placeholder="e.g. 2.5"
                      required
                      className="border-green-200 focus:border-green-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit *</Label>
                    <Select
                      value={formData.unit}
                      onValueChange={(value) => handleInputChange("unit", value)}
                      required
                    >
                      <SelectTrigger className="border-green-200">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiry_date">Expiry Date *</Label>
                    <Input
                      id="expiry_date"
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) => handleInputChange("expiry_date", e.target.value)}
                      required
                      className="border-green-200 focus:border-green-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Storage Location *</Label>
                    <Select
                      value={formData.location}
                      onValueChange={(value) => handleInputChange("location", value)}
                      required
                    >
                      <SelectTrigger className="border-green-200">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.value} value={location.value}>
                            {location.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Any additional notes about this item..."
                    className="border-green-200 focus:border-green-300"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(createPageUrl("Inventory"))}
                    className="border-green-200 hover:bg-green-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Add Item
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}