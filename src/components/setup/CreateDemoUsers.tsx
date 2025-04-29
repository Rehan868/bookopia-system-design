
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function CreateDemoUsers() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateDemoUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-demo-users');
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Demo users have been created successfully!",
      });
    } catch (err) {
      console.error('Error creating demo users:', err);
      toast({
        title: "Error",
        description: "Failed to create demo users. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-muted/50 mt-4">
      <h3 className="text-lg font-medium mb-2">Create Demo Users</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Click the button below to create demo users with different roles:
        <br />
        • admin@example.com (Admin)
        <br />
        • manager@example.com (Manager)
        <br />
        • staff@example.com (Staff)
        <br />
        • owner@example.com (Owner)
        <br />
        <br />
        All accounts use password: "password"
      </p>
      <Button 
        onClick={handleCreateDemoUsers}
        disabled={isLoading}
        variant="outline"
      >
        {isLoading ? 'Creating...' : 'Create Demo Users'}
      </Button>
    </div>
  );
}
