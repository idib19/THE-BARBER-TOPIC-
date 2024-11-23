import { addDays, isSameDay, isWithinInterval } from 'date-fns';

export interface Booking {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  duration: number;
  avatar: string;
}

const mockBookings: Booking[] = [
  {
    id: '1',
    clientName: 'John Doe',
    service: 'Haircut & Beard Trim',
    date: new Date().toISOString(),
    time: '09:00',
    duration: 45,
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
  },
  {
    id: '2',
    clientName: 'Mike Smith',
    service: 'Fade Haircut',
    date: new Date().toISOString(),
    time: '10:30',
    duration: 30,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
  },
  {
    id: '3',
    clientName: 'Sarah Johnson',
    service: 'Haircut',
    date: addDays(new Date(), 1).toISOString(),
    time: '11:30',
    duration: 30,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
];

export function getBookingsForDate(date: Date): Booking[] {
  return mockBookings.filter(booking => 
    isSameDay(new Date(booking.date), date)
  );
}

export function getBookingsForWeek(start: Date, end: Date): Booking[] {
  return mockBookings.filter(booking =>
    isWithinInterval(new Date(booking.date), { start, end })
  );
}