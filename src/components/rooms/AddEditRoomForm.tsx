
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Trash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Form schema
const roomFormSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  property: z.string().min(1, "Property is required"),
  type: z.string().min(1, "Room type is required"),
  maxOccupancy: z.string().min(1, "Max occupancy is required"),
  basePrice: z.string().min(1, "Base price is required"),
  description: z.string().optional(),
  amenities: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  owner: z.string().optional(),
  isActive: z.boolean().default(true),
});

type RoomFormValues = z.infer<typeof roomFormSchema>;

interface AddEditRoomFormProps {
  mode: 'add' | 'edit';
  roomData?: RoomFormValues;
}

export function AddEditRoomForm({ mode, roomData }: AddEditRoomFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Setup form with default values
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: roomData || {
      roomNumber: '',
      property: '',
      type: '',
      maxOccupancy: '',
      basePrice: '',
      description: '',
      amenities: '',
      status: 'available',
      owner: '',
      isActive: true,
    },
  });

  function onSubmit(data: RoomFormValues) {
    // In a real application, this would send the data to a server
    console.log('Room form submitted:', data);
    
    toast({
      title: `Room ${mode === 'add' ? 'created' : 'updated'} successfully`,
      description: `Room ${data.roomNumber} has been ${mode === 'add' ? 'added to' : 'updated in'} the system.`,
    });
    
    // Redirect to the rooms list page
    navigate('/rooms');
  }

  function handleCancel() {
    // If we have roomData, we go back to the room detail view, otherwise to the rooms list
    if (mode === 'edit' && roomData) {
      navigate(`/rooms/view/${roomData.roomNumber}`);
    } else {
      navigate('/rooms');
    }
  }

  function handleDelete() {
    if (mode === 'edit' && roomData) {
      // In a real application, this would send a delete request to a server
      console.log('Deleting room:', roomData.roomNumber);
      
      toast({
        title: 'Room deleted',
        description: `Room ${roomData.roomNumber} has been removed from the system.`,
      });
      
      navigate('/rooms');
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/rooms">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{mode === 'add' ? 'Add New Room' : 'Edit Room'}</h1>
            <p className="text-muted-foreground mt-1">
              {mode === 'add' ? 'Create a new room in the system' : `Modifying room ${roomData?.roomNumber}`}
            </p>
          </div>
        </div>
        {mode === 'edit' && (
          <Button variant="destructive" className="flex items-center gap-2" onClick={handleDelete}>
            <Trash className="h-4 w-4" />
            Delete Room
          </Button>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the essential details for this room</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="roomNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="property"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a property" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Marina Tower">Marina Tower</SelectItem>
                          <SelectItem value="Downtown Heights">Downtown Heights</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a room type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="Deluxe">Deluxe</SelectItem>
                          <SelectItem value="Suite">Suite</SelectItem>
                          <SelectItem value="Executive">Executive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="maxOccupancy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Occupancy</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="basePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Price</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 150" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
                <CardDescription>Add more information about the room</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter a description of the room"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amenities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amenities</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List amenities, one per line"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter amenities separated by line breaks (e.g., WiFi, TV, Mini-fridge)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="occupied">Occupied</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="owner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an owner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="John Doe">John Doe</SelectItem>
                          <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                          <SelectItem value="Robert Wilson">Robert Wilson</SelectItem>
                          <SelectItem value="Lisa Wong">Lisa Wong</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The owner of this property
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Active Status</FormLabel>
                        <FormDescription>
                          Make the room available for bookings
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {mode === 'add' ? 'Create Room' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
