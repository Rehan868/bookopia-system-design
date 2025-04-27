
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CalendarClock, Edit, Home, Loader, Settings, UserCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useRoom } from '@/hooks/useRooms';
import { format } from 'date-fns';

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch (e) {
    return dateString;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'available':
      return <Badge className="bg-green-100 text-green-800">Available</Badge>;
    case 'occupied':
      return <Badge className="bg-blue-100 text-blue-800">Occupied</Badge>;
    case 'maintenance':
      return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
  }
}

interface RoomDetailsProps {
  roomId: string;
}

export function RoomDetails({ roomId }: RoomDetailsProps) {
  const navigate = useNavigate();
  const { data: room, isLoading, error } = useRoom(roomId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading room details...</span>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-red-500">Failed to load room details</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/rooms')}
        >
          Back to Rooms
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/rooms">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Room {room.number}</h1>
              {getStatusBadge(room.status)}
            </div>
            <p className="text-muted-foreground mt-1">{room.type} • Floor {room.floor}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/rooms/edit/${room.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Room
            </Link>
          </Button>
          <Button asChild>
            <Link to="/bookings/new">Create Booking</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Room Details</CardTitle>
              <CardDescription>
                Information about Room {room.number}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{room.description || 'No description available'}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities && room.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline" className="bg-primary/5">
                        {amenity}
                      </Badge>
                    ))}
                    {(!room.amenities || room.amenities.length === 0) && (
                      <p className="text-muted-foreground">No amenities listed</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Base Price</p>
                    <p className="font-medium">${room.rate} / night</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Max Occupancy</p>
                    <p className="font-medium">{room.capacity} Guests</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Floor</p>
                    <p className="font-medium">{room.floor}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{formatDate(room.updated_at)}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Current Status</h3>
                  {room.status === 'occupied' ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <div className="flex items-start gap-3">
                        <UserCheck className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Currently Occupied</p>
                          <p className="text-sm text-muted-foreground">
                            This room is currently booked and occupied.
                          </p>
                          <Button size="sm" variant="outline" className="mt-2" asChild>
                            <Link to={`/bookings`}>
                              View Bookings
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : room.status === 'maintenance' ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                      <div className="flex items-start gap-3">
                        <Settings className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Under Maintenance</p>
                          <p className="text-sm text-muted-foreground">
                            This room is currently unavailable due to maintenance work.
                          </p>
                          <Button size="sm" variant="outline" className="mt-2">
                            Update Status
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                      <div className="flex items-start gap-3">
                        <Home className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Available for Booking</p>
                          <p className="text-sm text-muted-foreground">
                            This room is currently available and can be booked.
                          </p>
                          <Button size="sm" className="mt-2" asChild>
                            <Link to="/bookings/new">
                              Create Booking
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for this room</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" size="lg">
                <Loader className="h-4 w-4 mr-2" />
                Update Cleaning Status
              </Button>
              <Button className="w-full justify-start" size="lg">
                <CalendarClock className="h-4 w-4 mr-2" />
                Check Availability
              </Button>
              <Button className="w-full justify-start" variant="outline" size="lg" asChild>
                <Link to={`/rooms/edit/${room.id}`}>
                  <Settings className="h-4 w-4 mr-2" />
                  Update Room Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking History & Analytics</CardTitle>
        </CardHeader>
        <Tabs defaultValue="history">
          <div className="px-6">
            <TabsList className="mb-4">
              <TabsTrigger value="history">Booking History</TabsTrigger>
              <TabsTrigger value="occupancy">Occupancy Rate</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>
          </div>
          <CardContent>
            <TabsContent value="history" className="mt-0">
              <div className="rounded-lg overflow-hidden border border-border">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left font-medium px-6 py-3">Guest</th>
                      <th className="text-left font-medium px-6 py-3">Check In</th>
                      <th className="text-left font-medium px-6 py-3">Check Out</th>
                      <th className="text-left font-medium px-6 py-3">Status</th>
                      <th className="text-left font-medium px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                        Booking history data is loading or not available
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="occupancy" className="mt-0">
              <div className="h-80 flex items-center justify-center border rounded-md bg-muted/20">
                <p className="text-muted-foreground">Occupancy rate chart will be displayed here</p>
              </div>
            </TabsContent>
            <TabsContent value="revenue" className="mt-0">
              <div className="h-80 flex items-center justify-center border rounded-md bg-muted/20">
                <p className="text-muted-foreground">Revenue analytics will be displayed here</p>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
