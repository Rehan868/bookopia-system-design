
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Building2, CalendarRange, ClipboardList, Home, LayoutDashboard, LogOut, PieChart } from 'lucide-react';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export function Sidebar() {
  const { logout } = useAuth();
  const location = useLocation();
  
  const sidebarItems: SidebarItem[] = [
    {
      title: 'Dashboard',
      href: '/owner/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      title: 'Bookings',
      href: '/owner/bookings',
      icon: <CalendarRange className="h-5 w-5" />
    },
    {
      title: 'Availability',
      href: '/owner/availability',
      icon: <Home className="h-5 w-5" />
    },
    {
      title: 'Cleaning Status',
      href: '/owner/cleaning',
      icon: <ClipboardList className="h-5 w-5" />
    },
    {
      title: 'Reports',
      href: '/owner/reports',
      icon: <PieChart className="h-5 w-5" />
    }
  ];
  
  return (
    <div className="w-64 flex flex-col border-r bg-card h-screen">
      <div className="p-6">
        <Link to="/owner/dashboard" className="flex items-center gap-2 mb-10">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Owner Portal</span>
        </Link>
        
        <ScrollArea className="flex-1 -mx-4 px-4">
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn(
                  "w-full justify-start",
                  location.pathname === item.href && "bg-muted text-foreground font-medium"
                )}
              >
                <Link to={item.href}>
                  <span className="mr-3">{item.icon}</span>
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </div>
      
      <div className="p-6 mt-auto border-t">
        <Button variant="outline" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
