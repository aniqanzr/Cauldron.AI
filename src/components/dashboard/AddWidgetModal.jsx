import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  PieChart, 
  Table, 
  Calendar, 
  AlertTriangle, 
  ChefHat,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";

const widgetTypes = [
  {
    id: "metrics",
    name: "Quick Stats",
    description: "Overview of inventory metrics",
    icon: Activity,
    color: "bg-blue-500",
    defaultSize: { w: 2, h: 1 }
  },
  {
    id: "pie-chart",
    name: "Category Chart",
    description: "Pie chart of items by category",
    icon: PieChart,
    color: "bg-green-500",
    defaultSize: { w: 1, h: 2 }
  },
  {
    id: "bar-chart",
    name: "Location Chart",
    description: "Bar chart of items by location",
    icon: BarChart3,
    color: "bg-purple-500",
    defaultSize: { w: 1, h: 2 }
  },
  {
    id: "table",
    name: "Inventory Table",
    description: "Sortable table of all items",
    icon: Table,
    color: "bg-indigo-500",
    defaultSize: { w: 2, h: 2 }
  },
  {
    id: "calendar",
    name: "Expiry Calendar",
    description: "Calendar view of expiring items",
    icon: Calendar,
    color: "bg-orange-500",
    defaultSize: { w: 1, h: 2 }
  },
  {
    id: "expiring",
    name: "Expiring Soon",
    description: "List of items expiring soon",
    icon: AlertTriangle,
    color: "bg-red-500",
    defaultSize: { w: 1, h: 2 }
  },
  {
    id: "recipes",
    name: "Recipe Ideas",
    description: "AI-generated recipe suggestions",
    icon: ChefHat,
    color: "bg-pink-500",
    defaultSize: { w: 1, h: 2 }
  }
];

export default function AddWidgetModal({ isOpen, onClose, onAddWidget, existingWidgets }) {
  const handleAdd = (widgetType) => {
    onAddWidget({
      id: `${widgetType.id}-${Date.now()}`,
      type: widgetType.id,
      name: widgetType.name,
      ...widgetType.defaultSize
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
          <DialogDescription>
            Choose a widget to add to your dashboard
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
          {widgetTypes.map((widget, index) => (
            <motion.button
              key={widget.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleAdd(widget)}
              className="p-4 rounded-xl border-2 border-gray-100 hover:border-green-300 hover:shadow-md transition-all text-left group"
            >
              <div className={`w-10 h-10 rounded-lg ${widget.color} bg-opacity-10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <widget.icon className={`w-5 h-5 ${widget.color.replace('bg-', 'text-')}`} />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">{widget.name}</h4>
              <p className="text-xs text-gray-500">{widget.description}</p>
            </motion.button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}