
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Owner } from '@/services/supabase-types';

// Define schema for form validation
const ownerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  commission_rate: z.coerce.number().min(0).max(100).optional(),
  payment_details: z.string().optional(),
});

type OwnerFormProps = {
  initialValues?: Partial<Owner>;
  onSubmit: (values: z.infer<typeof ownerSchema>) => void;
  isLoading: boolean;
};

export default function OwnerForm({ initialValues, onSubmit, isLoading }: OwnerFormProps) {
  const form = useForm<z.infer<typeof ownerSchema>>({
    resolver: zodResolver(ownerSchema),
    defaultValues: {
      name: initialValues?.name || '',
      email: initialValues?.email || '',
      phone: initialValues?.phone || '',
      address: initialValues?.address || '',
      city: initialValues?.city || '',
      country: initialValues?.country || '',
      commission_rate: initialValues?.commission_rate || 10,
      payment_details: initialValues?.payment_details || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="owner@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 234 567 890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="commission_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commission Rate (%)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="100" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="New York" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="USA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="payment_details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Details</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Bank account details, payment preferences, etc." 
                  className="h-32" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Owner"}
        </Button>
      </form>
    </Form>
  );
}
