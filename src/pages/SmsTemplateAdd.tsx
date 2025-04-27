
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SmsTemplateForm } from '@/components/settings/SmsTemplateForm';

const SmsTemplateAdd = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add SMS Template</h1>
      <Card>
        <CardHeader>
          <CardTitle>SMS Template Details</CardTitle>
        </CardHeader>
        <CardContent>
          <SmsTemplateForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SmsTemplateAdd;
