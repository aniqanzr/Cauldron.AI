import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, X, Maximize2, Minimize2 } from "lucide-react";
import { motion } from "framer-motion";

export default function WidgetWrapper({ 
  title, 
  icon: Icon, 
  children, 
  onRemove, 
  dragHandleProps,
  isExpanded,
  onToggleExpand,
  widgetId
}) {
  return (
    <Card className="h-full border-0 shadow-md bg-white/90 backdrop-blur-sm overflow-hidden flex flex-col">
      <CardHeader className="p-4 pb-2 flex-shrink-0 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded transition-colors">
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            {Icon && <Icon className="w-4 h-4 text-green-600" />}
            <CardTitle className="text-sm font-semibold text-gray-800">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-gray-100"
              onClick={() => onToggleExpand(widgetId)}
            >
              {isExpanded ? (
                <Minimize2 className="w-3.5 h-3.5 text-gray-500" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 text-gray-500" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-red-50 hover:text-red-500"
              onClick={() => onRemove(widgetId)}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1 overflow-auto">
        {children}
      </CardContent>
    </Card>
  );
}