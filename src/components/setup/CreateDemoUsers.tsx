
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function CreateDemoUsers() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleCreateDemoUsers = async () => {
    setIsLoading(true);
    setShowResults(false);
    try {
      // First check if the edge function exists
      const { data: functions } = await supabase.functions.listFunctions();
      const functionExists = functions?.some(fn => fn.name === 'create-demo-users');
      
      if (!functionExists) {
        throw new Error("The 'create-demo-users' edge function is not deployed. Please check your Supabase configuration.");
      }
      
      const { data, error } = await supabase.functions.invoke('create-demo-users');
      
      if (error) {
        console.error('Error from edge function:', error);
        throw error;
      }
      
      console.log('Demo users creation response:', data);
      
      if (!data || !Array.isArray(data.results)) {
        throw new Error("Invalid response format from the edge function");
      }
      
      setResults(data.results || []);
      setShowResults(true);
      
      // Check if any users were actually created
      const createdUsers = data.results.filter((result: any) => result.status === 'created');
      
      if (createdUsers.length > 0) {
        toast({
          title: "Success",
          description: "Demo users have been created successfully!",
        });
      } else {
        toast({
          title: "Info",
          description: "All demo users already exist. No new users were created.",
        });
      }
    } catch (err) {
      console.error('Error creating demo users:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create demo users. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-muted/50">
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
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating users...
          </>
        ) : 'Create Demo Users'}
      </Button>
      
      {showResults && results.length > 0 && (
        <div className="mt-4 text-xs">
          <h4 className="font-medium mb-1">Results:</h4>
          <ul className="list-disc pl-4 space-y-1">
            {results.map((result, index) => (
              <li key={index}>
                {result.email}: {result.status}
                {result.message ? ` - ${result.message}` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
