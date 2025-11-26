import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Edit, Trash2 } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { motion } from "framer-motion";

const categoryColors = {
  vegetables: "bg-green-100 text-green-800 border-green-200",
  fruits: "bg-orange-100 text-orange-800 border-orange-200",
  dairy: "bg-blue-100 text-blue-800 border-blue-200",
  meat: "bg-red-100 text-red-800 border-red-200",
  grains: "bg-yellow-100 text-yellow-800 border-yellow-200",
  spices: "bg-purple-100 text-purple-800 border-purple-200",
  canned: "bg-gray-100 text-gray-800 border-gray-200",
  frozen: "bg-cyan-100 text-cyan-800 border-cyan-200",
  beverages: "bg-indigo-100 text-indigo-800 border-indigo-200",
  snacks: "bg-pink-100 text-pink-800 border-pink-200",
  condiments: "bg-amber-100 text-amber-800 border-amber-200",
  other: "bg-slate-100 text-slate-800 border-slate-200"
};

const locationIcons = {
  fridge: "❄️",
  pantry: "🏠",
  freezer: "🧊",
  cabinet: "🗄️",
  counter: "🔢"
};

export default function InventoryCard({ item, onEdit, onDelete, index = 0 }) {
  const daysLeft = differenceInDays(new Date(item.expiry_date), new Date());
  
  const getExpiryStatus = () => {
    if (daysLeft < 0) return { color: "text-red-600", text: "Expired" };
    if (daysLeft === 0) return { color: "text-red-500", text: "Expires today" };
    if (daysLeft <= 2) return { color: "text-orange-500", text: `${daysLeft} day${daysLeft === 1 ? '' : 's'} left` };
    if (daysLeft <= 7) return { color: "text-yellow-600", text: `${daysLeft} days left` };
    return { color: "text-green-600", text: `${daysLeft} days left` };
  };

  const expiryStatus = getExpiryStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <Badge className={categoryColors[item.category]}>
                  {item.category}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span className="font-medium">{item.quantity} {item.unit}</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{locationIcons[item.location]} {item.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-sm">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-gray-500">Expires:</span>
                <span className={`font-medium ${expiryStatus.color}`}>
                  {format(new Date(item.expiry_date), "MMM d, yyyy")}
                </span>
              </div>
              
              <div className={`text-sm font-medium mt-1 ${expiryStatus.color}`}>
                {expiryStatus.text}
              </div>

              {item.notes && (
                <p className="text-sm text-gray-500 mt-2 italic">{item.notes}</p>
              )}
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 hover:bg-blue-50 hover:border-blue-200"
                onClick={() => onEdit(item)}
              >
                <Edit className="w-4 h-4 text-blue-600" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 hover:bg-red-50 hover:border-red-200"
                onClick={() => onDelete(item)}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}