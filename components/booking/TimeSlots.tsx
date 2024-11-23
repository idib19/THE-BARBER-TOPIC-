"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

const generateTimeSlots = (date: Date, serviceDuration: number) => {
  const slots: string[] = [];
  const startHour = 9;
  const endHour = 17;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      slots.push(time);
    }
  }

  if (format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")) {
    const now = new Date();
    return slots.filter((slot) => {
      const [hours, minutes] = slot.split(":").map(Number);
      return hours > now.getHours() || (hours === now.getHours() && minutes > now.getMinutes());
    });
  }

  return slots;
};

export default function TimeSlots({
  date: initialDate,
  serviceDuration,
  selectedTime,
  onTimeSelect,
}: {
  date: Date;
  serviceDuration: number;
  selectedTime: string | null;
  onTimeSelect: (time: string, date: Date) => void;
}) {
  const [date, setDate] = useState<Date>(initialDate);
  const timeSlots = generateTimeSlots(date, serviceDuration);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <CalendarIcon className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Select Date & Time</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border"
            disabled={(date) =>
              date < new Date() || date > new Date().setMonth(new Date().getMonth() + 2)
            }
          />
        </div>

        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                onClick={() => onTimeSelect(time, date)}
                className="w-full"
              >
                {time}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}