
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface RoomTypeFormProps {
  typeId?: string;
}

const RoomTypeForm = ({ typeId }: RoomTypeFormProps) => {
  const { toast } = useToast();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      // TODO: Implement room type saving logic
      toast({
        title: typeId ? "Room Type Updated" : "Room Type Created",
        description: "The room type has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save room type.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Room Type Name</Label>
            <Input id="name" {...register('name')} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="base_rate">Base Rate</Label>
            <Input 
              id="base_rate" 
              type="number" 
              step="0.01" 
              {...register('base_rate')} 
              required 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register('description')} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="max_occupancy">Maximum Occupancy</Label>
            <Input 
              id="max_occupancy" 
              type="number" 
              {...register('max_occupancy')} 
              required 
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button">Cancel</Button>
        <Button type="submit">{typeId ? 'Update' : 'Create'} Room Type</Button>
      </div>
    </form>
  );
};

export default RoomTypeForm;
