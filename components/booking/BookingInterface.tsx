"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Scissors, Gift, Star, CalendarRange } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import ServiceSelection from "./ServiceSelection";
import TimeSlots from "./TimeSlots";
import CustomerForm from "./CustomerForm";
import BookingSummary from "./BookingSummary";
import ReferralProgram from "./ReferralProgram";

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

// Mock customer data
const customer = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  points: 1500,
  tier: "Silver",
  avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100"
};

export default function BookingInterface() {
  const [mode, setMode] = useState<Mode>("select");
  const [date, setDate] = useState<Date>(new Date());
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [step, setStep] = useState(1);

  const nextTier = POINTS_TIERS.find(tier => tier.points > customer.points) || POINTS_TIERS[POINTS_TIERS.length - 1];
  const currentTier = POINTS_TIERS.find(tier => tier.points > customer.points) 
    ? POINTS_TIERS[POINTS_TIERS.findIndex(tier => tier.points > customer.points) - 1]
    : POINTS_TIERS[POINTS_TIERS.length - 1];
  
  const progressToNextTier = currentTier === POINTS_TIERS[POINTS_TIERS.length - 1]
    ? 100
    : ((customer.points - (currentTier?.points || 0)) / (nextTier.points - (currentTier?.points || 0))) * 100;

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
      return;
    }
    if (step > 1) setStep(step - 1);
  };

  const renderModeSelection = () => (
    <div className="container mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={customer.avatar} alt={customer.name} />
            <AvatarFallback>{customer.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{customer.name}</CardTitle>
            <CardDescription>{customer.email}</CardDescription>
            <CardDescription>{customer.phone}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">Loyalty Points</p>
                <p className="text-3xl font-bold">{customer.points}</p>
              </div>
              <Badge variant="secondary" className="text-lg py-1">
                {currentTier.name} Member
              </Badge>
            </div>
            <Progress value={progressToNextTier} className="h-2" />
            <p className="text-sm text-muted-foreground text-center">
              {nextTier === currentTier 
                ? "You've reached the highest tier!" 
                : `${nextTier.points - customer.points} points until ${nextTier.name}`}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5" />
              Book Appointment
            </CardTitle>
            <CardDescription>Schedule your next haircut or service</CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" onClick={() => setMode("book")} className="w-full">
              <Scissors className="mr-2 h-4 w-4" /> Book Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Refer & Earn
            </CardTitle>
            <CardDescription>Invite friends and earn rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" variant="outline" onClick={() => setMode("refer")} className="w-full">
              <Star className="mr-2 h-4 w-4" /> Start Referring
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        {mode === "select" && renderModeSelection()}

        {mode === "book" && (
          <Card>
            <CardHeader>
              <Button variant="ghost" size="icon" onClick={handleBack} className="mb-4">
                <Scissors className="h-5 w-5" />
              </Button>
              <CardTitle>Book Appointment</CardTitle>
              <CardDescription>Complete your booking in a few steps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
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
            </CardContent>
          </Card>
        )}

        {mode === "refer" && (
          <Card>
            <CardHeader>
              <Button variant="ghost" size="icon" onClick={handleBack} className="mb-4">
                <Gift className="h-5 w-5" />
              </Button>
              <CardTitle>Referral Program</CardTitle>
              <CardDescription>Invite friends and earn rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <ReferralProgram />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}