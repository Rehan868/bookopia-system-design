
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { useAvailability } from '@/hooks/useAvailability';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const OwnerAvailability = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { data: availabilityData, isLoading, error } = useAvailability(new Date(), 1);
  
  // Function to get room status based on availability data
  const getRoomStatus = (date: Date): Record<string, string> => {
    if (!availabilityData) return {};
    
    const formattedDate = format(date, 'yyyy-MM-dd');
    const result: Record<string, string> = {};
    
    availabilityData.forEach(room => {
      // Check if the date is in the booked dates array
      const isBooked = room.bookedDates && room.bookedDates.includes(formattedDate);
      result[room.number] = isBooked ? 'booked' : 'available';
      
      // Check if the room is under maintenance
      if (room.status === 'maintenance') {
        result[room.number] = 'maintenance';
      }
    });
    
    return result;
  };
  
  // Get status for the selected date
  const roomStatus = date ? getRoomStatus(date) : {};
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Availability Calendar</h1>
          <p className="text-muted-foreground mt-1">Check room availability for your properties</p>
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }
  
  if (error) {
    toast({
      title: "Error loading availability data",
      description: "Please try again later",
      variant: "destructive"
    });
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Availability Calendar</h1>
        <p className="text-muted-foreground mt-1">Check room availability for your properties</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border pointer-events-auto"
            />
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {date ? `Room Status for ${format(date, 'MMMM d, yyyy')}` : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(roomStatus).length > 0 ? (
                Object.entries(roomStatus).map(([roomNumber, status]) => (
                  <div 
                    key={roomNumber} 
                    className={`p-4 rounded-md border ${
                      status === 'available' ? 'bg-green-50 border-green-200' :
                      status === 'booked' ? 'bg-red-50 border-red-200' :
                      'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="font-medium">Room {roomNumber}</div>
                    <div className={`text-sm ${
                      status === 'available' ? 'text-green-700' :
                      status === 'booked' ? 'text-red-700' :
                      'text-yellow-700'
                    }`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center p-4 text-muted-foreground">
                  No rooms available for this date.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OwnerAvailability;
