
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface PropertyFormProps {
  propertyId?: string;
}

const PropertyForm = ({ propertyId }: PropertyFormProps) => {
  const { toast } = useToast();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      // TODO: Implement property saving logic
      toast({
        title: propertyId ? "Property Updated" : "Property Created",
        description: "The property has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save property.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Property Name</Label>
            <Input id="name" {...register('name')} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea id="address" {...register('address')} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register('city')} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" {...register('state')} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="postal_code">Postal Code</Label>
            <Input id="postal_code" {...register('postal_code')} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register('phone')} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" {...register('website')} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="check_in_time">Check-in Time</Label>
            <Input id="check_in_time" type="time" {...register('check_in_time')} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="check_out_time">Check-out Time</Label>
            <Input id="check_out_time" type="time" {...register('check_out_time')} />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button">Cancel</Button>
        <Button type="submit">{propertyId ? 'Update' : 'Create'} Property</Button>
      </div>
    </form>
  );
};

export default PropertyForm;
