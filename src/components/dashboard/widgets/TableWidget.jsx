import React from "react";
import { Badge } from "@/components/ui/badge";
import { format, differenceInDays } from "date-fns";
import { AlertTriangle, CheckCircle } from "lucide-react";

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

export default function TableWidget({ foodItems = [], limit = 10 }) {
  const sortedItems = [...foodItems]
    .sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date))
    .slice(0, limit);

  if (foodItems.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <p>No items in inventory</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-gray-50">
          <tr>
            <th className="text-left p-2 font-medium text-gray-600">Item</th>
            <th className="text-left p-2 font-medium text-gray-600">Category</th>
            <th className="text-left p-2 font-medium text-gray-600">Qty</th>
            <th className="text-left p-2 font-medium text-gray-600">Expires</th>
            <th className="text-left p-2 font-medium text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item) => {
            const daysLeft = differenceInDays(new Date(item.expiry_date), new Date());
            const isExpired = daysLeft < 0;
            const isExpiringSoon = daysLeft >= 0 && daysLeft <= 3;
            
            return (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="p-2 font-medium text-gray-900">{item.name}</td>
                <td className="p-2">
                  <Badge className={`${categoryColors[item.category]} text-xs`}>
                    {item.category}
                  </Badge>
                </td>
                <td className="p-2 text-gray-600">
                  {item.quantity} {item.unit}
                </td>
                <td className="p-2 text-gray-600">
                  {format(new Date(item.expiry_date), "MMM d")}
                </td>
                <td className="p-2">
                  {isExpired ? (
                    <span className="flex items-center gap-1 text-red-600">
                      <AlertTriangle className="w-3 h-3" /> Expired
                    </span>
                  ) : isExpiringSoon ? (
                    <span className="flex items-center gap-1 text-orange-600">
                      <AlertTriangle className="w-3 h-3" /> {daysLeft}d left
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-3 h-3" /> Good
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}