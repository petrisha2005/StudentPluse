import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Bell } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Stay updated on team requests, opportunity updates, and network connections"
      />

      <Card className="text-center py-16 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
          <Bell className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">All Caught Up!</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          You have no unread notifications right now. Activity on your profile or team applications will be alerted here.
        </p>
      </Card>
    </div>
  );
};
