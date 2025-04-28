import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { CalendarClock, ChevronLeft, ChevronRight, PlusCircle, RefreshCw, Filter, Calendar as CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { fetchRoomAvailability } from '@/services/api';

interface RoomBooking {
  id: string;
  guestName: string;
  startDate: Date;
  endDate: Date;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
}

interface Room {
  id: string;
  number: string;
  property: string;
  type: string;
  status: 'available' | 'occupied' | 'maintenance';
  bookings: RoomBooking[];
}

// Generate array of dates for the calendar view
const generateDates = (startDate: Date, days: number) => {
  const dates = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  return dates;
};

// Calculate booking position and width for the calendar view
const calculateBookingStyle = (booking: RoomBooking, viewStartDate: Date, totalDays: number) => {
  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);
  
  // Calculate days from view start to booking start
  const startDiff = Math.max(0, Math.floor((startDate.getTime() - viewStartDate.getTime()) / (24 * 60 * 60 * 1000)));
  
  // Calculate booking duration in days
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
  
  // Ensure the booking is visible in the current view
  if (startDiff >= totalDays || startDiff + duration <= 0) {
    return null;
  }
  
  // Adjust start and width if the booking extends outside the view
  const visibleStart = Math.max(0, startDiff);
  const visibleDuration = Math.min(totalDays - visibleStart, duration - Math.max(0, -startDiff));
  
  return {
    left: `${(visibleStart / totalDays) * 100}%`,
    width: `${(visibleDuration / totalDays) * 100}%`,
    status: booking.status
  };
};

