
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RoomTypeForm from '@/components/settings/RoomTypeForm';

const RoomTypeAdd = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Room Type</h1>
      <Card>
        <CardHeader>
          <CardTitle>Room Type Details</CardTitle>
        </CardHeader>
        <CardContent>
          <RoomTypeForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomTypeAdd;
