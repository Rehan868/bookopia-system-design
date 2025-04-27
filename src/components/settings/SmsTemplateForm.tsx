
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface SmsTemplateFormProps {
  templateId?: string;
}

export const SmsTemplateForm = ({ templateId }: SmsTemplateFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, watch } = useForm();
  const [charCount, setCharCount] = React.useState(0);
  const messageText = watch('message', '');

  // Update character count
  React.useEffect(() => {
    setCharCount(messageText?.length || 0);
  }, [messageText]);

  // Sample data for edit mode
  React.useEffect(() => {
    if (templateId) {
      // In a real app, fetch template data here
      console.log("Fetching SMS template with ID:", templateId);
    }
  }, [templateId]);

  const onSubmit = async (data: any) => {
    try {
      // TODO: Implement template saving logic
      console.log("Saving SMS template data:", data);
      
      toast({
        title: templateId ? "SMS Template Updated" : "SMS Template Created",
        description: "The SMS template has been saved successfully.",
      });
      
      // Navigate back to template list
      navigate('/settings/sms-templates');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save SMS template.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate('/settings/sms-templates');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Template Name</Label>
          <Input id="name" {...register('name')} required />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="message">Message</Label>
            <span className="text-sm text-muted-foreground">{charCount}/160 characters</span>
          </div>
          <Textarea 
            id="message" 
            {...register('message')} 
            required 
            className="min-h-[120px]"
            placeholder="Write your SMS template here. Use {{variable}} for dynamic content."
            maxLength={160}
          />
        </div>

        <div className="bg-muted p-4 rounded-md">
          <h3 className="text-sm font-medium mb-2">Available Variables</h3>
          <ul className="text-sm space-y-1">
            <li><code>{"{{name}}"}</code> - Guest's name</li>
            <li><code>{"{{check_in}}"}</code> - Check-in date</li>
            <li><code>{"{{check_out}}"}</code> - Check-out date</li>
            <li><code>{"{{property}}"}</code> - Property name</li>
            <li><code>{"{{room}}"}</code> - Room number</li>
            <li><code>{"{{ref}}"}</code> - Booking reference</li>
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
