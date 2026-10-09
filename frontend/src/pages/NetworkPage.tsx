import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Network } from 'lucide-react';

export const NetworkPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Connections"
        description="Build your direct network of student developers, designers, and founders"
      />

      <Card className="text-center py-12 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
          <Network className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Your Student Network</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Connect with peers in Discover or Teams to build your professional network. Connection requests and mutual matches will appear here.
        </p>
      </Card>
    </div>
  );
};
