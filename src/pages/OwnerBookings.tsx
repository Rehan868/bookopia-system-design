
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for bookings - in a real app this would come from an API call specific to the owner
const bookings = [
  {
    id: '1',
    guest_name: 'John Smith',
    room_number: '101',
    property: 'Beachfront Villa',
    check_in: '2025-04-10T14:00:00',
    check_out: '2025-04-15T10:00:00',
    status: 'confirmed',
    amount: 1250.00,
  },
  {
    id: '2',
    guest_name: 'Emma Johnson',
    room_number: '205',
    property: 'Mountain View Lodge',
    check_in: '2025-04-12T15:00:00',
    check_out: '2025-04-14T11:00:00',
    status: 'confirmed',
    amount: 450.00,
  },
  {
    id: '3',
    guest_name: 'Michael Brown',
    room_number: '103',
    property: 'Beachfront Villa',
    check_in: '2025-04-20T14:00:00',
    check_out: '2025-04-25T10:00:00',
    status: 'pending',
    amount: 1350.00,
  },
  {
    id: '4',
    guest_name: 'Sarah Davis',
    room_number: '302',
    property: 'Downtown Heights',
    check_in: '2025-05-01T15:00:00',
    check_out: '2025-05-03T11:00:00',
    status: 'confirmed',
    amount: 390.00,
  },
  {
    id: '5',
    guest_name: 'Robert Wilson',
    room_number: '104',
    property: 'Beachfront Villa',
    check_in: '2025-05-10T14:00:00',
    check_out: '2025-05-15T10:00:00',
    status: 'cancelled',
    amount: 1250.00,
  },
];

const statusColors = {
  confirmed: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  checked_in: "bg-blue-100 text-blue-800 border-blue-200",
  checked_out: "bg-gray-100 text-gray-800 border-gray-200",
};

const OwnerBookings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="text-muted-foreground mt-1">Manage reservations for your properties</p>
      </div>
      
      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.guest_name}</TableCell>
                <TableCell>{booking.property}</TableCell>
                <TableCell>{booking.room_number}</TableCell>
                <TableCell>{format(new Date(booking.check_in), 'MMM d, yyyy')}</TableCell>
                <TableCell>{format(new Date(booking.check_out), 'MMM d, yyyy')}</TableCell>
                <TableCell>${booking.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={statusColors[booking.status as keyof typeof statusColors]}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link to={`/owner/bookings/${booking.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OwnerBookings;
