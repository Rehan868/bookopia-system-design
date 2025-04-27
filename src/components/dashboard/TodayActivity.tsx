
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowRightCircle, CalendarClock, DoorOpen, LogOut, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface ActivityItem {
  id: string;
  guestName: string;
  roomNumber: string;
  property: string;
  time: string;
  status: 'pending' | 'completed' | 'late';
}

// Mock data - would come from API in real app
const checkIns: ActivityItem[] = [
  {
    id: 'ci-1',
    guestName: 'John Smith',
    roomNumber: '101',
    property: 'Marina Tower',
    time: '14:00',
    status: 'pending'
  },
  {
    id: 'ci-2',
    guestName: 'Emma Johnson',
    roomNumber: '302',
    property: 'Downtown Heights',
    time: '15:30',
    status: 'pending'
  },
  {
    id: 'ci-3',
    guestName: 'Michael Chen',
    roomNumber: '205',
    property: 'Marina Tower',
    time: '12:00',
    status: 'late'
  },
  {
    id: 'ci-4',
    guestName: 'Sarah Davis',
    roomNumber: '404',
    property: 'Downtown Heights',
    time: '16:00',
    status: 'pending'
  }
];

const checkOuts: ActivityItem[] = [
  {
    id: 'co-1',
    guestName: 'Robert Wilson',
    roomNumber: '203',
    property: 'Marina Tower',
    time: '11:00',
    status: 'completed'
  },
  {
    id: 'co-2',
    guestName: 'Lisa Wong',
    roomNumber: '301',
    property: 'Downtown Heights',
    time: '10:00',
    status: 'late'
  },
  {
    id: 'co-3',
    guestName: 'David Brown',
    roomNumber: '102',
    property: 'Marina Tower',
    time: '12:00',
    status: 'pending'
  }
];

const getStatusBadge = (status: string) => {
  switch(status) {
    case 'pending':
      return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
    case 'completed':
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    case 'late':
      return <Badge className="bg-red-100 text-red-800">Late</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
  }
};

export function TodayActivity() {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle>Today's Activity</CardTitle>
        <CardDescription>Check-ins and check-outs for today</CardDescription>
      </CardHeader>
      <Tabs defaultValue="checkins" className="w-full">
        <div className="px-6">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="checkins" className="flex-1">
              <DoorOpen className="h-4 w-4 mr-2" />
              Check-ins ({checkIns.length})
            </TabsTrigger>
            <TabsTrigger value="checkouts" className="flex-1">
              <LogOut className="h-4 w-4 mr-2" />
              Check-outs ({checkOuts.length})
            </TabsTrigger>
          </TabsList>
        </div>
        <CardContent className="p-0">
          <TabsContent value="checkins" className="mt-0">
            <div className="space-y-0 divide-y divide-border">
              {checkIns.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{item.guestName}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Room {item.roomNumber}, {item.property}</span>
                        <span>•</span>
                        <div className="flex items-center">
                          <CalendarClock className="h-3.5 w-3.5 mr-1" />
                          <span>{item.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(item.status)}
                    <Button size="sm" asChild>
                      <Link to={`/bookings/${item.id}`}>
                        <ArrowRightCircle className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="checkouts" className="mt-0">
            <div className="space-y-0 divide-y divide-border">
              {checkOuts.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{item.guestName}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Room {item.roomNumber}, {item.property}</span>
                        <span>•</span>
                        <div className="flex items-center">
                          <CalendarClock className="h-3.5 w-3.5 mr-1" />
                          <span>{item.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(item.status)}
                    <Button size="sm" asChild>
                      <Link to={`/bookings/${item.id}`}>
                        <ArrowRightCircle className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
