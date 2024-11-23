"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import ServiceSelection from "./ServiceSelection";
import TimeSlots from "./TimeSlots";
import CustomerForm from "./CustomerForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, CalendarRange, Users, Gift, Star } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import BookingSummary from "./BookingSummary";
import ReferralProgram from "./ReferralProgram";
import { Progress } from "@/components/ui/progress";

// Points tier configuration
const POINTS_TIERS = [
  { name: "Bronze", points: 1000, color: "bg-orange-500" },
  { name: "Silver", points: 2500, color: "bg-gray-400" },
  { name: "Gold", points: 5000, color: "bg-yellow-500" },
  { name: "Platinum", points: 10000, color: "bg-blue-500" },
];

export type Service = {
  id: string;
  name: string;
  duration: number;
  price: number;
};

export type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
  notes?: string;
};

type Mode = "select" | "book" | "refer";

export default function BookingInterface() {
  const [mode, setMode] = useState<Mode>("select");
  const [date, setDate] = useState<Date>(new Date());
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [step, setStep] = useState(1);

  // Mock current points (this would come from your backend)
  const currentPoints = 1500;
  const nextTier = POINTS_TIERS.find(tier => tier.points > currentPoints) || POINTS_TIERS[POINTS_TIERS.length - 1];
  const currentTier = POINTS_TIERS.find(tier => tier.points > currentPoints) 
    ? POINTS_TIERS[POINTS_TIERS.findIndex(tier => tier.points > currentPoints) - 1]
    : POINTS_TIERS[POINTS_TIERS.length - 1];
  
  const progressToNextTier = currentTier === POINTS_TIERS[POINTS_TIERS.length - 1]
    ? 100
    : ((currentPoints - (currentTier?.points || 0)) / (nextTier.points - (currentTier?.points || 0))) * 100;

  const handleCustomerSubmit = (info: CustomerInfo) => {
    setCustomerInfo(info);
    setStep(2);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(3);
  };

  const handleTimeSelect = (time: string, date: Date) => {
    setSelectedTime(time);
    setDate(date);
    setStep(4);
  };

  const handleBack = () => {
    if (mode !== "select") {
      setMode("select");
      setStep(1);
      setSelectedService(null);
      setSelectedTime(null);
      setCustomerInfo(null);
      return;
    }

    if (step > 1) {
      setStep(step - 1);
      if (step === 4) {
        setSelectedTime(null);
      } else if (step === 3) {
        setSelectedService(null);
      } else if (step === 2) {
        setCustomerInfo(null);
      }
    }
  };

  const renderModeSelection = () => (
    <div className="grid gap-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Welcome to BarberBook</h1>
        <p className="text-muted-foreground">Choose what you'd like to do today</p>
      </div>

      <Card className="p-4 border-2 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">{currentTier.name} Member</p>
              <p className="text-sm text-muted-foreground">
                {nextTier === currentTier 
                  ? "You've reached the highest tier!" 
                  : `${nextTier.points - currentPoints} points until ${nextTier.name}`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">{currentPoints}</p>
            <p className="text-sm text-muted-foreground">Points</p>
          </div>
        </div>
        <Progress value={progressToNextTier} className="h-2" />
      </Card>

      <div className="grid gap-4">
        <Button
          variant="outline"
          size="lg"
          className="h-auto py-6 px-6"
          onClick={() => setMode("book")}
        >
          <div className="flex flex-col items-center gap-2 text-left">
            <div className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5" />
              <span className="font-semibold">Book an Appointment</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Schedule your next haircut or service
            </span>
          </div>
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="h-auto py-6 px-6"
          onClick={() => setMode("refer")}
        >
          <div className="flex flex-col items-center gap-2 text-left">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              <span className="font-semibold">Refer & Earn Points</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Invite friends and earn rewards
            </span>
          </div>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {(mode !== "select" || step > 1) && (
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <Link href="/" className="text-2xl font-bold hover:opacity-80">
              {mode === "book" ? "Book Appointment" : mode === "refer" ? "Referral Program" : "BarberBook"}
            </Link>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-4 w-4" />
            {format(new Date(), "EEEE, MMMM d")}
          </Badge>
        </div>

        <Card className="p-6">
          {mode === "select" && renderModeSelection()}

          {mode === "book" && (
            <div className="space-y-6">
              {/* Progress Steps */}
              <div className="flex justify-between items-center mb-8">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step >= stepNumber
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {stepNumber}
                    </div>
                    {stepNumber < 4 && (
                      <div
                        className={`h-1 w-16 mx-2 ${
                          step > stepNumber ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {step === 1 && <CustomerForm onSubmit={handleCustomerSubmit} />}
              {step === 2 && customerInfo && (
                <ServiceSelection onSelect={handleServiceSelect} />
              )}
              {step === 3 && selectedService && customerInfo && (
                <TimeSlots
                  date={date}
                  serviceDuration={selectedService.duration}
                  selectedTime={selectedTime}
                  onTimeSelect={handleTimeSelect}
                />
              )}
              {step === 4 && selectedService && selectedTime && customerInfo && (
                <BookingSummary
                  service={selectedService}
                  date={date}
                  time={selectedTime}
                  customerInfo={customerInfo}
                />
              )}
            </div>
          )}

          {mode === "refer" && <ReferralProgram />}
        </Card>
      </div>
    </div>
  );
}