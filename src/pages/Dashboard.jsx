import React, { useState, useEffect, useCallback } from "react";
import { FoodItem } from "@/entities/FoodItem";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw, Save } from "lucide-react";
import { motion } from "framer-motion";

import DashboardGrid from "../components/dashboard/DashboardGrid";
import AddWidgetModal from "../components/dashboard/AddWidgetModal";

const DEFAULT_WIDGETS = [
  { id: "metrics-1", type: "metrics", name: "Quick Stats", w: 2, h: 1 },
  { id: "expiring-1", type: "expiring", name: "Expiring Soon", w: 1, h: 2 },
  { id: "pie-chart-1", type: "pie-chart", name: "Category Chart", w: 1, h: 2 },
  { id: "calendar-1", type: "calendar", name: "Expiry Calendar", w: 1, h: 2 },
  { id: "recipes-1", type: "recipes", name: "Recipe Ideas", w: 1, h: 2 },
];

export default function Dashboard() {
  const [foodItems, setFoodItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [widgets, setWidgets] = useState(DEFAULT_WIDGETS);
  const [expandedWidgets, setExpandedWidgets] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load food items
      const items = await FoodItem.list("-created_date");
      setFoodItems(items);

      // Load saved layout from user preferences
      const user = await base44.auth.me();
      if (user?.dashboard_layout) {
        setWidgets(user.dashboard_layout);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleReorder = (newWidgets) => {
    setWidgets(newWidgets);
    setHasUnsavedChanges(true);
  };

  const handleRemoveWidget = (widgetId) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
    setExpandedWidgets(prev => prev.filter(id => id !== widgetId));
    setHasUnsavedChanges(true);
  };

  const handleAddWidget = (widget) => {
    setWidgets(prev => [...prev, widget]);
    setHasUnsavedChanges(true);
  };

  const handleToggleExpand = (widgetId) => {
    setExpandedWidgets(prev => 
      prev.includes(widgetId) 
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  const handleSaveLayout = async () => {
    try {
      await base44.auth.updateMe({ dashboard_layout: widgets });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving layout:", error);
    }
  };

  const handleResetLayout = () => {
    setWidgets(DEFAULT_WIDGETS);
    setExpandedWidgets([]);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              Dashboard
            </h1>
            <p className="text-gray-600 text-sm">
              Customize your view by dragging widgets or adding new ones
            </p>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetLayout}
              className="border-gray-200 hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            
            {hasUnsavedChanges && (
              <Button
                size="sm"
                onClick={handleSaveLayout}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-1" />
                Save Layout
              </Button>
            )}
            
            <Button
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Widget
            </Button>
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="bg-white/80 rounded-xl p-6 shadow-md animate-pulse min-h-[200px]"
              >
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-32 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : widgets.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Plus className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No widgets yet
            </h3>
            <p className="text-gray-600 mb-6">
              Add widgets to customize your dashboard
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Widget
            </Button>
          </motion.div>
        ) : (
          <DashboardGrid
            widgets={widgets}
            foodItems={foodItems}
            onReorder={handleReorder}
            onRemove={handleRemoveWidget}
            expandedWidgets={expandedWidgets}
            onToggleExpand={handleToggleExpand}
          />
        )}

        {/* Add Widget Modal */}
        <AddWidgetModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddWidget={handleAddWidget}
          existingWidgets={widgets}
        />
      </div>
    </div>
  );
}