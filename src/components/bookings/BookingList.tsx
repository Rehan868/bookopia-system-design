import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarClock, DoorOpen, Edit, MoreHorizontal, User, Loader } from 'lucide-react';
import { ViewToggle } from '@/components/ui/ViewToggle';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { useBookings } from '@/hooks/useBookings';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { CreditCard, Trash2, FileText } from 'lucide-react';

function formatDate(dateString: string) {
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch (e) {
    return dateString;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'confirmed':
      return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
    case 'checked-in':
      return <Badge className="bg-blue-100 text-blue-800">Checked In</Badge>;
    case 'checked-out':
      return <Badge className="bg-purple-100 text-purple-800">Checked Out</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
  }
}

interface BookingListProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  searchQuery?: string;
  filterValue?: string;
  dateRange?: DateRange;
}

export function BookingList({ 
  view, 
  onViewChange,
  searchQuery = '',
  filterValue = 'all',
  dateRange
}: BookingListProps) {
  const { data: bookings, isLoading, error } = useBookings();
  const { toast } = useToast();

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    
    return bookings.filter(booking => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery || 
        booking.guest_name.toLowerCase().includes(searchLower) ||
        booking.booking_number.toLowerCase().includes(searchLower) ||
        (booking.rooms as any)?.number?.toLowerCase().includes(searchLower) ||
        (booking.rooms as any)?.property?.toLowerCase().includes(searchLower);
      
      const matchesStatus = filterValue === 'all' || booking.status === filterValue;
      
      let matchesDate = true;
      if (dateRange?.from) {
        const bookingCheckIn = new Date(booking.check_in);
        const bookingCheckOut = new Date(booking.check_out);
        const filterFrom = dateRange.from;
        const filterTo = dateRange.to || dateRange.from;

        matchesDate = 
          (bookingCheckIn <= filterTo && 
          (dateRange.to ? bookingCheckOut >= filterFrom : true));
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, searchQuery, filterValue, dateRange]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading bookings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500">Failed to load bookings data</p>
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Bookings</h2>
        <div className="flex gap-4">
          <ViewToggle view={view} setView={onViewChange} />
        </div>
      </div>
      
      {view === 'list' ? (
        <div className="rounded-lg overflow-hidden border border-border">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left font-medium px-6 py-3">Guest</th>
                <th className="text-left font-medium px-6 py-3">Room</th>
                <th className="text-left font-medium px-6 py-3">Check In</th>
                <th className="text-left font-medium px-6 py-3">Check Out</th>
                <th className="text-left font-medium px-6 py-3">Status</th>
                <th className="text-left font-medium px-6 py-3">Total Amount</th>
                <th className="text-left font-medium px-6 py-3">Amount Paid</th>
                <th className="text-left font-medium px-6 py-3">Remaining</th>
                <th className="text-left font-medium px-6 py-3">Created By</th>
                <th className="text-left font-medium px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBookings.map((booking) => {
                const room = booking.rooms as any;
                const remainingAmount = booking.amount - (booking.amountPaid || 0);
                return (
                  <tr key={booking.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium">{booking.guest_name}</div>
                      <div className="text-sm text-muted-foreground">{booking.booking_number}</div>
                    </td>
                    <td className="px-6 py-4">
                      {room?.number || 'Unknown'}, {room?.property || 'Unknown'}
                    </td>
                    <td className="px-6 py-4">{formatDate(booking.check_in)}</td>
                    <td className="px-6 py-4">{formatDate(booking.check_out)}</td>
                    <td className="px-6 py-4">{getStatusBadge(booking.status)}</td>
                    <td className="px-6 py-4">${booking.amount}</td>
                    <td className="px-6 py-4">${booking.amountPaid || 0}</td>
                    <td className="px-6 py-4 text-muted-foreground">${remainingAmount}</td>
                    <td className="px-6 py-4 text-muted-foreground">{booking.created_by || 'System'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost" asChild>
                          <Link to={`/bookings/${booking.id}`}>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/bookings/${booking.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/bookings/edit/${booking.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CreditCard className="h-4 w-4 mr-2" />
                              Update Payment
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                            {booking.status === 'checked-in' && (
                              <DropdownMenuItem>
                                Check Out
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {(!filteredBookings || filteredBookings.length === 0) && (
                <tr>
                  <td colSpan={11} className="px-6 py-8 text-center text-muted-foreground">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => {
            const room = booking.rooms as any;
            const remainingAmount = booking.amount - (booking.amountPaid || 0);
            return (
              <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.guest_name}</p>
                          <p className="text-sm text-muted-foreground">{booking.booking_number}</p>
                        </div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                    
                    <div className="border-t pt-4 mt-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-muted rounded-md">
                          <DoorOpen className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">ROOM</p>
                          <p className="text-sm">{room?.number || 'Unknown'}, {room?.property || 'Unknown'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-muted rounded-md">
                          <CalendarClock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">DATES</p>
                          <p className="text-sm">{formatDate(booking.check_in)} - {formatDate(booking.check_out)}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total Amount:</span>
                          <span className="font-medium">${booking.amount}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Amount Paid:</span>
                          <span className="font-medium">${booking.amountPaid || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Remaining:</span>
                          <span className="font-medium">${remainingAmount}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Created By:</span>
                          <span className="font-medium">{booking.created_by || 'System'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 border-t pt-4">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/bookings/edit/${booking.id}`}>
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link to={`/bookings/${booking.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
          {(!filteredBookings || filteredBookings.length === 0) && (
            <div className="col-span-full text-center py-10 border rounded-md bg-muted/10">
              <p className="text-muted-foreground">No bookings found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
