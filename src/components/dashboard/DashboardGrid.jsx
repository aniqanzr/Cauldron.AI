import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Activity, PieChart, BarChart3, Table, Calendar, AlertTriangle, ChefHat } from "lucide-react";
import WidgetWrapper from "./widgets/WidgetWrapper";
import MetricsWidget from "./widgets/MetricsWidget";
import ChartWidget from "./widgets/ChartWidget";
import TableWidget from "./widgets/TableWidget";
import CalendarWidget from "./widgets/CalendarWidget";
import ExpiringWidget from "./widgets/ExpiringWidget";
import RecipesWidget from "./widgets/RecipesWidget";

const widgetIcons = {
  "metrics": Activity,
  "pie-chart": PieChart,
  "bar-chart": BarChart3,
  "table": Table,
  "calendar": Calendar,
  "expiring": AlertTriangle,
  "recipes": ChefHat
};

const widgetNames = {
  "metrics": "Quick Stats",
  "pie-chart": "Category Chart",
  "bar-chart": "Location Chart",
  "table": "Inventory Table",
  "calendar": "Expiry Calendar",
  "expiring": "Expiring Soon",
  "recipes": "Recipe Ideas"
};

export default function DashboardGrid({ 
  widgets, 
  foodItems, 
  onReorder, 
  onRemove, 
  expandedWidgets,
  onToggleExpand 
}) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onReorder(items);
  };

  const renderWidget = (widget) => {
    switch (widget.type) {
      case "metrics":
        return <MetricsWidget foodItems={foodItems} />;
      case "pie-chart":
        return <ChartWidget foodItems={foodItems} chartType="pie" />;
      case "bar-chart":
        return <ChartWidget foodItems={foodItems} chartType="bar" />;
      case "table":
        return <TableWidget foodItems={foodItems} />;
      case "calendar":
        return <CalendarWidget foodItems={foodItems} />;
      case "expiring":
        return <ExpiringWidget foodItems={foodItems} />;
      case "recipes":
        return <RecipesWidget foodItems={foodItems} />;
      default:
        return <div>Unknown widget type</div>;
    }
  };

  const getWidgetClasses = (widget) => {
    const isExpanded = expandedWidgets.includes(widget.id);
    if (isExpanded) {
      return "col-span-1 md:col-span-2 lg:col-span-2";
    }
    
    const w = widget.w || 1;
    if (w >= 2) return "col-span-1 md:col-span-2";
    return "col-span-1";
  };

  const getWidgetHeight = (widget) => {
    const isExpanded = expandedWidgets.includes(widget.id);
    if (isExpanded) return "min-h-[450px]";
    
    const h = widget.h || 1;
    if (h >= 2) return "min-h-[350px]";
    return "min-h-[180px]";
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="dashboard" direction="horizontal">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {widgets.map((widget, index) => {
              const Icon = widgetIcons[widget.type] || Activity;
              const isExpanded = expandedWidgets.includes(widget.id);
              
              return (
                <Draggable key={widget.id} draggableId={widget.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`
                        ${getWidgetClasses(widget)}
                        ${getWidgetHeight(widget)}
                        ${snapshot.isDragging ? 'z-50 shadow-2xl opacity-90' : ''}
                        transition-all duration-300
                      `}
                    >
                      <WidgetWrapper
                        title={widget.name || widgetNames[widget.type]}
                        icon={Icon}
                        onRemove={onRemove}
                        widgetId={widget.id}
                        dragHandleProps={provided.dragHandleProps}
                        isExpanded={isExpanded}
                        onToggleExpand={onToggleExpand}
                      >
                        {renderWidget(widget)}
                      </WidgetWrapper>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}