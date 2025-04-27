
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarClock, Clock, User } from 'lucide-react';

interface BookingData {
  id: string;
  guestName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  createdAt: string;
}

// Mock data - would come from API in real app
const bookings: BookingData[] = [
  {
    id: 'B1001',
    guestName: 'John Smith',
    roomName: 'Deluxe Suite 101',
    checkIn: '2023-06-15',
    checkOut: '2023-06-18',
    status: 'confirmed',
    createdAt: '2023-06-01T10:30:00'
  },
  {
    id: 'B1002',
    guestName: 'Emma Johnson',
    roomName: 'Executive Room 205',
    checkIn: '2023-06-14',
    checkOut: '2023-06-16',
    status: 'checked-in',
    createdAt: '2023-06-10T14:45:00'
  },
  {
    id: 'B1003',
    guestName: 'Michael Chen',
    roomName: 'Standard Room 304',
    checkIn: '2023-06-12',
    checkOut: '2023-06-13',
    status: 'checked-out',
    createdAt: '2023-06-08T09:15:00'
  },
  {
    id: 'B1004',
    guestName: 'Sarah Davis',
    roomName: 'Deluxe Suite 102',
    checkIn: '2023-06-18',
    checkOut: '2023-06-20',
    status: 'confirmed',
    createdAt: '2023-06-11T16:20:00'
  }
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'checked-in':
      return 'bg-green-100 text-green-800';
    case 'checked-out':
      return 'bg-gray-100 text-gray-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function RecentBookings() {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-4">
        <CardTitle>Recent Bookings</CardTitle>
        <CardDescription>Latest booking activity across all properties</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{booking.guestName}</span>
                  <Badge className={cn("text-xs font-normal", getStatusColor(booking.status))}>
                    {booking.status.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    <span>{booking.roomName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarClock className="h-3.5 w-3.5" />
                    <span>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Details</Button>
                {booking.status === 'confirmed' && (
                  <Button size="sm">Check In</Button>
                )}
              </div>
            </div>
          ))}
          
          <div className="flex justify-center mt-2">
            <Button variant="outline" className="w-full">View All Bookings</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
