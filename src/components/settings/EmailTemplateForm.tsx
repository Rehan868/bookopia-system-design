
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface EmailTemplateFormProps {
  templateId?: string;
}

export const EmailTemplateForm = ({ templateId }: EmailTemplateFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  // Sample data for edit mode
  React.useEffect(() => {
    if (templateId) {
      // In a real app, fetch template data here
      console.log("Fetching template with ID:", templateId);
    }
  }, [templateId]);

  const onSubmit = async (data: any) => {
    try {
      // TODO: Implement template saving logic
      console.log("Saving template data:", data);
      
      toast({
        title: templateId ? "Email Template Updated" : "Email Template Created",
        description: "The email template has been saved successfully.",
      });
      
      // Navigate back to template list
      navigate('/settings/email-templates');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save email template.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate('/settings/email-templates');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Template Name</Label>
          <Input id="name" {...register('name')} required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subject">Subject Line</Label>
          <Input id="subject" {...register('subject')} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body">Email Body</Label>
          <Textarea 
            id="body" 
            {...register('body')} 
            required 
            className="min-h-[200px]"
            placeholder="Write your email template here. Use {{variable}} for dynamic content."
          />
        </div>

        <div className="bg-muted p-4 rounded-md">
          <h3 className="text-sm font-medium mb-2">Available Variables</h3>
          <ul className="text-sm space-y-1">
            <li><code>{"{{guest_name}}"}</code> - Guest's full name</li>
            <li><code>{"{{check_in_date}}"}</code> - Check-in date</li>
            <li><code>{"{{check_out_date}}"}</code> - Check-out date</li>
            <li><code>{"{{property_name}}"}</code> - Property name</li>
            <li><code>{"{{room_number}}"}</code> - Room number</li>
            <li><code>{"{{booking_number}}"}</code> - Booking reference</li>
          </ul>
        </div>
      </div>
      
      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={handleCancel}>Cancel</Button>
        <Button type="submit">{templateId ? 'Update' : 'Create'} Template</Button>
      </div>
    </form>
  );
};
