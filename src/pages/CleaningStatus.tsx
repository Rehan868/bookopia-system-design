
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Search,
  CheckCheck,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useCleaningStatus, useUpdateCleaningStatus } from "@/hooks/useCleaningStatus";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Room {
  id: string;
  roomNumber: string;
  property: string;
  status: string;
  lastCleaned: string;
  nextCheckIn: string;
  assignedTo: string;
}

const CleaningStatus = () => {
  const { data: cleaningTasks, isLoading, error } = useCleaningStatus();
  const { mutate: updateStatus } = useUpdateCleaningStatus();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [rooms, setRooms] = useState<Room[]>([]);
  
  useEffect(() => {
    if (cleaningTasks && Array.isArray(cleaningTasks)) {
      // Convert API data format to component format
      const formattedRooms = cleaningTasks.map(task => ({
        id: task.id,
        roomNumber: task.room_number,
        property: task.property,
        status: task.status,
        lastCleaned: task.last_cleaned ? format(new Date(task.last_cleaned), 'MMM dd, yyyy') : 'Never',
        nextCheckIn: 'Not scheduled', // This would come from bookings data in a real app
        assignedTo: task.assigned_to || 'Unassigned'
      }));
      
      setRooms(formattedRooms);
    }
  }, [cleaningTasks]);
  
  const handleUpdateStatus = (roomId: string, newStatus: string) => {
    updateStatus(
      { id: roomId, status: newStatus },
      {
        onSuccess: () => {
          toast({
            title: "Status Updated",
            description: `Room status has been updated to ${newStatus}.`,
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to update room status. Please try again.",
            variant: "destructive",
          });
          console.error("Error updating room status:", error);
        },
      }
    );
  };
  
  // Filter rooms based on search term and status filter
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      searchTerm === "" ||
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.property.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "clean" && room.status === "clean") ||
      (filterStatus === "dirty" && room.status === "dirty") ||
      (filterStatus === "maintenance" && room.status === "maintenance");
      
    return matchesSearch && matchesFilter;
  });
  
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Cleaning Status</h1>
        <p className="text-muted-foreground mt-1">Manage room cleaning and maintenance</p>
      </div>
      
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rooms or properties..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full sm:w-auto">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="clean">Clean</TabsTrigger>
              <TabsTrigger value="dirty">Dirty</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <Card>
          <CardHeader className="p-4">
            <CardTitle>Rooms</CardTitle>
            <CardDescription>
              {filteredRooms.length} room{filteredRooms.length !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Cleaned</TableHead>
                    <TableHead>Next Check-in</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center">
                          <Clock className="animate-pulse h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground mt-2">Loading room data...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredRooms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-muted-foreground">No rooms found matching your filters</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell>{room.roomNumber}</TableCell>
                        <TableCell>{room.property}</TableCell>
                        <TableCell>
                          <Badge variant={
                            room.status === "clean" ? "default" : 
                            room.status === "dirty" ? "secondary" : 
                            room.status === "maintenance" ? "destructive" :
                            "outline"
                          }>
                            {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{room.lastCleaned}</TableCell>
                        <TableCell>{room.nextCheckIn}</TableCell>
                        <TableCell>{room.assignedTo}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(room.id, "clean")}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                Mark as Clean
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(room.id, "dirty")}
                              >
                                <AlertCircle className="h-4 w-4 mr-2 text-orange-500" />
                                Mark as Dirty
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(room.id, "maintenance")}
                              >
                                <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                Mark for Maintenance
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CleaningStatus;
