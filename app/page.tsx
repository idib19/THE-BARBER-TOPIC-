import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scissors, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <Scissors className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Welcome to BarberBook</h1>
          <p className="text-muted-foreground">
            Book your next appointment or manage your barbershop schedule
          </p>
        </div>

        <div className="grid gap-4">
          <Link href="/book">
            <Button className="w-full gap-2" size="lg">
              <Calendar className="h-5 w-5" />
              Book Appointment
            </Button>
          </Link>
          <Link href="/barber">
            <Button variant="outline" className="w-full gap-2" size="lg">
              <Scissors className="h-5 w-5" />
              Barber Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}