"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import type { Service, CustomerInfo } from "./BookingInterface";
import { CalendarCheck, User, Scissors, Clock } from "lucide-react";

export default function BookingSummary({
  service,
  date,
  time,
  customerInfo,
}: {
  service: Service;
  date: Date;
  time: string;
  customerInfo: CustomerInfo;
}) {
  const handleConfirm = () => {
    // Here you would typically send the booking data to your backend
    console.log({ service, date, time, customerInfo });
    toast.success("Appointment booked successfully!", {
      description: `We'll see you on ${format(date, "MMMM d")} at ${time}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <CalendarCheck className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Booking Summary</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
            <User className="h-5 w-5 mt-1" />
            <div>
              <h3 className="font-medium">Customer Details</h3>
              <p className="text-sm text-muted-foreground">{customerInfo.name}</p>
              <p className="text-sm text-muted-foreground">{customerInfo.email}</p>
              <p className="text-sm text-muted-foreground">{customerInfo.phone}</p>
              {customerInfo.notes && (
                <p className="text-sm text-muted-foreground mt-2">
                  Notes: {customerInfo.notes}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
            <Scissors className="h-5 w-5 mt-1" />
            <div>
              <h3 className="font-medium">Service Details</h3>
              <p className="text-sm text-muted-foreground">{service.name}</p>
              <p className="text-sm text-muted-foreground">
                Duration: {service.duration} minutes
              </p>
              <p className="font-medium mt-2">${service.price}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
            <Clock className="h-5 w-5 mt-1" />
            <div>
              <h3 className="font-medium">Appointment Time</h3>
              <p className="text-sm text-muted-foreground">
                {format(date, "EEEE, MMMM d, yyyy")}
              </p>
              <p className="text-sm text-muted-foreground">at {time}</p>
            </div>
          </div>
        </div>

        <Button onClick={handleConfirm} className="w-full">
          Confirm Booking
        </Button>
      </div>
    </div>
  );
}