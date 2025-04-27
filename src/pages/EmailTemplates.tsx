
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EmailTemplateList from '@/components/settings/EmailTemplateList';

const EmailTemplates = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Email Templates</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Email Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <EmailTemplateList />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTemplates;
