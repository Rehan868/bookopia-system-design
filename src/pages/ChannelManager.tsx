
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, ArrowUpDown, CheckCircle, XCircle, AlertTriangle, Plus, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ChannelManager = () => {
  // Sample data for connected channels
  const channels = [
    { id: 1, name: 'Booking.com', status: 'Connected', lastSync: '2023-11-15 14:30', roomsListed: 12, active: true },
    { id: 2, name: 'Airbnb', status: 'Connected', lastSync: '2023-11-15 13:45', roomsListed: 8, active: true },
    { id: 3, name: 'Expedia', status: 'Error', lastSync: '2023-11-14 10:20', roomsListed: 10, active: true },
    { id: 4, name: 'VRBO', status: 'Pending', lastSync: 'Never', roomsListed: 0, active: false },
  ];

  // Sample data for recent events
  const syncEvents = [
    { id: 1, channel: 'Booking.com', type: 'Booking Created', status: 'Success', timestamp: '2023-11-15 14:35', details: 'Booking #BK12345 for Room 301' },
    { id: 2, channel: 'Airbnb', type: 'Price Update', status: 'Success', timestamp: '2023-11-15 13:50', details: 'Updated rates for 3 rooms' },
    { id: 3, channel: 'Expedia', type: 'Availability Update', status: 'Failed', timestamp: '2023-11-14 10:25', details: 'Failed to update Room 201 availability' },
    { id: 4, channel: 'Booking.com', type: 'Booking Cancelled', status: 'Success', timestamp: '2023-11-14 09:15', details: 'Booking #BK12340 cancelled' },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'Error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEventStatusIcon = (status: string) => {
    switch(status) {
      case 'Success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'Warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Channel Manager</h1>
          <p className="text-muted-foreground mt-1">Manage your connections to online travel agencies</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync All Channels
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Connect New Channel
          </Button>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Channel Connections</CardTitle>
          <CardDescription>Manage your connections to online booking platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Synced</TableHead>
                <TableHead>Rooms Listed</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channels.map((channel) => (
                <TableRow key={channel.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Network className="h-5 w-5 text-primary" />
                      {channel.name}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(channel.status)}</TableCell>
                  <TableCell>{channel.lastSync}</TableCell>
                  <TableCell>{channel.roomsListed}</TableCell>
                  <TableCell>
                    <Switch checked={channel.active} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Sync
                      </Button>
                      <Button size="sm" variant="outline">Configure</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="sync" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sync">Sync History</TabsTrigger>
          <TabsTrigger value="rooms">Room Mappings</TabsTrigger>
          <TabsTrigger value="rates">Rate Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sync">
          <Card>
            <CardHeader>
              <CardTitle>Recent Synchronization Events</CardTitle>
              <CardDescription>Latest updates between your system and connected channels</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syncEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        {getEventStatusIcon(event.status)}
                      </TableCell>
                      <TableCell className="font-medium">{event.channel}</TableCell>
                      <TableCell>{event.type}</TableCell>
                      <TableCell>{event.timestamp}</TableCell>
                      <TableCell className="max-w-xs truncate">{event.details}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline">View All Events</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="rooms">
          <Card>
            <CardHeader>
              <CardTitle>Room Mappings</CardTitle>
              <CardDescription>How your rooms are mapped to each channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4 bg-amber-50 text-amber-800 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Some rooms are not mapped</h4>
                    <p className="text-sm">
                      4 rooms haven't been mapped to all channels. Consider mapping them to increase visibility.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between p-4 border rounded-md">
                  <div>
                    <p className="font-medium">Room 101 - Marina Tower</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="bg-green-100 text-green-800">Booking.com</Badge>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Airbnb</Badge>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Expedia</Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Edit Mappings</Button>
                </div>
                
                <div className="flex justify-between p-4 border rounded-md">
                  <div>
                    <p className="font-medium">Room 102 - Marina Tower</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="bg-green-100 text-green-800">Booking.com</Badge>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Airbnb</Badge>
                      <Badge variant="outline" className="bg-red-100 text-red-800">Not on Expedia</Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Edit Mappings</Button>
                </div>
                
                <div className="flex justify-between p-4 border rounded-md">
                  <div>
                    <p className="font-medium">Room 201 - Downtown Heights</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="bg-green-100 text-green-800">Booking.com</Badge>
                      <Badge variant="outline" className="bg-red-100 text-red-800">Not on Airbnb</Badge>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Expedia</Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Edit Mappings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rates">
          <Card>
            <CardHeader>
              <CardTitle>Rate Plan Management</CardTitle>
              <CardDescription>Manage your pricing across different channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-6">
                <Button variant="outline" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Rate Plan
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Bulk Update
                </Button>
              </div>
              
              <Separator className="mb-6" />
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Standard Rate</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">Booking.com</div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Base Rate: $120 per night</p>
                      <p className="text-sm text-muted-foreground">Commission: 15%</p>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">Airbnb</div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Base Rate: $125 per night</p>
                      <p className="text-sm text-muted-foreground">Commission: 3%</p>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">Expedia</div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Base Rate: $130 per night</p>
                      <p className="text-sm text-muted-foreground">Commission: 18%</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-3">Non-Refundable Rate</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">Booking.com</div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Base Rate: $100 per night</p>
                      <p className="text-sm text-muted-foreground">Commission: 15%</p>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">Airbnb</div>
                        <Badge variant="outline" className="bg-red-100 text-red-800">Inactive</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Base Rate: $105 per night</p>
                      <p className="text-sm text-muted-foreground">Commission: 3%</p>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">Expedia</div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Base Rate: $110 per night</p>
                      <p className="text-sm text-muted-foreground">Commission: 18%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChannelManager;
