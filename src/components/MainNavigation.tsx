
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface MainNavigationProps {
  items: NavigationItem[];
  userType: "staff" | "owner";
}

export function MainNavigation({ items, userType }: MainNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-sidebar text-sidebar-foreground h-full flex flex-col transition-all",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className={cn(
        "p-4 flex items-center",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <div className={cn(collapsed ? "hidden" : "block")}>
          <div className="flex items-center">
            <div className="bg-white rounded-lg p-1.5 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M19 7v10c0 3-2 5-5 5H6.2c-1.8 0-3.2-1.4-3.2-3.2V5c0-1.8 1.4-3.2 3.2-3.2H14" />
                <path d="M16 3h6v6" />
                <path d="M12 13v4" />
                <path d="M9 13v4" />
                <path d="M19 13v4" />
                <path d="M16 13v4" />
                <path d="M9 8h1" />
                <path d="M16 8h1" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <span className="text-lg font-semibold">BOOKOPIA</span>
          </div>
        </div>
        {collapsed && (
          <div className="flex justify-center w-full">
            <div className="bg-white rounded-lg p-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M19 7v10c0 3-2 5-5 5H6.2c-1.8 0-3.2-1.4-3.2-3.2V5c0-1.8 1.4-3.2 3.2-3.2H14" />
                <path d="M16 3h6v6" />
              </svg>
            </div>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="bg-sidebar-accent hover:bg-sidebar-accent/80 text-white rounded-md p-1.5"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="px-2 py-4 flex-grow">
        <div className={cn("mb-2 px-3", collapsed ? "hidden" : "block")}>
          <div className="text-xs font-medium uppercase text-sidebar-primary">
            {userType === "staff" ? "Staff Portal" : "Owner Portal"}
          </div>
        </div>

        <nav>
          <ul className="space-y-1">
            {items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "w-full flex items-center px-3 py-2 rounded-md transition-colors",
                      isActive ? "bg-sidebar-accent text-white" : "text-sidebar-foreground hover:bg-sidebar-accent/60",
                      collapsed ? "justify-center" : "justify-start"
                    )}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!collapsed && <span className="ml-3">{item.name}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center",
          collapsed ? "justify-center" : "justify-start"
        )}>
          <div className="w-8 h-8 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center font-medium">
            {userType === "staff" ? "S" : "O"}
          </div>
          {!collapsed && (
            <div className="ml-3">
              <div className="text-sm font-medium">
                {userType === "staff" ? "Staff User" : "Owner"}
              </div>
              <div className="text-xs text-sidebar-foreground/80">
                {userType === "staff" ? "Staff Account" : "Owner Account"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
