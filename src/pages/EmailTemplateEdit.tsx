
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmailTemplateForm } from '@/components/settings/EmailTemplateForm';

const EmailTemplateEdit = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Email Template</h1>
      <Card>
        <CardHeader>
          <CardTitle>Email Template Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EmailTemplateForm templateId={id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTemplateEdit;
