
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker-with-range';
import { Loader, Calendar, Filter, ArrowRight } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

// Type definition for our room data
interface Room {
  id: string;
  number: string;
  type: string;
  property: string;
  capacity: number;
  rate: number;
  status: string;
  bookedDates: string[];
  bookings: any[];
}

const Availability = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 7));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  
  const fetchRoomAvailability = async (start: string, end: string): Promise<Room[]> => {
    try {
      setIsLoading(true);
      
      // Fetch rooms from Supabase
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*');
      
      if (roomsError) throw roomsError;
      
      // Fetch bookings that overlap with the date range
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .or(`check_in.lte.${end},check_out.gte.${start}`);
      
      if (bookingsError) throw bookingsError;
      
      // Process each room to determine availability
      return roomsData.map(room => {
        // Find all bookings for this room
        const roomBookings = bookings?.filter(booking => 
          booking.room_number === room.number && 
          booking.property === room.property_name
        ) || [];
        
        // Create an array of all dates in the specified range
        const dateRange: string[] = [];
        const startDateObj = new Date(start);
        const endDateObj = new Date(end);
        
        for (let dt = new Date(startDateObj); dt <= endDateObj; dt.setDate(dt.getDate() + 1)) {
          dateRange.push(new Date(dt).toISOString().split('T')[0]);
        }
        
        // Determine which dates are booked
        const bookedDates: string[] = [];
        
        // For each date in the range, check if the room is booked
        dateRange.forEach(date => {
          const isBooked = roomBookings.some(booking => {
            const checkIn = booking.check_in;
            const checkOut = booking.check_out;
            return date >= checkIn && date < checkOut;
          });
          
          if (isBooked) {
            bookedDates.push(date);
          }
        });
        
        // Return the room with availability information
        return {
          id: room.id,
          number: room.number,
          type: room.type,
          property: room.property_name,
          capacity: room.max_occupancy,
          rate: room.base_rate,
          status: room.status,
          bookedDates,
          bookings: roomBookings
        };
      });
    } catch (error) {
      console.error("Error fetching room availability:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setError(null);
      
      // Format dates for API request
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      
      // Fetch room availability
      const roomAvailability = await fetchRoomAvailability(formattedStartDate, formattedEndDate);
      setRooms(roomAvailability);
    } catch (err) {
      console.error("Error fetching availability:", err);
      setError("Failed to fetch availability data. Please try again.");
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  // Function to render color-coded dates in the calendar
  const renderDateCells = () => {
    // Calculate date range to display
    const dates = [];
    let currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    
    while (currentDate <= lastDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return (
      <div className="grid grid-cols-7 gap-1 mt-2">
        {/* Day labels */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-xs font-medium text-center py-1">
            {day}
          </div>
        ))}
        
        {/* Date cells */}
        {dates.map((date, index) => (
          <div key={index} className="p-1">
            <div className="text-xs text-center font-medium mb-1">
              {format(date, 'd MMM')}
            </div>
            <div className="grid gap-1">
              {rooms.map((room) => {
                const dateString = format(date, 'yyyy-MM-dd');
                const isBooked = room.bookedDates.includes(dateString);
                
                return (
                  <div
                    key={room.id}
                    className={`h-6 rounded-sm ${
                      isBooked ? 'bg-red-100 border border-red-200' : 'bg-green-100 border border-green-200'
                    }`}
                    title={`${room.number} - ${isBooked ? 'Booked' : 'Available'}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Room Availability</h1>
        <p className="text-muted-foreground mt-1">Check room availability and manage bookings</p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <DatePicker 
                value={{
                  from: startDate,
                  to: endDate
                }}
                onChange={(range) => {
                  if (range?.from) setStartDate(range.from);
                  if (range?.to) setEndDate(range.to);
                }}
              />
            </div>
            
            <Button onClick={handleSearch} className="flex items-center" disabled={isLoading}>
              {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Calendar className="mr-2 h-4 w-4" />}
              Check Availability
            </Button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 overflow-x-auto">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Availability Calendar</h2>
              <p className="text-sm text-muted-foreground">
                {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
              </p>
            </div>
            
            {rooms.length > 0 ? (
              <div className="min-w-[800px]">
                {renderDateCells()}
                
                <div className="mt-6 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-sm bg-green-100 border border-green-200"></div>
                      <span className="text-sm">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-sm bg-red-100 border border-red-200"></div>
                      <span className="text-sm">Booked</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Showing {rooms.length} room{rooms.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No rooms found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Room list */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Rooms</h2>
          
          {rooms.length > 0 ? (
            <div className="space-y-4">
              {rooms.map((room) => (
                <div 
                  key={room.id} 
                  className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <h3 className="font-medium">Room {room.number}</h3>
                    <p className="text-sm text-muted-foreground">{room.property} • {room.type}</p>
                    <div className="flex items-center mt-1 gap-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        Capacity: {room.capacity}
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                        ${room.rate}/night
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm">Book Now</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No rooms available for the selected dates.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Availability;
