
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Mock data - in a real app this would come from an API
const cleaningTasks = [
  {
    id: '1',
    room_number: '101',
    property: 'Beachfront Villa',
    assigned_to: 'Maria Garcia',
    date: '2025-04-08',
    status: 'completed'
  },
  {
    id: '2',
    room_number: '102',
    property: 'Beachfront Villa',
    assigned_to: 'James Wilson',
    date: '2025-04-08',
    status: 'in_progress'
  },
  {
    id: '3',
    room_number: '103',
    property: 'Beachfront Villa',
    assigned_to: 'Maria Garcia',
    date: '2025-04-09',
    status: 'scheduled'
  },
  {
    id: '4',
    room_number: '201',
    property: 'Downtown Heights',
    assigned_to: 'Robert Johnson',
    date: '2025-04-08',
    status: 'delayed'
  },
  {
    id: '5',
    room_number: '202',
    property: 'Downtown Heights',
    assigned_to: 'Robert Johnson',
    date: '2025-04-09',
    status: 'scheduled'
  },
];

const statusColors = {
  completed: "bg-green-100 text-green-800 border-green-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  scheduled: "bg-purple-100 text-purple-800 border-purple-200",
  delayed: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels = {
  completed: "Completed",
  in_progress: "In Progress",
  scheduled: "Scheduled",
  delayed: "Delayed",
};

const OwnerCleaningStatus = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cleaning Status</h1>
        <p className="text-muted-foreground mt-1">Track cleaning tasks for your properties</p>
      </div>
      
      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cleaningTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.property}</TableCell>
                <TableCell>Room {task.room_number}</TableCell>
                <TableCell>{task.assigned_to}</TableCell>
                <TableCell>{task.date}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={statusColors[task.status as keyof typeof statusColors]}
                  >
                    {statusLabels[task.status as keyof typeof statusLabels]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OwnerCleaningStatus;
