import React from 'react';
import { StatCard } from "@/components/dashboard/StatCard";
import { OccupancyChart } from "@/components/dashboard/OccupancyChart";
import { QuickButtons } from "@/components/dashboard/QuickButtons";
import { ActivitySection } from "@/components/dashboard/ActivitySection";
import { RecentBookings } from "@/components/dashboard/RecentBookings";
import { BedDouble, ArrowDownToLine, ArrowUpFromLine, Percent } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
const Dashboard = () => {
  const {
    data: stats,
    isLoading
  } = useDashboardStats();
  return <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back to your hotel management dashboard</p>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Available Rooms" value={isLoading ? "Loading..." : stats?.availableRooms || 0} description={`Out of ${stats?.totalRooms || 0} total rooms`} icon={BedDouble} className="animate-slide-up" />
        
        <StatCard title="Today's Check-ins" value={isLoading ? "Loading..." : stats?.todayCheckIns || 0} description="3 are arriving in the morning" icon={ArrowDownToLine} className="animate-slide-up [animation-delay:100ms]" />
        
        <StatCard title="Today's Check-outs" value={isLoading ? "Loading..." : stats?.todayCheckOuts || 0} description="All scheduled before noon" icon={ArrowUpFromLine} className="animate-slide-up [animation-delay:200ms]" />
        
        <StatCard title="Occupancy Rate" value={isLoading ? "Loading..." : `${stats?.occupancyRate || 0}%`} trend="up" trendValue={stats?.weeklyOccupancyTrend || "+0%"} icon={Percent} className="animate-slide-up [animation-delay:300ms]" />
      </div>
      
      {/* Chart and Quick Buttons Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <OccupancyChart />
        </div>
        <div className="mx-0 my-0 px-0 py-0 rounded-none">
          <QuickButtons />
        </div>
      </div>
      
      {/* Today's Activity Section */}
      <ActivitySection />
      
      {/* Recent Bookings Section */}
      <div className="mt-6">
        <RecentBookings />
      </div>
    </div>;
};
export default Dashboard;