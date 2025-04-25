
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { ChartCard } from "@/components/ChartCard";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    name: "Dashboard",
    path: "/owner/dashboard",
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
    path: "/owner/bookings",
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
    name: "Availability",
    path: "/owner/availability",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
        <path d="M16 18h.01" />
      </svg>
    ),
  },
  {
    name: "Cleaning Status",
    path: "/owner/cleaning",
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
    name: "Reports",
    path: "/owner/reports",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
        <path d="M10 9H8" />
      </svg>
    ),
  }
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

const revenueData = [
  { name: "Apr 18", value: 2180 },
  { name: "Apr 19", value: 2430 },
  { name: "Apr 20", value: 2850 },
  { name: "Apr 21", value: 3010 },
  { name: "Apr 22", value: 3220 },
  { name: "Apr 23", value: 2940 },
  { name: "Apr 24", value: 2650 },
  { name: "Apr 25", value: 2760 }
];

export default function OwnerDashboard() {
  return (
    <MainLayout navigationItems={navigationItems} userType="owner">
      <div className="animate-fade-in">
        <PageHeader 
          title="Owner Dashboard" 
          subtitle="Welcome back! Here's an overview of your property."
        />
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
          />
          
          <StatCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>}
            value="82%"
            label="Occupancy Rate"
            trend={{ value: "5%", positive: true }}
          />
          
          <StatCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>}
            value="$19,850"
            label="Monthly Revenue"
            trend={{ value: "8%", positive: true }}
          />
        </div>
        
        {/* Quick Actions */}
        <div className="bookopia-card mb-8">
          <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { 
                name: "View Bookings", 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>,
                path: "/owner/bookings"
              },
              { 
                name: "Check Availability", 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>,
                path: "/owner/availability"
              },
              { 
                name: "Cleaning Status", 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 22v-5l5-5 5 5-5 5z" />
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16" />
                </svg>,
                path: "/owner/cleaning"
              },
              { 
                name: "Reports", 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                  <path d="M10 9H8" />
                </svg>,
                path: "/owner/reports"
              },
            ].map((action, i) => (
              <Button 
                key={i} 
                variant="outline"
                className="h-auto py-6 flex flex-col items-center justify-center space-y-2 hover:bg-accent"
                onClick={() => {/* navigate to path */}}
              >
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  {action.icon}
                </div>
                <span>{action.name}</span>
              </Button>
            ))}
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard 
            title="Occupancy Rate (Last 7 days)"
            data={occupancyData}
            xKey="name"
            yKey="value"
          />
          <ChartCard 
            title="Daily Revenue (Last 7 days)"
            data={revenueData}
            xKey="name"
            yKey="value"
          />
        </div>
        
        {/* Activity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bookopia-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Today's Check-ins</h3>
              <a href="#" className="text-primary text-sm hover:underline">View all</a>
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center p-3 bg-accent rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium mr-3">
                    {["JD", "AR", "TM", "KL"][i]}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {["John Doe", "Alice Robinson", "Tom Miller", "Karen Lee"][i]}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Room {[301, 205, 410, 118][i]} • {["2:00 PM", "3:15 PM", "4:30 PM", "6:45 PM"][i]}
                    </div>
                  </div>
                  <div className={`text-xs font-medium py-1 px-2 rounded-full ${i % 2 === 0 ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {i % 2 === 0 ? 'Confirmed' : 'Checked In'}
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
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center p-3 bg-accent rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium mr-3">
                    {["SM", "RB", "WJ"][i]}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {["Sarah Miller", "Robert Brown", "William Jones"][i]}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Room {[207, 318, 405][i]} • {["10:00 AM", "11:30 AM", "12:00 PM"][i]}
                    </div>
                  </div>
                  <div className={`text-xs font-medium py-1 px-2 rounded-full ${i === 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {i === 0 ? 'Checked Out' : 'Pending'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
