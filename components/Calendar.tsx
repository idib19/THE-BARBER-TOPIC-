"use client";

import { useState, useEffect } from "react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  parseISO,
  isSameDay,
} from "date-fns";
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBookingsForDate, getBookingsForWeek } from "@/lib/mockData";
import type { Booking } from "@/lib/mockData";
import { Avatar } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface CalendarProps {
  view: "daily" | "weekly";
  onBookingSelect: (booking: Booking) => void;
}

export function Calendar({ view, onBookingSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (view === "daily") {
      setBookings(getBookingsForDate(currentDate));
    } else {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      setBookings(getBookingsForWeek(weekStart, weekEnd));
    }
  }, [currentDate, view]);

  const navigateDate = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      if (view === "daily") {
        return direction === "prev"
          ? addDays(prevDate, -1)
          : addDays(prevDate, 1);
      } else {
        return direction === "prev"
          ? addDays(prevDate, -7)
          : addDays(prevDate, 7);
      }
    });
  };

  const renderBookingDetails = (booking: Booking) => (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <img src={booking.avatar} alt={booking.clientName} />
        </Avatar>
        <div>
          <h4 className="font-medium">{booking.clientName}</h4>
          <p className="text-sm text-muted-foreground">{booking.service}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{booking.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span>{format(parseISO(booking.date), "MMM d")}</span>
        </div>
      </div>
    </div>
  );

  const renderAppointment = (booking: Booking) => (
    <HoverCard key={booking.id}>
      <HoverCardTrigger asChild>
        <div
          className="flex items-center gap-2 bg-primary/10 border-l-4 border-primary p-2 rounded-r-md cursor-pointer hover:bg-primary/20 transition-colors"
          onClick={() => onBookingSelect(booking)}
        >
          <Avatar className="w-6 h-6">
            <img src={booking.avatar} alt={booking.clientName} />
          </Avatar>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{booking.clientName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {booking.service}
            </p>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        {renderBookingDetails(booking)}
      </HoverCardContent>
    </HoverCard>
  );

  const renderDailyView = () => {
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM
    return (
      <div className="space-y-4">
        {hours.map((hour) => {
          const hourBookings = bookings.filter(
            (booking) => parseInt(booking.time.split(":")[0]) === hour
          );
          return (
            <div key={hour} className="flex items-start gap-4">
              <div className="min-w-[4rem] text-sm text-muted-foreground pt-2">
                {format(new Date().setHours(hour), "h a")}
              </div>
              <div className="flex-1 min-h-[4rem] border rounded-md bg-muted/50 p-2">
                <div className="flex gap-2 flex-wrap">
                  {hourBookings.map(renderAppointment)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeeklyView = () => {
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

    return (
      <div className="overflow-x-auto">
        <div className="grid" style={{ gridTemplateColumns: "4rem repeat(7, minmax(200px, 1fr))" }}>
          {/* Time column header */}
          <div className="sticky left-0 z-10 bg-background border-b p-2"></div>
          {/* Day headers */}
          {days.map((day) => {
            const isToday = isSameDay(day, new Date());
            return (
              <Button
                key={day.toString()}
                variant={isToday ? "default" : "ghost"}
                className="m-1 h-auto py-2"
              >
                <div className="text-center">
                  <div className="text-sm font-medium">{format(day, "EEE")}</div>
                  <div className="text-lg">{format(day, "d")}</div>
                </div>
              </Button>
            );
          })}

          {/* Time slots */}
          {hours.map((hour) => (
            <div key={`row-${hour}`} className="contents">
              {/* Time label */}
              <div
                className="sticky left-0 z-10 bg-background border-b p-2 text-sm text-muted-foreground"
              >
                {format(new Date().setHours(hour), "h a")}
              </div>
              {/* Day columns */}
              {days.map((day) => {
                const dayBookings = bookings.filter(
                  (booking) =>
                    isSameDay(parseISO(booking.date), day) &&
                    parseInt(booking.time.split(":")[0]) === hour
                );
                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="border-b border-r p-1 min-h-[5rem]"
                  >
                    <div className="flex gap-2 flex-wrap">
                      {dayBookings.map(renderAppointment)}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="icon" onClick={() => navigateDate("prev")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {view === "daily"
            ? format(currentDate, "MMMM d, yyyy")
            : `${format(startOfWeek(currentDate), "MMM d")} - ${format(
                endOfWeek(currentDate),
                "MMM d, yyyy"
              )}`}
        </h2>
        <Button variant="outline" size="icon" onClick={() => navigateDate("next")}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      {view === "daily" ? renderDailyView() : renderWeeklyView()}
    </div>
  );
}