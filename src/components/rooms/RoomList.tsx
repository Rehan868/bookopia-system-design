import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  BedDouble, 
  Building, 
  Edit, 
  MoreHorizontal, 
  Loader, 
  Trash2, 
  Plus,
  RefreshCw
} from 'lucide-react';
import { ViewToggle } from '@/components/ui/ViewToggle';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { useRooms } from '@/hooks/useRooms';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function getStatusBadge(status: string) {
  switch (status) {
    case 'available':
      return <Badge className="bg-green-100 text-green-800">Available</Badge>;
    case 'occupied':
      return <Badge className="bg-blue-100 text-blue-800">Occupied</Badge>;
    case 'maintenance':
      return <Badge className="bg-red-100 text-red-800">Maintenance</Badge>;
    case 'cleaning':
      return <Badge className="bg-yellow-100 text-yellow-800">Cleaning</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
  }
}

interface RoomListProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  searchQuery?: string;
  filterValue?: string;
}

export function RoomList({ 
  view, 
  onViewChange,
  searchQuery = '',
  filterValue = 'all'
}: RoomListProps) {
  const { data: rooms, isLoading, error, removeRoom, changeRoomStatus, refreshRooms } = useRooms();
  const { toast } = useToast();
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  
  // State for status update dialog
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusUpdateDetails, setStatusUpdateDetails] = useState<{
    id: string;
    status: string;
    title: string;
    description: string;
  } | null>(null);

  const filteredRooms = useMemo(() => {
    if (!rooms) return [];
    
    return rooms.filter(room => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery || 
        (room.number && room.number.toLowerCase().includes(searchLower)) ||
        (room.property_name && room.property_name.toLowerCase().includes(searchLower)) || 
        (room.type && room.type.toLowerCase().includes(searchLower));
      
      const matchesStatus = filterValue === 'all' || room.status === filterValue;
      
      return matchesSearch && matchesStatus;
    });
  }, [rooms, searchQuery, filterValue]);

  const handleDeleteRoom = async () => {
    if (!selectedRoomId) return;
    
    const success = await removeRoom(selectedRoomId);
    if (success) {
      toast({
        title: "Room Deleted",
        description: "The room has been successfully removed.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete the room. Please try again.",
        variant: "destructive",
      });
    }
    
    setSelectedRoomId(null);
    setDeleteDialogOpen(false);
  };
  
  const confirmDelete = (id: string) => {
    setSelectedRoomId(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmStatusChange = (id: string, newStatus: string) => {
    let title = '';
    let description = '';
    
    if (newStatus === 'available') {
      title = 'Mark Room as Available';
      description = 'Are you sure you want to mark this room as available?';
    } else if (newStatus === 'occupied') {
      title = 'Mark Room as Occupied';
      description = 'Are you sure you want to mark this room as occupied?';
    } else if (newStatus === 'maintenance') {
      title = 'Mark Room for Maintenance';
      description = 'Are you sure you want to mark this room for maintenance?';
    } else if (newStatus === 'cleaning') {
      title = 'Mark Room for Cleaning';
      description = 'Are you sure you want to mark this room for cleaning?';
    } else {
      title = `Update Status to ${newStatus}`;
      description = `Are you sure you want to change the status to ${newStatus}?`;
    }
    
    setStatusUpdateDetails({
      id,
      status: newStatus,
      title,
      description
    });
    
    setStatusDialogOpen(true);
  };
  
  const handleStatusChange = async () => {
    if (!statusUpdateDetails) return;
    
    const { id, status } = statusUpdateDetails;
    const updatedRoom = await changeRoomStatus(id, status);
    
    if (updatedRoom) {
      toast({
        title: "Status Updated",
        description: `The room status has been updated to ${status}.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update the room status. Please try again.",
        variant: "destructive",
      });
    }
    
    setStatusUpdateDetails(null);
    setStatusDialogOpen(false);
  };

  const handleRefreshRooms = async () => {
    await refreshRooms();
    toast({
      title: "Rooms Refreshed",
      description: "The rooms list has been refreshed.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading rooms...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500">Failed to load rooms data</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Rooms</h2>
        <div className="flex gap-4">
          <Button asChild className="mr-2">
            <Link to="/rooms/add">
              <Plus className="h-4 w-4 mr-2" />
              Add New Room
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="mr-2"
            onClick={handleRefreshRooms}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <ViewToggle view={view} setView={onViewChange} />
        </div>
      </div>
      
      {view === 'list' ? (
        <div className="rounded-lg overflow-hidden border border-border">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left font-medium px-6 py-3">Room</th>
                <th className="text-left font-medium px-6 py-3">Property</th>
                <th className="text-left font-medium px-6 py-3">Type</th>
                <th className="text-left font-medium px-6 py-3">Capacity</th>
                <th className="text-left font-medium px-6 py-3">Status</th>
                <th className="text-left font-medium px-6 py-3">Rate</th>
                <th className="text-left font-medium px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRooms.map((room) => (
                <tr key={room.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium">{room.number}</div>
                    <div className="text-sm text-muted-foreground">{room.number}</div>
                  </td>
                  <td className="px-6 py-4">{room.property_name}</td>
                  <td className="px-6 py-4">{room.type}</td>
                  <td className="px-6 py-4">{room.max_occupancy} persons</td>
                  <td className="px-6 py-4">{getStatusBadge(room.status)}</td>
                  <td className="px-6 py-4">${room.base_rate}/night</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost" asChild>
                        <Link to={`/rooms/view/${room.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/rooms/view/${room.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/rooms/edit/${room.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => confirmStatusChange(room.id, 'available')}>
                            Mark as Available
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => confirmStatusChange(room.id, 'occupied')}>
                            Mark as Occupied
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => confirmStatusChange(room.id, 'maintenance')}>
                            Mark for Maintenance
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => confirmStatusChange(room.id, 'cleaning')}>
                            Mark for Cleaning
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => confirmDelete(room.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
              {(!filteredRooms || filteredRooms.length === 0) && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    No rooms found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <Card key={room.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="h-48 bg-muted flex items-center justify-center">
                  <BedDouble className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{`Room ${room.number}`}</p>
                        <p className="text-sm text-muted-foreground">#{room.number}</p>
                      </div>
                      {getStatusBadge(room.status)}
                    </div>
                      
                    <div className="border-t pt-4 mt-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-muted rounded-md">
                          <Building className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">PROPERTY</p>
                          <p className="text-sm">{room.property_name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-muted rounded-md">
                          <BedDouble className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">TYPE</p>
                          <p className="text-sm">{room.type} • {room.max_occupancy} persons</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-muted rounded-md">
                          <div className="font-semibold text-xs text-muted-foreground">$</div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">RATE</p>
                          <p className="text-sm">${room.base_rate}/night</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between gap-2 border-t pt-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => confirmStatusChange(room.id, 'available')}>
                            Mark as Available
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => confirmStatusChange(room.id, 'occupied')}>
                            Mark as Occupied
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => confirmStatusChange(room.id, 'maintenance')}>
                            Mark for Maintenance
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => confirmStatusChange(room.id, 'cleaning')}>
                            Mark for Cleaning
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={() => confirmDelete(room.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/rooms/edit/${room.id}`}>
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link to={`/rooms/view/${room.id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!filteredRooms || filteredRooms.length === 0) && (
            <div className="col-span-full text-center py-10 border rounded-md bg-muted/10">
              <p className="text-muted-foreground">No rooms found</p>
            </div>
          )}
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the room from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteRoom}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Status Update Dialog */}
      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{statusUpdateDetails?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {statusUpdateDetails?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
