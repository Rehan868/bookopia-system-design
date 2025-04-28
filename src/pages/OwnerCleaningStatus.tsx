
import React, { useEffect, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Loader } from 'lucide-react';

interface CleaningTask {
  id: string;
  room_number: string;
  property: string;
  assigned_to: string;
  date: string;
  status: 'completed' | 'in_progress' | 'scheduled' | 'delayed';
}

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

// Function to map room status to cleaning task status
const mapRoomStatusToTaskStatus = (status: string): 'completed' | 'in_progress' | 'scheduled' | 'delayed' => {
  switch (status) {
    case 'available':
      return 'completed';
    case 'occupied':
      return 'in_progress';
    case 'maintenance':
      return 'delayed';
    default:
      return 'scheduled';
  }
};

const OwnerCleaningStatus = () => {
  const [cleaningTasks, setCleaningTasks] = useState<CleaningTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCleaningTasks = async () => {
      try {
        setIsLoading(true);
        
        // Fetch rooms with cleaning status
        const { data, error } = await supabase
          .from('rooms')
          .select(`
            id,
            number,
            property_name,
            status
          `);
        
        if (error) throw error;
        
        // Map to the cleaning tasks format
        const tasks = data.map(room => ({
          id: room.id,
          room_number: room.number,
          property: room.property_name,
          assigned_to: 'Staff Member', // This would come from a join table in a real implementation
          date: new Date().toISOString().split('T')[0], // Today's date
          status: mapRoomStatusToTaskStatus(room.status)
        }));
        
        setCleaningTasks(tasks);
      } catch (err) {
        console.error('Error fetching cleaning tasks:', err);
        setError('Failed to load cleaning tasks. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCleaningTasks();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

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
