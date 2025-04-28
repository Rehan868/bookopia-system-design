
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { TodayCheckins } from '@/components/dashboard/TodayCheckins';
import { TodayCheckouts } from '@/components/dashboard/TodayCheckouts';
import { OccupancyChart } from '@/components/dashboard/OccupancyChart';
import { ActivitySection } from '@/components/dashboard/ActivitySection';
import { RecentBookings } from '@/components/dashboard/RecentBookings';
import { QuickButtons } from '@/components/dashboard/QuickButtons';
import { PlusCircle } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to your property management dashboard</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={() => navigate('/bookings/add')} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Occupancy Rate" 
          value={`${stats?.occupancyRate || 0}%`} 
          trend={stats?.weeklyOccupancyTrend || "+0%"}
          icon="users"
          loading={isLoading}
        />
        <StatCard 
          title="Available Rooms" 
          value={stats?.availableRooms?.toString() || "0"} 
          total={stats?.totalRooms?.toString() || "0"}
          icon="home"
          loading={isLoading}
        />
        <StatCard 
          title="Check-ins Today" 
          value={stats?.todayCheckIns?.toString() || "0"}
          icon="login"
          loading={isLoading}
        />
        <StatCard 
          title="Check-outs Today" 
          value={stats?.todayCheckOuts?.toString() || "0"}
          icon="logout"
          loading={isLoading}
        />
      </div>
      
      {/* Chart and Today's Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Occupancy & Revenue</CardTitle>
            <CardDescription>Monthly occupancy rates and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <OccupancyChart />
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <TodayCheckins />
          <TodayCheckouts />
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest booking activity</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentBookings />
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <QuickButtons />
          <ActivitySection />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
