
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PropertyForm from '@/components/settings/PropertyForm';

const PropertyAdd = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add New Property</h1>
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyAdd;
