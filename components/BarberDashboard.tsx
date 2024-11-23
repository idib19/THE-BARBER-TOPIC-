"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Scissors,
  Calendar as CalendarIcon,
  Clock,
  Users,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "./Calendar";
import type { Booking } from "@/lib/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";

export default function BarberDashboard() {
  const [view, setView] = useState<"daily" | "weekly">("daily");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleBookingSelect = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scissors className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Barber Dashboard</h1>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-4 w-4" />
            {format(new Date(), "EEEE, MMMM d")}
          </Badge>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Schedule
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={view === "daily" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("daily")}
              >
                <LayoutList className="h-4 w-4 mr-2" />
                Daily
              </Button>
              <Button
                variant={view === "weekly" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("weekly")}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Weekly
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar view={view} onBookingSelect={handleBookingSelect} />
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={selectedBooking !== null}
        onOpenChange={() => setSelectedBooking(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <img
                    src={selectedBooking.avatar}
                    alt={selectedBooking.clientName}
                  />
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedBooking.clientName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedBooking.service}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {format(new Date(selectedBooking.date), "MMMM d, yyyy")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{selectedBooking.time}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedBooking.duration} minutes</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}