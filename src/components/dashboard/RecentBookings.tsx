import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarClock, User } from 'lucide-react';
import { useRecentBookings } from '@/hooks/useRecentBookings';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to format dates nicely
const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch (e) {
    return dateString;
  }
};

// Function to get appropriate styling based on booking status
const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-50 border-green-200 text-green-700';
    case 'pending':
      return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    case 'cancelled':
      return 'bg-red-50 border-red-200 text-red-700';
    case 'checked-in':
      return 'bg-blue-50 border-blue-200 text-blue-700';
    case 'checked-out':
      return 'bg-gray-50 border-gray-200 text-gray-700';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-700';
  }
};

export function RecentBookings() {
  const { data: bookings, isLoading, error } = useRecentBookings(5);

  // Loading state
  if (isLoading) {
    return (
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
        <CardHeader className="pb-4">
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest booking activity across all properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border-b border-border last:border-0 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-60 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
        <CardHeader className="pb-4">
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest booking activity across all properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p>Error loading recent bookings</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!bookings || bookings.length === 0) {
    return (
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
        <CardHeader className="pb-4">
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest booking activity across all properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p>No recent bookings found</p>
            <Link to="/bookings/new">
              <Button size="sm" className="mt-2">Create Booking</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                  <span className="font-medium">{booking.guest_name}</span>
                  <Badge className={cn("text-xs font-normal", getStatusColor(booking.status))}>
                    {booking.status.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    <span>{booking.room_number}, {booking.property}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarClock className="h-3.5 w-3.5" />
                    <span>{formatDate(booking.check_in)} - {formatDate(booking.check_out)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/bookings/${booking.id}`}>
                  <Button variant="outline" size="sm">Details</Button>
                </Link>
                {booking.status === 'confirmed' && (
                  <Link to={`/bookings/${booking.id}?action=check-in`}>
                    <Button size="sm">Check In</Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
          
          <div className="flex justify-center mt-2">
            <Link to="/bookings">
              <Button variant="outline" className="w-full">View All Bookings</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
