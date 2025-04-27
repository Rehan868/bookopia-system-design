import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarRange, ClipboardList, UserCog, ChartBar, BedDouble, CreditCard, Settings, Users } from "lucide-react";
export function QuickButtons() {
  return <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="mx-0 my-[84px] px-0 py-[15px]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button variant="outline" className="h-auto flex-col p-4 justify-center" asChild>
            <Link to="/bookings/new" className="mx-0 my-0 py-[9px] px-0">
              <CalendarRange className="h-5 w-5 mb-2" />
              <span className="text-sm">New Booking</span>
            </Link>
          </Button>
          
          <Button variant="outline" className="h-auto flex-col p-4 justify-center" asChild>
            <Link to="/rooms">
              <BedDouble className="h-5 w-5 mb-2" />
              <span className="text-sm">Rooms</span>
            </Link>
          </Button>
          
          <Button variant="outline" className="h-auto flex-col p-4 justify-center" asChild>
            <Link to="/cleaning">
              <ClipboardList className="h-5 w-5 mb-2" />
              <span className="text-sm">Cleaning</span>
            </Link>
          </Button>
          
          <Button variant="outline" className="h-auto flex-col p-4 justify-center" asChild>
            <Link to="/expenses">
              <CreditCard className="h-5 w-5 mb-2" />
              <span className="text-sm">Expenses</span>
            </Link>
          </Button>
          
          <Button variant="outline" className="h-auto flex-col p-4 justify-center" asChild>
            
          </Button>
          
          <Button variant="outline" className="h-auto flex-col p-4 justify-center" asChild>
            
          </Button>
          
          <Button variant="outline" className="h-auto flex-col p-4 justify-center" asChild>
            
          </Button>
          
          <Button variant="outline" className="h-auto flex-col p-4 justify-center" asChild>
            <Link to="/users">
              <UserCog className="h-5 w-5 mb-2" />
              <span className="text-sm">Account</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>;
}