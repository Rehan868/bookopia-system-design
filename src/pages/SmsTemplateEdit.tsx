
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SmsTemplateForm } from '@/components/settings/SmsTemplateForm';

const SmsTemplateEdit = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit SMS Template</h1>
      <Card>
        <CardHeader>
          <CardTitle>SMS Template Details</CardTitle>
        </CardHeader>
        <CardContent>
          <SmsTemplateForm templateId={id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SmsTemplateEdit;
