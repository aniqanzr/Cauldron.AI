import React from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', 
  '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#6366f1'
];

const categoryLabels = {
  vegetables: "Vegetables",
  fruits: "Fruits",
  dairy: "Dairy",
  meat: "Meat",
  grains: "Grains",
  spices: "Spices",
  canned: "Canned",
  frozen: "Frozen",
  beverages: "Beverages",
  snacks: "Snacks",
  condiments: "Condiments",
  other: "Other"
};

export default function ChartWidget({ foodItems = [], chartType = "pie" }) {
  const getCategoryData = () => {
    const categoryCount = {};
    foodItems.forEach(item => {
      const cat = item.category || 'other';
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    
    return Object.entries(categoryCount).map(([name, value]) => ({
      name: categoryLabels[name] || name,
      value
    }));
  };

  const getLocationData = () => {
    const locationCount = {};
    foodItems.forEach(item => {
      const loc = item.location || 'other';
      locationCount[loc] = (locationCount[loc] || 0) + 1;
    });
    
    return Object.entries(locationCount).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  };

  const categoryData = getCategoryData();
  const locationData = getLocationData();

  if (foodItems.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <p>No data to display</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {chartType === "pie" ? (
        <div className="flex-1 min-h-0">
          <p className="text-xs font-medium text-gray-500 mb-2">Items by Category</p>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  border: '1px solid #e5e7eb' 
                }} 
              />
              <Legend 
                wrapperStyle={{ fontSize: '10px' }}
                layout="horizontal"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <p className="text-xs font-medium text-gray-500 mb-2">Items by Location</p>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={locationData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={60} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  border: '1px solid #e5e7eb' 
                }} 
              />
              <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}