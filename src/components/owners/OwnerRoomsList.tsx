import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, DoorClosed } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useRooms } from '@/hooks/useRooms';

interface OwnerRoomsListProps {
  ownerId: string;
  isEditing?: boolean;
}

export const OwnerRoomsList = ({ ownerId, isEditing = false }: OwnerRoomsListProps) => {
  const { toast } = useToast();
  const { data: rooms, isLoading, error } = useRooms();

  const ownerRoomsList = rooms?.filter(room => room.owner_id === ownerId) || [];

  const availableRooms = rooms?.filter(
    room => room.owner_id !== ownerId
  ) || [];

  const handleAddRoom = (roomId: string) => {
    // Logic to assign room to owner via API
    toast({
      title: "Room Added",
      description: "Room has been successfully assigned to the owner.",
    });
  };

  const handleDeleteRoom = (roomId: string) => {
    // Logic to remove room from owner via API
    toast({
      title: "Room Removed",
      description: "Room has been removed from the owner's portfolio.",
    });
  };

  if (isLoading) {
    return <div>Loading rooms...</div>;
  }

  if (error) {
    return <div>Error loading rooms: {error.message}</div>;
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Owner Rooms</CardTitle>
        {isEditing && availableRooms.length > 0 && (
          <div className="flex gap-2">
            <select
              className="border rounded p-2"
              onChange={(e) => e.target.value && handleAddRoom(e.target.value)}
              value=""
            >
              <option value="">Add Room</option>
              {availableRooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.number} - {room.property}
                </option>
              ))}
            </select>
            <Button size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {ownerRoomsList.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Number</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                {isEditing && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {ownerRoomsList.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.number}</TableCell>
                  <TableCell>{room.property}</TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell>{room.status}</TableCell>
                  {isEditing && (
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteRoom(room.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <DoorClosed className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No rooms assigned to this owner</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
