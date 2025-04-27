
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock data for the chart - would come from API in real app
const data = [
  { name: 'Jan', occupancy: 65, revenue: 4000 },
  { name: 'Feb', occupancy: 72, revenue: 4500 },
  { name: 'Mar', occupancy: 80, revenue: 5000 },
  { name: 'Apr', occupancy: 75, revenue: 4800 },
  { name: 'May', occupancy: 85, revenue: 5500 },
  { name: 'Jun', occupancy: 90, revenue: 6000 },
  { name: 'Jul', occupancy: 95, revenue: 6500 },
  { name: 'Aug', occupancy: 88, revenue: 6200 },
  { name: 'Sep', occupancy: 82, revenue: 5800 },
  { name: 'Oct', occupancy: 78, revenue: 5200 },
  { name: 'Nov', occupancy: 70, revenue: 4800 },
  { name: 'Dec', occupancy: 75, revenue: 5000 },
];

export function OccupancyChart() {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-4">
        <CardTitle>Occupancy & Revenue</CardTitle>
        <CardDescription>Yearly overview of occupancy rates and revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                style={{ fontSize: '12px' }}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
                  border: 'none'
                }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="occupancy" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorOccupancy)" 
                name="Occupancy Rate (%)"
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                name="Revenue ($)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
