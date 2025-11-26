import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function ExtractedItemsList({ items, onAddItem, onRemoveItem, onClearAll }) {
  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50 rounded-xl p-4 border border-blue-200"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800">
          Extracted Items ({items.length})
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-gray-500 hover:text-gray-700"
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {item.quantity} {item.unit}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    {item.category}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-green-600 hover:bg-green-100"
                onClick={() => onAddItem(item)}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:bg-red-50"
                onClick={() => onRemoveItem(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Click + to add item to form, or fill in remaining details below
      </p>
    </motion.div>
  );
}