import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { addDays, format, isSameDay } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAvailability } from "@/hooks/useAvailability";
import { fetchRoomAvailability } from "@/services/api";

// Define types for room and booking data
interface Booking {
  id: string;
  guestName: string;
  startDate: Date;
  endDate: Date;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
}

interface RoomWithBookings {
  id: string;
  number: string;
  property: string;
  property_name: string;
  type: string;
  capacity: number;
  rate: number;
  bookedDates: string[];
  bookings: Booking[];
}

const Availability = () => {
  const { toast } = useToast();
  
  // State for date selection
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });
  
  // State for room data and other component states
  const [rooms, setRooms] = useState<RoomWithBookings[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  
  // Get unique properties for filtering
  const properties = [...new Set(rooms.map(room => room.property))].sort();
  
  // Filter rooms based on selected property
  const filteredRooms = selectedProperty
    ? rooms.filter(room => room.property === selectedProperty)
    : rooms;
  
  // Function to fetch rooms' availability data
  useEffect(() => {
    const loadAvailabilityData = async () => {
      if (!dateRange.from || !dateRange.to) return;
      
      try {
        setIsLoading(true);
        
        const startDate = format(dateRange.from, 'yyyy-MM-dd');
        const endDate = format(dateRange.to, 'yyyy-MM-dd');
        
        const availabilityData = await fetchRoomAvailability(startDate, endDate);
        
        // Format the data to match our component's expected format
        const formattedRooms = availabilityData.map(room => {
          // Convert bookedDates strings to Date objects for bookings
          const bookings = room.bookings ? room.bookings.map((booking: any) => ({
            id: booking.id,
            guestName: booking.guest_name,
            startDate: new Date(booking.check_in),
            endDate: new Date(booking.check_out),
            status: booking.status
          })) : [];
          
          return {
            id: room.id,
            number: room.number,
            property: room.property,
            property_name: room.property_name,
            type: room.type,
            capacity: room.capacity,
            rate: room.rate,
            bookedDates: room.bookedDates || [],
            bookings
          };
        });
        
        setRooms(formattedRooms);
      } catch (error) {
        console.error('Error loading availability data:', error);
        toast({
          title: "Error",
          description: "Failed to load availability data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAvailabilityData();
  }, [dateRange, toast]);
  
  // Function to check if a date is booked for a room
  const isDateBooked = (room: RoomWithBookings, date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return room.bookedDates?.includes(dateString) || false;
  };
  
  // Function to handle date selection
  const handleDateSelect = (day: Date) => {
    setDate(day);
    
    // Find bookings for this date
    const bookingsForDate = rooms.flatMap(room => {
      return room.bookings.filter(booking => {
        const bookingDate = new Date(booking.startDate);
        return isSameDay(bookingDate, day);
      }).map(booking => ({
        ...booking,
        roomNumber: room.number,
        property: room.property
      }));
    });
    
    // You could show these bookings in a modal or sidebar
    console.log('Bookings for selected date:', bookingsForDate);
  };
  
  // Function to handle date range selection
  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range);
    }
  };
  
  // Function to toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === 'calendar' ? 'list' : 'calendar');
  };
  
  // Function to handle property filter change
  const handlePropertyChange = (property: string | null) => {
    setSelectedProperty(property);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Availability Calendar</h1>
        <p className="text-muted-foreground mt-1">View and manage room availability</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Calendar header with filters and view toggle */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Room Availability</CardTitle>
                <CardDescription>
                  {isLoading ? 'Loading availability data...' : `Showing ${filteredRooms.length} rooms`}
                </CardDescription>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <select
                    className="border rounded p-1 text-sm"
                    value={selectedProperty || ''}
                    onChange={(e) => handlePropertyChange(e.target.value || null)}
                  >
                    <option value="">All Properties</option>
                    {properties.map(property => (
                      <option key={property} value={property}>{property}</option>
                    ))}
                  </select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleViewMode}
                  >
                    {viewMode === 'calendar' ? 'List View' : 'Calendar View'}
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">Loading availability data...</p>
              </div>
            ) : viewMode === 'calendar' ? (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={handleDateRangeSelect}
                    numberOfMonths={2}
                    className="rounded-md border"
                  />
                </div>
                
                <div className="space-y-4">
                  {filteredRooms.map(room => (
                    <div key={room.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">
                          Room {room.number} - {room.type}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {room.property} | Capacity: {room.capacity} | ${room.rate}/night
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {Array.from({ length: 30 }, (_, i) => {
                          const day = addDays(new Date(), i);
                          const isBooked = isDateBooked(room, day);
                          return (
                            <div
                              key={i}
                              className={`w-8 h-8 flex items-center justify-center text-xs rounded-md cursor-pointer ${
                                isBooked
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                              title={`${format(day, 'MMM dd')} - ${isBooked ? 'Booked' : 'Available'}`}
                            >
                              {format(day, 'd')}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-2">Room</th>
                      <th className="text-left p-2">Property</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Capacity</th>
                      <th className="text-left p-2">Rate</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRooms.map(room => (
                      <tr key={room.id} className="border-b">
                        <td className="p-2">{room.number}</td>
                        <td className="p-2">{room.property}</td>
                        <td className="p-2">{room.type}</td>
                        <td className="p-2">{room.capacity}</td>
                        <td className="p-2">${room.rate}/night</td>
                        <td className="p-2">
                          {isDateBooked(room, new Date()) ? (
                            <span className="text-red-600">Booked</span>
                          ) : (
                            <span className="text-green-600">Available</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Availability;
