
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Booking } from '@/services/supabase-types';

export interface BookingDetailsProps {
  booking: Booking;
}

export const BookingDetails: React.FC<BookingDetailsProps> = ({ booking }) => {
  const { toast } = useToast();
  
  if (!booking) {
    return <div>No booking details available</div>;
  }

  const handleStatusChange = (newStatus: string) => {
    toast({
      title: 'Status Updated',
      description: `Booking status changed to ${newStatus}`,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Booking #{booking.booking_number}
          </h1>
          <p className="text-gray-600">
            Created on {format(new Date(booking.created_at), 'PPP')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
          <Button 
            variant="outline" 
            onClick={() => handleStatusChange('checked-in')}
          >
            Check In
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleStatusChange('checked-out')}
          >
            Check Out
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => handleStatusChange('cancelled')}
          >
            Cancel Booking
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-primary/10 p-4">
            <h2 className="font-semibold text-lg">Guest Information</h2>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{booking.guest_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{booking.guest_email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{booking.guest_phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Guests</p>
              <p className="font-medium">{booking.adults} Adults, {booking.children} Children</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-primary/10 p-4">
            <h2 className="font-semibold text-lg">Booking Details</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-600">Check In</p>
                <p className="font-medium">{format(new Date(booking.check_in), 'PPP')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Check Out</p>
                <p className="font-medium">{format(new Date(booking.check_out), 'PPP')}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Property</p>
              <p className="font-medium">{booking.property}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Room</p>
              <p className="font-medium">{booking.room_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <div className="mt-1">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  {booking.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-primary/10 p-4">
            <h2 className="font-semibold text-lg">Payment Information</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Base Rate</p>
              <p className="font-medium">${booking.base_rate}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">VAT</p>
              <p className="font-medium">${booking.vat || 0}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Tourism Fee</p>
              <p className="font-medium">${booking.tourism_fee || 0}</p>
            </div>
            <div className="flex justify-between border-t pt-2">
              <p className="font-semibold">Total Amount</p>
              <p className="font-semibold">${booking.amount}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Paid</p>
              <p className="font-medium text-green-600">${booking.amount_paid || 0}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Balance</p>
              <p className="font-medium text-red-600">${booking.remaining_amount || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Status</p>
              <div className="mt-1">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  {booking.payment_status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {booking.notes && (
        <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-primary/10 p-4">
            <h2 className="font-semibold text-lg">Notes</h2>
          </div>
          <div className="p-4">
            <p>{booking.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};
