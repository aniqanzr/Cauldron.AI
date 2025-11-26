import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { motion } from "framer-motion";

const categoryColors = {
  vegetables: "bg-green-100 text-green-800",
  fruits: "bg-orange-100 text-orange-800",
  dairy: "bg-blue-100 text-blue-800",
  meat: "bg-red-100 text-red-800",
  grains: "bg-yellow-100 text-yellow-800",
  spices: "bg-purple-100 text-purple-800",
  canned: "bg-gray-100 text-gray-800",
  frozen: "bg-cyan-100 text-cyan-800",
  beverages: "bg-indigo-100 text-indigo-800",
  snacks: "bg-pink-100 text-pink-800",
  condiments: "bg-amber-100 text-amber-800",
  other: "bg-slate-100 text-slate-800"
};

export default function ExpiringWidget({ foodItems = [], limit = 5 }) {
  const expiringItems = foodItems
    .filter(item => {
      const daysLeft = differenceInDays(new Date(item.expiry_date), new Date());
      return daysLeft <= 7;
    })
    .sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date))
    .slice(0, limit);

  const getUrgencyColor = (days) => {
    if (days < 0) return "bg-red-50 border-red-200 text-red-700";
    if (days <= 2) return "bg-orange-50 border-orange-200 text-orange-700";
    return "bg-yellow-50 border-yellow-200 text-yellow-700";
  };

  const getUrgencyText = (days) => {
    if (days < 0) return "Expired";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `${days} days`;
  };

  if (expiringItems.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400">
        <Calendar className="w-12 h-12 mb-2 opacity-50" />
        <p className="text-sm">All items are fresh!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 h-full overflow-auto">
      {expiringItems.map((item, index) => {
        const daysLeft = differenceInDays(new Date(item.expiry_date), new Date());
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-3 rounded-lg border-2 ${getUrgencyColor(daysLeft)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{item.name}</h4>
                  <Badge className={`${categoryColors[item.category]} text-xs`}>
                    {item.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs opacity-80">
                  <span>{item.quantity} {item.unit}</span>
                  <span>• {item.location}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <div className="font-bold text-sm">{getUrgencyText(daysLeft)}</div>
                <div className="text-xs opacity-70">
                  {format(new Date(item.expiry_date), "MMM d")}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}