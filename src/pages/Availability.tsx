
import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { CalendarIcon, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useRoomAvailability } from '@/hooks/useAvailability';
import { Link } from 'react-router-dom';

const Availability = () => {
  const today = new Date();
  const [startDate, setStartDate] = useState<Date>(today);
  const [endDate, setEndDate] = useState<Date>(addDays(today, 7));
  const [dateRange, setDateRange] = useState({
    from: startDate,
    to: endDate,
  });
  
  const { data: availabilityData, isLoading } = useRoomAvailability(dateRange.from, dateRange.to);
  
  const handleDateRangeChange = (range: {from: Date, to?: Date}) => {
    if (range.from) {
      setStartDate(range.from);
      setDateRange({
        from: range.from,
        to: range.to || addDays(range.from, 7)
      });
      if (range.to) {
        setEndDate(range.to);
      }
    }
  };
  
  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Room Availability</h1>
          <p className="text-muted-foreground mt-1">Check room availability for a specific date range</p>
        </div>
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
        />
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-48 animate-pulse bg-muted"></Card>
          ))}
        </div>
      ) : availabilityData && availabilityData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availabilityData.map((room) => (
            <Link to={`/rooms/${room.id}`} key={room.id}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold">{room.property}</h3>
                      <h4 className="text-lg font-medium">Room {room.number}</h4>
                      <p className="text-sm text-muted-foreground">{room.type}</p>
                    </div>
                    <div className={cn(
                      "px-2 py-1 text-xs font-semibold rounded-full",
                      room.bookedDates.length === 0 
                        ? "bg-green-100 text-green-800" 
                        : room.bookedDates.length === 7 
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    )}>
                      {room.bookedDates.length === 0 ? "Available" : room.bookedDates.length === 7 ? "Booked" : "Partially Available"}
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-4">
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      {room.bookedDates.map((date, i) => {
                        const index = (new Date(date).getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
                        return (
                          <div 
                            key={i}
                            className="h-full bg-red-500"
                            style={{ 
                              width: `${100/7}%`,
                              marginLeft: `${(index * 100)/7}%`
                            }}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{format(startDate, 'MMM dd')}</span>
                    <span>{format(endDate, 'MMM dd')}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{7 - room.bookedDates.length} days available</span>
                    </div>
                    <div className="font-semibold">${room.rate}/night</div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center p-10">
          <p className="text-muted-foreground">No rooms found or error loading data.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </div>
      )}
    </div>
  );
};

export default Availability;
