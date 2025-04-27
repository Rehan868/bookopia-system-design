
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TodayCheckins } from './TodayCheckins';
import { TodayCheckouts } from './TodayCheckouts';

export function ActivitySection() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Today's Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TodayCheckins />
          <TodayCheckouts />
        </div>
      </CardContent>
    </Card>
  );
}
