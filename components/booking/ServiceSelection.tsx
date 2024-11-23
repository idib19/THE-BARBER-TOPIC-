"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors } from "lucide-react";
import type { Service } from "./BookingInterface";

const services: Service[] = [
  {
    id: "1",
    name: "Haircut",
    duration: 30,
    price: 30,
  },
  {
    id: "2",
    name: "Haircut & Beard Trim",
    duration: 45,
    price: 45,
  },
  {
    id: "3",
    name: "Fade Haircut",
    duration: 30,
    price: 35,
  },
  {
    id: "4",
    name: "Beard Trim",
    duration: 20,
    price: 20,
  },
];

export default function ServiceSelection({
  onSelect,
}: {
  onSelect: (service: Service) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scissors className="h-5 w-5" />
          Select Service
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => onSelect(service)}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-sm transition-all"
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">{service.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {service.duration} minutes
                </span>
              </div>
              <span className="font-semibold">${service.price}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}