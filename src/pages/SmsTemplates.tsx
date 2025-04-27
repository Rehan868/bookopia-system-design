
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SmsTemplateList from '@/components/settings/SmsTemplateList';

const SmsTemplates = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">SMS Templates</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage SMS Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <SmsTemplateList />
        </CardContent>
      </Card>
    </div>
  );
};

export default SmsTemplates;
