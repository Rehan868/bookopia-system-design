
import React from 'react';
import { useParams } from 'react-router-dom';
import { useBooking } from '@/hooks/useBookings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export interface BookingDetailsProps {
  booking?: any; // Optional prop for the parent component to pass data directly
}

export const BookingDetails: React.FC<BookingDetailsProps> = ({ booking: propBooking }) => {
  const { id } = useParams<{ id: string }>();
  const { data: fetchedBooking, isLoading, error } = useBooking(id || '');
  
  // Use either the prop booking or the fetched booking
  const booking = propBooking || fetchedBooking;
  
  if (!booking) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Booking #{booking?.booking_number}</h1>
          <p className="text-muted-foreground">{booking?.guest_name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={
            booking?.status === 'confirmed' ? 'default' :
            booking?.status === 'pending' ? 'secondary' :
            booking?.status === 'cancelled' ? 'destructive' : 
            'outline'
          }>
            {booking?.status}
          </Badge>
          
          <Button variant="outline" size="sm">Edit</Button>
          <Button size="sm">Check In</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Guest Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{booking?.guest_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{booking?.guest_email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{booking?.guest_phone || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Guests</p>
              <p className="font-medium">{booking?.adults} Adults, {booking?.children} Children</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Room</p>
              <p className="font-medium">{booking?.room_number}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Property</p>
              <p className="font-medium">{booking?.property}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Check-in</p>
              <p className="font-medium">{new Date(booking?.check_in).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Check-out</p>
              <p className="font-medium">{new Date(booking?.check_out).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Base Rate</span>
            <span>${booking?.base_rate?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>VAT</span>
            <span>${booking?.vat?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between">
            <span>Tourism Fee</span>
            <span>${booking?.tourism_fee?.toFixed(2) || '0.00'}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${booking?.amount?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Paid Amount</span>
            <span>${booking?.amount_paid?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between text-amber-600">
            <span>Remaining Amount</span>
            <span>${booking?.remaining_amount?.toFixed(2) || '0.00'}</span>
          </div>
        </CardContent>
      </Card>

      {booking?.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{booking?.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
