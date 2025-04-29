
import React from 'react';
import { useParams } from 'react-router-dom';
import { BookingDetails } from '@/components/bookings/BookingDetails';
import { useBooking } from '@/hooks/useBookings';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BookingView = () => {
  const { id } = useParams<{ id: string }>();
  const { data: booking, isLoading, error } = useBooking(id || '');
  
  if (!id) {
    return <div className="p-6">No booking ID provided</div>;
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading booking details...</span>
      </div>
    );
  }
  
  if (error || !booking) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-red-500">Failed to load booking details</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return <BookingDetails />;
};

export default BookingView;
