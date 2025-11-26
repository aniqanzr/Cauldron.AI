import React from "react";
import { Package, AlertTriangle, Calendar, Utensils } from "lucide-react";
import { differenceInDays } from "date-fns";
import { motion } from "framer-motion";

const metrics = [
  { key: "total", title: "Total Items", icon: Package, color: "bg-blue-500" },
  { key: "quantity", title: "Total Quantity", icon: Utensils, color: "bg-green-500" },
  { key: "expiring", title: "Expiring Soon", icon: AlertTriangle, color: "bg-orange-500" },
  { key: "expired", title: "Expired", icon: Calendar, color: "bg-red-500" },
];

export default function MetricsWidget({ foodItems = [], compact = false }) {
  const calculateMetrics = () => {
    const total = foodItems.length;
    const quantity = foodItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const expiring = foodItems.filter(item => {
      const days = differenceInDays(new Date(item.expiry_date), new Date());
      return days >= 0 && days <= 7;
    }).length;
    const expired = foodItems.filter(item => {
      const days = differenceInDays(new Date(item.expiry_date), new Date());
      return days < 0;
    }).length;

    return { total, quantity, expiring, expired };
  };

  const values = calculateMetrics();

  return (
    <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'} gap-3 h-full`}>
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.key}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${metric.color} bg-opacity-10`}>
              <metric.icon className={`w-4 h-4 ${metric.color.replace('bg-', 'text-')}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{values[metric.key]}</p>
          <p className="text-xs text-gray-500 mt-1">{metric.title}</p>
        </motion.div>
      ))}
    </div>
  );
}