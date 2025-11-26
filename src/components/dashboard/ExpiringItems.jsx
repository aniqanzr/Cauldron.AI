import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function ExpiringItems({ items }) {
  const getUrgencyColor = (days) => {
    if (days < 0) return "text-red-600 bg-red-50 border-red-200";
    if (days <= 2) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-yellow-600 bg-yellow-50 border-yellow-200";
  };

  const getUrgencyText = (days) => {
    if (days < 0) return "Expired";
    if (days === 0) return "Expires today";
    if (days === 1) return "Expires tomorrow";
    return `${days} days left`;
  };

  return (
    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Items Expiring Soon
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>All items are fresh!</p>
            </div>
          ) : (
            items.map((item, index) => {
              const daysLeft = differenceInDays(new Date(item.expiry_date), new Date());
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 ${getUrgencyColor(daysLeft)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{item.name}</h4>
                        <Badge className={categoryColors[item.category]}>
                          {item.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span>{item.quantity} {item.unit}</span>
                        <span className="text-gray-500">• {item.location}</span>
                        <span className="text-gray-500">• {format(new Date(item.expiry_date), "MMM d")}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm">
                        {getUrgencyText(daysLeft)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}