const Availability = () => {
  const { toast } = useToast();
  const [viewStartDate, setViewStartDate] = useState(new Date());
  const [displayDays, setDisplayDays] = useState(14); // Show 2 weeks by default
  const [property, setProperty] = useState<string | undefined>("all");
  const [roomType, setRoomType] = useState<string | undefined>("all");
  const [roomStatus, setRoomStatus] = useState<string | undefined>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  
  const calendarDates = generateDates(viewStartDate, displayDays);

  // Fetch room availability data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = viewStartDate.toISOString().split('T')[0];
        const endDate = new Date(viewStartDate);
        endDate.setDate(endDate.getDate() + displayDays);
        const endDateString = endDate.toISOString().split('T')[0];

        const data = await fetchRoomAvailability(startDate, endDateString);
        const transformedData = data.map((room: any) => ({
          ...room,
          status: room.bookedDates.length > 0 ? 'occupied' : 'available', // Example logic to determine status
        }));
        setFilteredRooms(transformedData);
      } catch (error) {
        console.error('Error fetching room availability:', error);
      }
    };

    fetchData();
  }, [viewStartDate, displayDays]);
  
  const moveCalendar = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewStartDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - displayDays);
    } else {
      newDate.setDate(newDate.getDate() + displayDays);
    }
    setViewStartDate(newDate);
  };

  const jumpToDate = (date: Date) => {
    setViewStartDate(date);
    setSelectedDate(date);
    toast({
      title: "Calendar updated",
      description: `Viewing availability from ${format(date, 'MMMM d, yyyy')}`,
    });
  };
  
  const handleViewChange = (days: number) => {
    setDisplayDays(days);
    toast({
      description: `Now displaying ${days} days in the calendar view`,
    });
  };
  
  const formatDateHeader = (date: Date) => {
    const day = date.getDate();
    const isToday = new Date().toDateString() === date.toDateString();
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    
    return (
      <div className={cn(
        "text-center p-1", 
        isToday ? "bg-primary/10 rounded-md" : "",
        date.getDay() === 0 || date.getDay() === 6 ? "bg-red-50" : ""
      )}>
        <div className="text-xs text-muted-foreground">{dayName}</div>
        <div className={cn("text-sm font-semibold", isToday ? "text-primary" : "")}>
          {day}
        </div>
        {day === 1 || date.getDate() === viewStartDate.getDate() ? (
          <div className="text-xs text-muted-foreground">{month}</div>
        ) : null}
      </div>
    );
  };

  const handleCellClick = (roomId: string, date: Date) => {
    // In a real app, this would open a booking creation form
    toast({
      title: "Create Booking",
      description: `Room ${filteredRooms.find(r => r.id === roomId)?.number} selected for ${format(date, 'MMMM d, yyyy')}`,
    });
  };
  
  const handleBookingClick = (bookingId: string) => {
    // In a real app, this would navigate to booking details
    toast({
      title: "Booking Details",
      description: `Viewing details for booking #${bookingId}`,
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Availability Calendar</h1>
          <p className="text-muted-foreground mt-1">View and manage room availability</p>
        </div>
        <Button asChild className="flex items-center gap-2">
          <Link to="/bookings/new">
            <PlusCircle className="h-4 w-4" />
            Add New Booking
          </Link>
        </Button>
      </div>
      
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Room Availability</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => moveCalendar('prev')}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-8">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(viewStartDate, 'MMM d, yyyy')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && jumpToDate(date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => moveCalendar('next')}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Select value={displayDays.toString()} onValueChange={(value) => handleViewChange(parseInt(value))}>
                <SelectTrigger className="w-[130px] h-8">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="14">14 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setViewStartDate(new Date())}
                className="h-8 w-8"
                title="Jump to today"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            View and manage room availability. Click on empty cells to create new bookings.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Input
                placeholder="Search rooms or guests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
              <Filter className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            
            <Select value={property} onValueChange={setProperty}>
              <SelectTrigger>
                <SelectValue placeholder="Property Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="Marina Tower">Marina Tower</SelectItem>
                <SelectItem value="Downtown Heights">Downtown Heights</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roomType} onValueChange={setRoomType}>
              <SelectTrigger>
                <SelectValue placeholder="Room Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Standard Room">Standard Room</SelectItem>
                <SelectItem value="Deluxe Suite">Deluxe Suite</SelectItem>
                <SelectItem value="Executive Suite">Executive Suite</SelectItem>
                <SelectItem value="Penthouse Suite">Penthouse Suite</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roomStatus} onValueChange={setRoomStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Room Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="border rounded-md overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <div style={{ 
                minWidth: `${Math.max(displayDays * 80, 1000)}px`, 
                width: '100%' 
              }}>
                <div className="grid grid-cols-[200px_1fr] border-b border-border">
                  <div className="p-3 font-medium text-sm bg-muted border-r border-border sticky left-0 z-10">Room</div>
                  <div className={`grid grid-cols-${displayDays} bg-muted`} style={{ gridTemplateColumns: `repeat(${displayDays}, 1fr)` }}>
                    {calendarDates.map((date, i) => (
                      <div key={i} className="p-2 text-center border-r border-border last:border-r-0">
                        {formatDateHeader(date)}
                      </div>
                    ))}
                  </div>
                </div>
                
                {filteredRooms.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No rooms match your filter criteria</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setProperty("all");
                        setRoomType("all");
                        setRoomStatus("all");
                        setSearchQuery("");
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                ) : (
                  filteredRooms.map((room) => (
                    <div key={room.id} className="grid grid-cols-[200px_1fr] border-b border-border last:border-b-0">
                      <div className="p-4 border-r border-border flex flex-col sticky left-0 bg-white z-10">
                        <Link to={`/rooms/view/${room.id}`} className="font-medium hover:text-primary">
                          Room {room.number}
                        </Link>
                        <span className="text-sm text-muted-foreground flex items-center justify-between">
                          {room.property}
                          <span className={cn(
                            "inline-flex items-center ml-2 rounded-full px-2 py-0.5 text-xs",
                            room.status === 'available' && "bg-green-100 text-green-800",
                            room.status === 'occupied' && "bg-blue-100 text-blue-800",
                            room.status === 'maintenance' && "bg-yellow-100 text-yellow-800"
                          )}>
                            {room.status}
                          </span>
                        </span>
                      </div>
                      <div className="relative h-[80px]">
                        {/* Grid cells for days */}
                        <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${displayDays}, 1fr)` }}>
                          {Array.from({ length: displayDays }).map((_, i) => {
                            const cellDate = new Date(viewStartDate);
                            cellDate.setDate(cellDate.getDate() + i);
                            return (
                              <div 
                                key={i} 
                                className={cn(
                                  "border-r border-border last:border-r-0 hover:bg-muted/50 cursor-pointer",
                                  cellDate.getDay() === 0 || cellDate.getDay() === 6 ? "bg-red-50/50" : "",
                                  new Date().toDateString() === cellDate.toDateString() ? "bg-primary/5" : ""
                                )}
                                onClick={() => handleCellClick(room.id, cellDate)}
                              ></div>
                            );
                          })}
                        </div>
                        
                        {/* Bookings */}
                        {room.bookings.map((booking) => {
                          const style = calculateBookingStyle(booking, viewStartDate, displayDays);
                          if (!style) return null;
                          
                          return (
                            <div 
                              key={booking.id}
                              className={cn(
                                "absolute top-[16px] h-[48px] rounded-md cursor-pointer transition-shadow hover:shadow-md flex items-center px-2",
                                booking.status === 'confirmed' && "bg-blue-100 border border-blue-300",
                                booking.status === 'checked-in' && "bg-green-100 border border-green-300",
                                booking.status === 'checked-out' && "bg-gray-100 border border-gray-300",
                                booking.status === 'cancelled' && "bg-red-100 border border-red-300"
                              )}
                              style={{ left: style.left, width: style.width }}
                              onClick={() => handleBookingClick(booking.id)}
                            >
                              <div className="truncate text-xs font-medium">
                                {booking.guestName}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium">Legend:</div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-sm">Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Checked In</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-400"></div>
              <span className="text-sm">Checked Out</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm">Cancelled</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Changes</CardTitle>
          <CardDescription>Check-ins and check-outs in the next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-blue-500" />
                Upcoming Check-ins
              </h3>
              <div className="space-y-2">
                {filteredRooms.flatMap(room => 
                  room.bookings
                    .filter(b => 
                      b.status === 'confirmed' && 
                      b.startDate >= new Date() && 
                      b.startDate <= new Date(new Date().setDate(new Date().getDate() + 7))
                    )
                    .map(booking => (
                      <div key={booking.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50">
                        <div>
                          <p className="font-medium">{booking.guestName}</p>
                          <p className="text-sm text-muted-foreground">
                            Room {room.number}, {room.property}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{format(booking.startDate, 'MMM d, yyyy')}</p>
                          <Button size="sm" variant="outline" asChild className="mt-1">
                            <Link to={`/bookings/${booking.id}`}>
                              Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))
                )}
                {!filteredRooms.some(room => 
                  room.bookings.some(b => 
                    b.status === 'confirmed' && 
                    b.startDate >= new Date() && 
                    b.startDate <= new Date(new Date().setDate(new Date().getDate() + 7))
                  )
                ) && (
                  <p className="text-muted-foreground text-center py-4">No upcoming check-ins</p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-green-500" />
                Upcoming Check-outs
              </h3>
              <div className="space-y-2">
                {filteredRooms.flatMap(room => 
                  room.bookings
                    .filter(b => 
                      b.status === 'checked-in' && 
                      b.endDate >= new Date() && 
                      b.endDate <= new Date(new Date().setDate(new Date().getDate() + 7))
                    )
                    .map(booking => (
                      <div key={booking.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50">
                        <div>
                          <p className="font-medium">{booking.guestName}</p>
                          <p className="text-sm text-muted-foreground">
                            Room {room.number}, {room.property}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{format(booking.endDate, 'MMM d, yyyy')}</p>
                          <Button size="sm" variant="outline" asChild className="mt-1">
                            <Link to={`/bookings/${booking.id}`}>
                              Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))
                )}
                {!filteredRooms.some(room => 
                  room.bookings.some(b => 
                    b.status === 'checked-in' && 
                    b.endDate >= new Date() && 
                    b.endDate <= new Date(new Date().setDate(new Date().getDate() + 7))
                  )
                ) && (
                  <p className="text-muted-foreground text-center py-4">No upcoming check-outs</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Availability;
