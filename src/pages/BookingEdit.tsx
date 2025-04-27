
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AddEditBookingForm } from '@/components/bookings/AddEditBookingForm';
import { useBooking } from '@/hooks/useBookings';
import { Loader } from 'lucide-react';

const BookingEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [formattedBookingData, setFormattedBookingData] = useState<any>(null);
  
  // Use the useBooking hook to fetch real data
  const { data: bookingData, isLoading, error } = useBooking(id || '');
  
  useEffect(() => {
    if (bookingData) {
      // Format the booking data to match the expected structure for the form
      // Ensure all numeric fields are actually numbers
      setFormattedBookingData({
        reference: bookingData.booking_number || '',
        guestName: bookingData.guest_name || '',
        guestEmail: bookingData.guestEmail || '',
        guestPhone: bookingData.guestPhone || '',
        property: bookingData.rooms?.property || '',
        roomNumber: bookingData.rooms?.number || '',
        checkIn: new Date(bookingData.check_in),
        checkOut: new Date(bookingData.check_out),
        adults: Number(bookingData.adults || 2),
        children: Number(bookingData.children || 0),
        baseRate: Number(bookingData.baseRate || 150),
        totalAmount: Number(bookingData.amount || 450),
        securityDeposit: Number(bookingData.securityDeposit || 0),
        commission: Number(bookingData.commission || 0),
        tourismFee: Number(bookingData.tourismFee || 0),
        vat: Number(bookingData.vat || 0),
        netToOwner: Number(bookingData.netToOwner || 0),
        notes: bookingData.special_requests || '',
        status: bookingData.status || 'confirmed',
        paymentStatus: bookingData.payment_status || 'paid',
        sendConfirmation: true,
      });
    } else if (!isLoading) {
      // Fallback mock data if real data couldn't be fetched
      setFormattedBookingData({
        reference: 'BK-2023-0012',
        guestName: 'John Smith',
        guestEmail: 'john.smith@example.com',
        guestPhone: '+1 (555) 123-4567',
        property: 'Marina Tower',
        roomNumber: '101',
        checkIn: new Date('2023-11-18'),
        checkOut: new Date('2023-11-21'),
        adults: 2,
        children: 0,
        baseRate: 150,
        totalAmount: 450,
        securityDeposit: 0,
        commission: 45,
        tourismFee: 13.5,
        vat: 22.5,
        netToOwner: 369,
        notes: 'Guest requested a high floor with ocean view. Prefers quiet room away from elevator.',
        status: 'confirmed',
        paymentStatus: 'paid',
        sendConfirmation: true,
      });
    }
  }, [bookingData, isLoading]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading booking data...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error loading booking: {error.message}</p>
      </div>
    );
  }
  
  // Only render the form when we have the formatted data
  return formattedBookingData ? (
    <AddEditBookingForm mode="edit" bookingData={formattedBookingData} />
  ) : null;
};

export default BookingEdit;
