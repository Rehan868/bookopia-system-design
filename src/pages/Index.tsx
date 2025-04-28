
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-3xl px-4">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Bookopia Hotel Management System</h1>
        <p className="text-xl text-muted-foreground">
          A complete solution for managing your hotel operations, bookings, and staff.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Button 
            size="lg" 
            className="w-full" 
            onClick={() => navigate('/login')}
          >
            Staff Login
          </Button>
          <Button 
            size="lg" 
            className="w-full" 
            variant="outline" 
            onClick={() => navigate('/owner/login')}
          >
            Owner Login
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Booking Management</h2>
            <p className="text-muted-foreground">Easily manage reservations, check-ins, and check-outs.</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Room Management</h2>
            <p className="text-muted-foreground">Track room availability, cleaning status, and maintenance.</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Owner Portal</h2>
            <p className="text-muted-foreground">Dedicated interface for property owners to monitor performance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
