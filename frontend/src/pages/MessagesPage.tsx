import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { MessageSquare } from 'lucide-react';

export const MessagesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Direct Messages"
        description="Collaborate directly with teammates and student connections"
      />

      <Card className="text-center py-16 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Direct Messaging Engine</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Real-time student-to-student messaging module prepared for upcoming Phase release. Connect with a teammate to start a conversation!
        </p>
      </Card>
    </div>
  );
};
