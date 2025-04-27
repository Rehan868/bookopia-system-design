
import React, { useEffect, useState } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { OccupancyChart } from '@/components/dashboard/OccupancyChart';
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  BedDouble, 
  CalendarCheck, 
  DollarSign, 
  Percent,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TodayCheckins } from '@/components/dashboard/TodayCheckins';
import { TodayCheckouts } from '@/components/dashboard/TodayCheckouts';
import { useOwnerRooms } from '@/hooks/useOwners';

const OwnerDashboard = () => {
  const [ownerData, setOwnerData] = useState({
    availableRooms: 0,
    totalRooms: 0,
    checkins: 0,
    checkouts: 0,
    occupancyRate: "0%",
    revenue: "$0",
  });
  
  // Get the owner ID from localStorage
  const ownerId = localStorage.getItem('ownerId');
  
  // Fetch the owner's rooms
  const { data: rooms, isLoading } = useOwnerRooms(ownerId || '');
  
  useEffect(() => {
    if (rooms) {
      const availableRooms = rooms.filter(room => room.status === 'available').length;
      
      // Calculate data based on the rooms
      setOwnerData({
        availableRooms,
        totalRooms: rooms.length,
        checkins: Math.floor(Math.random() * 3), // Mock data for now
        checkouts: Math.floor(Math.random() * 2), // Mock data for now
        occupancyRate: rooms.length > 0 ? `${Math.round(((rooms.length - availableRooms) / rooms.length) * 100)}%` : "0%",
        revenue: `$${Math.floor(Math.random() * 5000)}`  // Mock data for now
      });
    }
  }, [rooms]);
  
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Owner Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your properties and monitor performance</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <p>Loading your properties...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard 
              title="Available Rooms" 
              value={ownerData.availableRooms.toString()} 
              icon={BedDouble}
              trend="up"
              trendValue="+1 from yesterday"
              className="animate-slide-up"
              description={`Out of ${ownerData.totalRooms} total rooms`}
            />
            <StatCard 
              title="Today's Check-ins" 
              value={ownerData.checkins.toString()} 
              icon={ArrowDownToLine}
              className="animate-slide-up [animation-delay:100ms]"
              description="Arriving today"
            />
            <StatCard 
              title="Today's Check-outs" 
              value={ownerData.checkouts.toString()} 
              icon={ArrowUpFromLine}
              className="animate-slide-up [animation-delay:200ms]"
              description="Scheduled before noon"
            />
            <StatCard 
              title="Occupancy Rate" 
              value={ownerData.occupancyRate} 
              icon={Percent}
              trend="up"
              trendValue="+5% from last week"
              className="animate-slide-up [animation-delay:300ms]"
            />
            <StatCard 
              title="Monthly Revenue" 
              value={ownerData.revenue} 
              icon={DollarSign}
              trend="up"
              trendValue="+$420 from last month"
              className="animate-slide-up [animation-delay:400ms]"
            />
            <div className="flex flex-col gap-2 p-6 border rounded-lg shadow-sm bg-card animate-slide-up [animation-delay:500ms]">
              <h3 className="font-semibold text-lg">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button variant="outline" asChild className="h-auto py-2 justify-start">
                  <Link to="/owner/bookings">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Bookings
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-auto py-2 justify-start">
                  <Link to="/owner/availability">
                    <CalendarCheck className="h-4 w-4 mr-2" />
                    Check Availability
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-auto py-2 justify-start">
                  <Link to="/owner/cleaning">
                    <CalendarCheck className="h-4 w-4 mr-2" />
                    Cleaning Status
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-auto py-2 justify-start">
                  <Link to="/owner/reports">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Reports
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <OccupancyChart />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <TodayCheckins />
              <TodayCheckouts />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OwnerDashboard;
