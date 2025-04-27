
import React from 'react';
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

// This would be a custom hook in a real application
const useOwnerData = () => {
  // In a real app, this would fetch data specific to the logged-in owner
  // For now, we'll use mock data
  const ownerId = localStorage.getItem('ownerId');
  
  return {
    availableRooms: 5,
    totalRooms: 8,
    checkins: 2,
    checkouts: 1,
    occupancyRate: "62%",
    revenue: "$3,240",
  };
};

const OwnerDashboard = () => {
  const ownerData = useOwnerData();
  
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Owner Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your properties and monitor performance</p>
      </div>
      
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
          description="Both are arriving in the morning"
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
    </div>
  );
};

export default OwnerDashboard;
