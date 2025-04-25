
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  data: any[];
  xKey: string;
  yKey: string;
  className?: string;
}

export function ChartCard({ title, data, xKey, yKey, className }: ChartCardProps) {
  return (
    <div className={cn("bookopia-chart-card", className)}>
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xKey} stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px', borderColor: '#e2e8f0' }}/>
            <Line type="monotone" dataKey={yKey} stroke="#1E40AF" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
