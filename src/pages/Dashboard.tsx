
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import StatCard from '@/components/dashboard/StatCard';
import { Building, CalendarCheck, CalendarX, Percent, ArrowRight, Users, CreditCard } from 'lucide-react';
import TodayCheckins from '@/components/dashboard/TodayCheckins';
import TodayCheckouts from '@/components/dashboard/TodayCheckouts';
import OccupancyChart from '@/components/dashboard/OccupancyChart';
import ActivitySection from '@/components/dashboard/ActivitySection';
import RecentBookings from '@/components/dashboard/RecentBookings';
import QuickButtons from '@/components/dashboard/QuickButtons';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useOccupancyData } from '@/hooks/useOccupancyData';

const Dashboard = () => {
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();
  const { data: occupancyData, isLoading: occupancyLoading } = useOccupancyData();
  
  const formattedOccupancyData = occupancyData ? occupancyData.map(item => ({
    day: item.month,
    occupancy: item.occupancy
  })) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back to your property management dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Available Rooms"
          value={statsLoading ? "Loading..." : `${dashboardStats?.availableRooms || 0}`}
          description={statsLoading ? "" : `out of ${dashboardStats?.totalRooms || 0} total rooms`}
          icon={<Building className="h-4 w-4 text-blue-600" />}
          trend={null}
          trendDescription=""
          loading={statsLoading}
        />

        <StatCard
          title="Today's Check-ins"
          value={statsLoading ? "Loading..." : `${dashboardStats?.todayCheckIns || 0}`}
          description="Expected arrivals"
          icon={<CalendarCheck className="h-4 w-4 text-green-600" />}
          trend={null}
          trendDescription=""
          loading={statsLoading}
        />

        <StatCard
          title="Today's Check-outs"
          value={statsLoading ? "Loading..." : `${dashboardStats?.todayCheckOuts || 0}`}
          description="Expected departures"
          icon={<CalendarX className="h-4 w-4 text-orange-600" />}
          trend={null}
          trendDescription=""
          loading={statsLoading}
        />

        <StatCard
          title="Occupancy Rate"
          value={statsLoading ? "Loading..." : `${dashboardStats?.occupancyRate || 0}%`}
          description="Current occupancy"
          icon={<Percent className="h-4 w-4 text-purple-600" />}
          trend={statsLoading ? null : dashboardStats?.weeklyOccupancyTrend}
          trendDescription="vs last week"
          loading={statsLoading}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Occupancy Chart */}
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Occupancy Trend</h2>
            </div>
            <div className="h-[300px]">
              <OccupancyChart data={formattedOccupancyData} loading={occupancyLoading} />
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Action Buttons */}
        <QuickButtons />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Check-ins */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Today's Check-ins</h2>
              <div className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                <span className="mr-1">View All</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
            <TodayCheckins />
          </CardContent>
        </Card>
        
        {/* Today's Check-outs */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Today's Check-outs</h2>
              <div className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                <span className="mr-1">View All</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
            <TodayCheckouts />
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <div className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                <span className="mr-1">View All</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
            <ActivitySection />
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Bookings */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Bookings</h2>
            <div className="flex items-center text-sm text-blue-600 hover:text-blue-800">
              <span className="mr-1">View All Bookings</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
          <RecentBookings limit={5} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
