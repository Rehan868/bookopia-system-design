
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { ChartCard } from "@/components/ChartCard";
import { Timeline } from "@/components/Timeline";
import { MainLayout } from "@/components/layouts/MainLayout";

const navigationItems = [
  {
    name: "Dashboard",
    path: "/staff/dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    ),
  },
  {
    name: "Bookings",
    path: "/staff/bookings",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
      </svg>
    ),
  },
  {
    name: "Rooms",
    path: "/staff/rooms",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7v11m0-7h18m0-4v11m-5-7v7m-8-7v7" />
      </svg>
    ),
  },
  {
    name: "Cleaning",
    path: "/staff/cleaning",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 22v-5l5-5 5 5-5 5z" />
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16" />
        <path d="M18 14h-8" />
        <path d="M18 10h-8" />
        <path d="M18 6h-8" />
      </svg>
    ),
  },
  {
    name: "Expenses",
    path: "/staff/expenses",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12" y1="16" y2="16" />
      </svg>
    ),
  },
  {
    name: "Audit Logs",
    path: "/staff/audit",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 4h6v6" />
        <path d="M10 20H4v-6" />
        <path d="M20 10 4 20" />
      </svg>
    ),
  },
  {
    name: "Users",
    path: "/staff/users",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const occupancyData = [
  { name: "Apr 18", value: 65 },
  { name: "Apr 19", value: 72 },
  { name: "Apr 20", value: 85 },
  { name: "Apr 21", value: 90 },
  { name: "Apr 22", value: 95 },
  { name: "Apr 23", value: 87 },
  { name: "Apr 24", value: 78 },
  { name: "Apr 25", value: 82 }
];

const timelineEvents = [
  { 
    time: "08:00 AM", 
    title: "Housekeeping started", 
    description: "Cleaning team began work on Floor 2", 
    status: "completed" 
  },
  { 
    time: "10:30 AM", 
    title: "Room 304 ready", 
    description: "Room prepared for early check-in", 
    status: "completed" 
  },
  { 
    time: "01:00 PM", 
    title: "Meeting with suppliers", 
    description: "Discussion about new amenities", 
    status: "current" 
  },
  { 
    time: "03:45 PM", 
    title: "VIP Guest arrival", 
    description: "Special preparation required for Room 501", 
    status: "upcoming" 
  },
  { 
    time: "06:00 PM", 
    title: "Shift handover", 
    description: "Evening staff briefing and updates", 
    status: "upcoming" 
  }
];

export default function StaffDashboard() {
  return (
    <MainLayout navigationItems={navigationItems} userType="staff">
      <div className="animate-fade-in">
        <PageHeader 
          title="Staff Dashboard" 
          subtitle="Welcome back! Here's what's happening today."
        />
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M3 7v11m0-7h18m0-4v11m-5-7v7m-8-7v7" />
            </svg>}
            value={12}
            label="Available Rooms"
            trend={{ value: "2", positive: true }}
          />
          
          <StatCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
              <path d="m2 8 2 2-2 2 2 2-2 2" />
              <path d="m22 8-2 2 2 2-2 2 2 2" />
              <rect width="8" height="14" x="8" y="5" rx="2" />
              <path d="M12 9v6" />
            </svg>}
            value={8}
            label="Today's Check-ins"
            description="Next check-in at 2:00 PM"
          />
          
          <StatCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
              <path d="m2 8 2 2-2 2 2 2-2 2" />
              <path d="m22 8-2 2 2 2-2 2 2 2" />
              <rect width="8" height="14" x="8" y="5" rx="2" />
              <path d="M12 9v6" />
            </svg>}
            value={6}
            label="Today's Check-outs"
            description="Next check-out at 11:00 AM"
          />
          
          <StatCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>}
            value="82%"
            label="Occupancy Rate"
            trend={{ value: "5%", positive: true }}
          />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ChartCard 
              title="Occupancy Rate (Last 7 days)"
              data={occupancyData}
              xKey="name"
              yKey="value"
            />
          </div>
          
          <div className="bookopia-card">
            <h3 className="text-lg font-medium mb-4">Today's Activity</h3>
            <Timeline events={timelineEvents} />
          </div>
        </div>
        
        {/* Bookings & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bookopia-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Today's Check-ins</h3>
              <a href="#" className="text-primary text-sm hover:underline">View all</a>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center p-3 bg-accent rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium mr-3">
                    {["JD", "AR", "TM", "KL"][i]}
                  </div>
                  <div>
                    <div className="font-medium">
                      {["John Doe", "Alice Robinson", "Tom Miller", "Karen Lee"][i]}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Room {[301, 205, 410, 118][i]} • {["2:00 PM", "3:15 PM", "4:30 PM", "6:45 PM"][i]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bookopia-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Today's Check-outs</h3>
              <a href="#" className="text-primary text-sm hover:underline">View all</a>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center p-3 bg-accent rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium mr-3">
                    {["SM", "RB", "WJ"][i]}
                  </div>
                  <div>
                    <div className="font-medium">
                      {["Sarah Miller", "Robert Brown", "William Jones"][i]}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Room {[207, 318, 405][i]} • {["10:00 AM", "11:30 AM", "12:00 PM"][i]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bookopia-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Action Items</h3>
              <span className="bg-orange-100 text-orange-700 text-xs py-1 px-2 rounded-full">4 pending</span>
            </div>
            <div className="space-y-3">
              {[
                "Complete room inspection for 301",
                "Follow up on maintenance request",
                "Process refund for booking #2845",
                "Prepare welcome package for VIP"
              ].map((item, i) => (
                <div key={i} className="flex items-center p-2.5">
                  <div className="w-5 h-5 rounded-full border border-muted-foreground mr-3 flex-shrink-0"></div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-2">
              <button className="text-sm bg-accent hover:bg-accent/80 text-accent-foreground py-2 px-3 rounded">
                Add Task
              </button>
              <button className="text-sm bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-3 rounded">
                View All
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
