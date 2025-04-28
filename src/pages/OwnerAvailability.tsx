
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

const OwnerAvailability = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // In a real app, this would be fetched from the backend
  const getRoomStatus = (date: Date): Record<string, string> => {
    // Mock data - would come from API based on selected date
    return {
      '101': 'booked',
      '102': 'available',
      '103': 'available',
      '104': 'booked',
      '201': 'maintenance',
      '202': 'available',
      '203': 'booked',
    };
  };
  
  // Get status for the selected date
  const roomStatus = date ? getRoomStatus(date) : {};
  
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
              className="rounded-md border"
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
              {Object.entries(roomStatus).map(([roomNumber, status]) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OwnerAvailability;
