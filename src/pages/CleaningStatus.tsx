
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, RotateCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

type CleaningStatus = 'Clean' | 'Dirty' | 'In Progress';

interface Room {
  id: number;
  roomNumber: string;
  property: string;
  status: CleaningStatus;
  lastCleaned: string | null;
  nextCheckIn: string | null;
}

const CleaningStatus = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Sample data - in a real app this would come from a database
  const [allRooms, setAllRooms] = useState<Room[]>([
    { id: 1, roomNumber: '101', property: 'Marina Tower', status: 'Clean', lastCleaned: '2023-11-15 14:30', nextCheckIn: '2023-11-16 15:00' },
    { id: 2, roomNumber: '102', property: 'Marina Tower', status: 'Dirty', lastCleaned: '2023-11-14 10:15', nextCheckIn: '2023-11-17 14:00' },
    { id: 3, roomNumber: '201', property: 'Marina Tower', status: 'In Progress', lastCleaned: null, nextCheckIn: '2023-11-16 16:00' },
    { id: 4, roomNumber: '301', property: 'Downtown Heights', status: 'Clean', lastCleaned: '2023-11-15 12:45', nextCheckIn: null },
    { id: 5, roomNumber: '302', property: 'Downtown Heights', status: 'Dirty', lastCleaned: '2023-11-13 09:30', nextCheckIn: '2023-11-18 13:00' },
    { id: 6, roomNumber: '401', property: 'Downtown Heights', status: 'Clean', lastCleaned: '2023-11-15 15:20', nextCheckIn: '2023-11-17 15:00' },
  ]);
  
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || "");
  const [propertyFilter, setPropertyFilter] = useState<string>(searchParams.get('property') || "all");
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || "all");
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(allRooms);

  // Apply filters when filter values change
  useEffect(() => {
    let filtered = allRooms;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(room => 
        room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply property filter
    if (propertyFilter !== 'all') {
      filtered = filtered.filter(room => {
        if (propertyFilter === 'marina') {
          return room.property === 'Marina Tower';
        } else if (propertyFilter === 'downtown') {
          return room.property === 'Downtown Heights';
        }
        return true;
      });
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(room => {
        if (statusFilter === 'clean') {
          return room.status === 'Clean';
        } else if (statusFilter === 'dirty') {
          return room.status === 'Dirty';
        } else if (statusFilter === 'inprogress') {
          return room.status === 'In Progress';
        }
        return true;
      });
    }
    
    setFilteredRooms(filtered);
    
    // Update URL with filters
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (propertyFilter !== 'all') params.set('property', propertyFilter);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    
    setSearchParams(params, { replace: true });
  }, [searchQuery, propertyFilter, statusFilter, allRooms]);

  const updateStatus = (roomId: number, newStatus: CleaningStatus) => {
    setAllRooms(allRooms.map(room => 
      room.id === roomId 
        ? { 
            ...room, 
            status: newStatus, 
            lastCleaned: newStatus === 'Clean' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : room.lastCleaned 
          } 
        : room
    ));
    
    toast({
      description: `Room ${allRooms.find(room => room.id === roomId)?.roomNumber} marked as ${newStatus}`,
    });
  };

  const getStatusIcon = (status: CleaningStatus) => {
    switch(status) {
      case 'Clean': 
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Dirty': 
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'In Progress': 
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: CleaningStatus) => {
    switch(status) {
      case 'Clean': 
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Clean</Badge>;
      case 'Dirty': 
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Needs Cleaning</Badge>;
      case 'In Progress': 
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Progress</Badge>;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      description: searchQuery ? `Searching for room "${searchQuery}"` : "Showing all rooms",
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPropertyFilter("all");
    setStatusFilter("all");
    setSearchParams({});
    toast({
      description: "All filters have been cleared",
    });
  };

  const cleanCount = filteredRooms.filter(room => room.status === 'Clean').length;
  const dirtyCount = filteredRooms.filter(room => room.status === 'Dirty').length;
  const inProgressCount = filteredRooms.filter(room => room.status === 'In Progress').length;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Cleaning Status</h1>
        <p className="text-muted-foreground mt-1">Manage room cleaning status across all properties</p>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="bg-green-100 text-green-800 px-6 py-4 rounded-md flex items-center gap-3">
          <div className="h-4 w-4 rounded-full bg-green-500" />
          <span className="font-medium text-lg">{cleanCount} Clean</span>
        </div>
        <div className="bg-yellow-100 text-yellow-800 px-6 py-4 rounded-md flex items-center gap-3">
          <div className="h-4 w-4 rounded-full bg-yellow-500" />
          <span className="font-medium text-lg">{inProgressCount} In Progress</span>
        </div>
        <div className="bg-red-100 text-red-800 px-6 py-4 rounded-md flex items-center gap-3">
          <div className="h-4 w-4 rounded-full bg-red-500" />
          <span className="font-medium text-lg">{dirtyCount} Needs Cleaning</span>
        </div>
      </div>
      
      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <form onSubmit={handleSearch}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by room number..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          
          <Select value={propertyFilter} onValueChange={setPropertyFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="marina">Marina Tower</SelectItem>
              <SelectItem value="downtown">Downtown Heights</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="clean">Clean</SelectItem>
              <SelectItem value="dirty">Needs Cleaning</SelectItem>
              <SelectItem value="inprogress">In Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {(searchQuery || propertyFilter !== "all" || statusFilter !== "all") && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'} found
            </div>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        )}
      </Card>
      
      <Card>
        <Table>
          <TableCaption>Cleaning status of all rooms across properties.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Room</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Cleaned</TableHead>
              <TableHead>Next Check-in</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.roomNumber}</TableCell>
                  <TableCell>{room.property}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(room.status)}
                      {getStatusBadge(room.status)}
                    </div>
                  </TableCell>
                  <TableCell>{room.lastCleaned || 'Not yet cleaned'}</TableCell>
                  <TableCell>{room.nextCheckIn || 'No upcoming check-in'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {room.status !== 'Clean' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-green-600" 
                          onClick={() => updateStatus(room.id, 'Clean')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Clean
                        </Button>
                      )}
                      {room.status !== 'In Progress' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-yellow-600" 
                          onClick={() => updateStatus(room.id, 'In Progress')}
                        >
                          <RotateCw className="h-4 w-4 mr-1" />
                          Start Cleaning
                        </Button>
                      )}
                      {room.status !== 'Dirty' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600" 
                          onClick={() => updateStatus(room.id, 'Dirty')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Mark Dirty
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No rooms found matching your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default CleaningStatus;
