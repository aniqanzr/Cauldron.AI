import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CalendarWidget({ foodItems = [] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getExpiringItemsForDay = (day) => {
    return foodItems.filter(item => 
      isSameDay(new Date(item.expiry_date), day)
    );
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Pad the beginning of the month
  const startDay = monthStart.getDay();
  const paddedDays = Array(startDay).fill(null).concat(days);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="h-8 w-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="font-semibold text-gray-800">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="h-8 w-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 p-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 flex-1">
        {paddedDays.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="p-1" />;
          }

          const expiringItems = getExpiringItemsForDay(day);
          const isToday = isSameDay(day, new Date());
          const hasExpiring = expiringItems.length > 0;

          return (
            <div
              key={day.toString()}
              className={`p-1 text-center rounded-lg text-sm relative group transition-colors
                ${isToday ? 'bg-green-100 text-green-800 font-bold' : 'hover:bg-gray-100'}
                ${hasExpiring ? 'ring-2 ring-orange-300' : ''}
              `}
            >
              <span>{format(day, "d")}</span>
              {hasExpiring && (
                <div className="absolute -top-1 -right-1">
                  <Badge className="h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-orange-500">
                    {expiringItems.length}
                  </Badge>
                </div>
              )}
              
              {hasExpiring && (
                <div className="absolute z-10 left-1/2 -translate-x-1/2 top-full mt-1 bg-white shadow-lg rounded-lg p-2 hidden group-hover:block min-w-[120px]">
                  <p className="text-xs font-medium text-gray-600 mb-1">Expiring:</p>
                  {expiringItems.slice(0, 3).map((item, i) => (
                    <p key={i} className="text-xs text-gray-800 truncate">{item.name}</p>
                  ))}
                  {expiringItems.length > 3 && (
                    <p className="text-xs text-gray-400">+{expiringItems.length - 3} more</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}