
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmailTemplateForm } from '@/components/settings/EmailTemplateForm';

const EmailTemplateAdd = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Email Template</h1>
      <Card>
        <CardHeader>
          <CardTitle>Email Template Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EmailTemplateForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTemplateAdd;
