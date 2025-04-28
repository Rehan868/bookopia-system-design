import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CalendarRange, 
  ClipboardList, 
  UserCog, 
  ChartBar, 
  BedDouble, 
  CreditCard, 
  BarChart3, 
  Calendar,
  Mail
} from "lucide-react";

export function QuickButtons() {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Quick Actions</span>
          <span className="text-xs text-muted-foreground">Frequently used</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="mx-0 my-[84px] px-0 py-[15px]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button 
            variant="outline" 
            className="h-auto flex-col py-4 px-2 justify-center hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all duration-200" 
            asChild
          >
            <Link to="/bookings/new" className="mx-0 my-0 py-[9px] px-0">
              <div className="bg-blue-100 p-2 rounded-full mb-2">
                <CalendarRange className="h-5 w-5 text-blue-700" />
              </div>
              <span className="text-sm font-medium">New Booking</span>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto flex-col py-4 px-2 justify-center hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all duration-200" 
            asChild
          >
            <Link to="/rooms">
              <div className="bg-green-100 p-2 rounded-full mb-2">
                <BedDouble className="h-5 w-5 text-green-700" />
              </div>
              <span className="text-sm font-medium">Rooms</span>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto flex-col py-4 px-2 justify-center hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-all duration-200" 
            asChild
          >
            <Link to="/cleaning-status">
              <div className="bg-purple-100 p-2 rounded-full mb-2">
                <ClipboardList className="h-5 w-5 text-purple-700" />
              </div>
              <span className="text-sm font-medium">Cleaning</span>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto flex-col py-4 px-2 justify-center hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-all duration-200" 
            asChild
          >
            <Link to="/expenses">
              <div className="bg-amber-100 p-2 rounded-full mb-2">
                <CreditCard className="h-5 w-5 text-amber-700" />
              </div>
              <span className="text-sm font-medium">Expenses</span>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto flex-col py-4 px-2 justify-center hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all duration-200" 
            asChild
          >
            <Link to="/availability">
              <div className="bg-red-100 p-2 rounded-full mb-2">
                <Calendar className="h-5 w-5 text-red-700" />
              </div>
              <span className="text-sm font-medium">Availability</span>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto flex-col py-4 px-2 justify-center hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition-all duration-200" 
            asChild
          >
            <Link to="/reports">
              <div className="bg-teal-100 p-2 rounded-full mb-2">
                <BarChart3 className="h-5 w-5 text-teal-700" />
              </div>
              <span className="text-sm font-medium">Reports</span>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto flex-col py-4 px-2 justify-center hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all duration-200" 
            asChild
          >
            <Link to="/email-templates">
              <div className="bg-indigo-100 p-2 rounded-full mb-2">
                <Mail className="h-5 w-5 text-indigo-700" />
              </div>
              <span className="text-sm font-medium">Templates</span>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto flex-col py-4 px-2 justify-center hover:bg-gray-50 hover:text-gray-700 hover:border-gray-200 transition-all duration-200" 
            asChild
          >
            <Link to="/users">
              <div className="bg-gray-100 p-2 rounded-full mb-2">
                <UserCog className="h-5 w-5 text-gray-700" />
              </div>
              <span className="text-sm font-medium">Account</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}