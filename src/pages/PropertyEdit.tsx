
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PropertyForm from '@/components/settings/PropertyForm';

const PropertyEdit = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Property</h1>
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyForm propertyId={id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyEdit;
