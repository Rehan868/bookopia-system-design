
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, AreaChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  // Sample data for charts - in a real app this would come from a database
  const revenueData = [
    { name: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
    { name: 'Feb', revenue: 3000, expenses: 1398, profit: 1602 },
    { name: 'Mar', revenue: 5000, expenses: 3000, profit: 2000 },
    { name: 'Apr', revenue: 2780, expenses: 3908, profit: -1128 },
    { name: 'May', revenue: 1890, expenses: 4800, profit: -2910 },
    { name: 'Jun', revenue: 2390, expenses: 3800, profit: -1410 },
    { name: 'Jul', revenue: 3490, expenses: 4300, profit: -810 },
    { name: 'Aug', revenue: 6000, expenses: 2300, profit: 3700 },
    { name: 'Sep', revenue: 5500, expenses: 2900, profit: 2600 },
    { name: 'Oct', revenue: 4500, expenses: 3100, profit: 1400 },
    { name: 'Nov', revenue: 5200, expenses: 3400, profit: 1800 },
    { name: 'Dec', revenue: 7800, expenses: 4300, profit: 3500 },
  ];

  const occupancyData = [
    { name: 'Jan', occupancy: 65 },
    { name: 'Feb', occupancy: 59 },
    { name: 'Mar', occupancy: 80 },
    { name: 'Apr', occupancy: 55 },
    { name: 'May', occupancy: 40 },
    { name: 'Jun', occupancy: 50 },
    { name: 'Jul', occupancy: 75 },
    { name: 'Aug', occupancy: 90 },
    { name: 'Sep', occupancy: 85 },
    { name: 'Oct', occupancy: 70 },
    { name: 'Nov', occupancy: 75 },
    { name: 'Dec', occupancy: 95 },
  ];

  const bookingSourceData = [
    { name: 'Direct', value: 40 },
    { name: 'Booking.com', value: 30 },
    { name: 'Airbnb', value: 20 },
    { name: 'Expedia', value: 10 },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">Analyze your business performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export as PDF
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Export as Excel
          </Button>
        </div>
      </div>
      
      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-muted-foreground font-normal"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Filter by date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={new Date()}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="marina">Marina Tower</SelectItem>
              <SelectItem value="downtown">Downtown Heights</SelectItem>
            </SelectContent>
          </Select>
          
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Comparison period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Comparison</SelectItem>
              <SelectItem value="prevyear">Previous Year</SelectItem>
              <SelectItem value="prevmonth">Previous Month</SelectItem>
              <SelectItem value="prevquarter">Previous Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>
      
      <Tabs defaultValue="revenue" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue, Expenses & Profit</CardTitle>
              <CardDescription>Financial performance over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                    <Bar dataKey="profit" fill="#22c55e" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="occupancy">
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Rate</CardTitle>
              <CardDescription>Room occupancy percentage over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={occupancyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="occupancy" fill="#8884d8" stroke="#8884d8" name="Occupancy %" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Booking Sources</CardTitle>
              <CardDescription>Distribution of booking channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={bookingSourceData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#6366f1" name="Percentage" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Rooms</CardTitle>
            <CardDescription>Rooms with highest revenue and occupancy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border border-border rounded-md">
                <div>
                  <p className="font-medium">Room 301</p>
                  <p className="text-sm text-muted-foreground">Downtown Heights</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$12,450</p>
                  <p className="text-sm text-muted-foreground">92% Occupancy</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 border border-border rounded-md">
                <div>
                  <p className="font-medium">Room 205</p>
                  <p className="text-sm text-muted-foreground">Marina Tower</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$10,820</p>
                  <p className="text-sm text-muted-foreground">87% Occupancy</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 border border-border rounded-md">
                <div>
                  <p className="font-medium">Room 401</p>
                  <p className="text-sm text-muted-foreground">Downtown Heights</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$9,675</p>
                  <p className="text-sm text-muted-foreground">84% Occupancy</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Forecast</CardTitle>
            <CardDescription>Projected occupancy for next 3 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border border-border rounded-md">
                <div>
                  <p className="font-medium">December 2023</p>
                  <p className="text-sm text-muted-foreground">Holiday Season</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">95% Projected</p>
                  <p className="text-sm text-muted-foreground">+15% YoY</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 border border-border rounded-md">
                <div>
                  <p className="font-medium">January 2024</p>
                  <p className="text-sm text-muted-foreground">New Year</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-yellow-600">65% Projected</p>
                  <p className="text-sm text-muted-foreground">+5% YoY</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 border border-border rounded-md">
                <div>
                  <p className="font-medium">February 2024</p>
                  <p className="text-sm text-muted-foreground">Low Season</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">55% Projected</p>
                  <p className="text-sm text-muted-foreground">-3% YoY</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
