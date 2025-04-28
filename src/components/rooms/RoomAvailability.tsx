
import React, { useState } from 'react';
import { addDays, addMonths, format, isSameDay, isBefore, isAfter } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSingleRoomAvailability } from '@/hooks/useAvailability';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface RoomAvailabilityProps {
  roomId: string;
  showNavigation?: boolean;
  monthsToShow?: number;
  className?: string;
}

const RoomAvailability: React.FC<RoomAvailabilityProps> = ({
  roomId,
  showNavigation = true,
  monthsToShow = 1,
  className
}) => {
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const endDate = addMonths(startDate, monthsToShow);
  
  const { data: roomData, isLoading, error } = useSingleRoomAvailability(roomId, startDate, endDate);

  // Generate all days for the calendar header
  const allDays = [];
  let currentDay = new Date(startDate);
  while (isBefore(currentDay, endDate)) {
    allDays.push(new Date(currentDay));
    currentDay = addDays(currentDay, 1);
  }

  // Change date range
  const goToPreviousMonth = () => {
    setStartDate(addMonths(startDate, -1));
  };

  const goToNextMonth = () => {
    setStartDate(addMonths(startDate, 1));
  };

  const goToToday = () => {
    setStartDate(today);
  };

  // Check if a date is booked
  const isDateBooked = (date: Date) => {
    if (!roomData?.bookedDates) return false;
    const formattedDate = format(date, 'yyyy-MM-dd');
    return roomData.bookedDates.includes(formattedDate);
  };

  // Get booking for a specific date
  const getBooking = (date: Date) => {
    if (!roomData?.bookings) return null;
    
    return roomData.bookings.find(booking => {
      const checkInDate = new Date(booking.check_in);
      const checkOutDate = new Date(booking.check_out);
      return (
        isSameDay(date, checkInDate) || 
        (isAfter(date, checkInDate) && isBefore(date, checkOutDate))
      );
    });
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle>Room Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-52 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !roomData) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle>Room Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4 text-muted-foreground">
            <p>Error loading room availability data.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-base">
          <Calendar className="mr-2 h-4 w-4" />
          {roomData.number} - {format(startDate, 'MMMM yyyy')}
        </CardTitle>
        {showNavigation && (
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth} className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday} className="h-7 px-2">
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth} className="h-7 w-7">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="px-2 pb-2">
        <div className="grid grid-cols-7 gap-1">
          {/* Days of week header */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-medium text-xs p-1">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {Array.from({ length: new Date(startDate.getFullYear(), startDate.getMonth(), 1).getDay() }, (_, i) => (
            <div key={`empty-${i}`} className="p-1 text-center text-xs"></div>
          ))}
          
          {Array.from(
            { length: new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate() },
            (_, i) => {
              const date = new Date(startDate.getFullYear(), startDate.getMonth(), i + 1);
              const isToday = isSameDay(date, new Date());
              const isBooked = isDateBooked(date);
              const booking = getBooking(date);
              const isCheckIn = booking && isSameDay(new Date(booking.check_in), date);
              const isCheckOut = booking && isSameDay(new Date(booking.check_out), date);
              
              return (
                <div 
                  key={i} 
                  className={cn(
                    "aspect-square p-1 text-center rounded-sm text-xs relative",
                    isToday ? "border border-primary" : "",
                    isBooked ? "bg-red-50 dark:bg-red-900/20" : "bg-green-50 dark:bg-green-900/20",
                    isCheckIn ? "border-l-2 border-l-blue-500" : "",
                    isCheckOut ? "border-r-2 border-r-blue-500" : ""
                  )}
                >
                  <div className="font-medium">{i + 1}</div>
                  {booking && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/70 rounded-sm">
                      <Link 
                        to={`/bookings/${booking.id}`}
                        className="text-[9px] text-white p-1"
                      >
                        {isCheckIn ? 'Check In' : isCheckOut ? 'Check Out' : 'Booked'}
                      </Link>
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
        
        <div className="flex justify-between items-center mt-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-50 border border-green-200 rounded-sm mr-1"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-50 border border-red-200 rounded-sm mr-1"></div>
              <span>Booked</span>
            </div>
          </div>
          <div className="text-muted-foreground">{roomData.status || 'Available'}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomAvailability;
