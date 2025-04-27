
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RoomTypeForm from '@/components/settings/RoomTypeForm';

const RoomTypeEdit = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Room Type</h1>
      <Card>
        <CardHeader>
          <CardTitle>Room Type Details</CardTitle>
        </CardHeader>
        <CardContent>
          <RoomTypeForm typeId={id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomTypeEdit;
